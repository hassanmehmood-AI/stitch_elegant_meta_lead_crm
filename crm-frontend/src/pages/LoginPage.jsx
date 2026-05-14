import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('ceo');
  const [form, setForm] = useState({ email: 'ceo@pentacrm.com', password: 'password', remember: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  // When role changes, update email
  useEffect(() => {
    setForm(f => ({ ...f, email: `${role}@pentacrm.com` }));
  }, [role]);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setError(null);
      const result = await api.login(form.email, form.password);
      localStorage.setItem('crm_role', result.role);
      localStorage.setItem('crm_token', result.token);
      localStorage.setItem('crm_initials', result.initials);
      localStorage.setItem('crm_name', result.name);
      if (result.role === 'ceo') navigate('/dashboard/ceo');
      if (result.role === 'manager') navigate('/dashboard/manager');
      if (result.role === 'employee') navigate('/dashboard/employee');
    } catch (err) {
      console.warn("Backend login failed, using mock bypass for dev.", err);
      // Fallback for dev/demo if backend is not setup
      const mockResult = {
        role: role,
        token: 'mock-token',
        initials: role === 'ceo' ? 'MS' : role === 'manager' ? 'AS' : 'MO',
        name: role === 'ceo' ? 'Marcus Sterling' : role === 'manager' ? 'Alex Sterling' : 'Momin'
      };
      localStorage.setItem('crm_role', mockResult.role);
      localStorage.setItem('crm_token', mockResult.token);
      localStorage.setItem('crm_initials', mockResult.initials);
      localStorage.setItem('crm_name', mockResult.name);

      if (mockResult.role === 'ceo') navigate('/dashboard/ceo');
      else if (mockResult.role === 'manager') navigate('/dashboard/manager');
      else navigate('/dashboard/employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center px-12 py-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5 relative text-on-surface" style={{ backgroundColor: '#fbf8ff' }}>
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 pt-32 pb-32">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 transform hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="Lead Management CRM Logo" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
          <h1 className="text-xl font-medium text-on-surface tracking-[0.06em]">Lead Management & CRM</h1>
        </div>

        {/* Card */}
        <div className="bg-white border border-blue-600/10 shadow-[0_40px_60px_-15px_rgba(27,46,253,0.03)] rounded-3xl px-8 py-10 transform transition-all duration-300 hover:shadow-[0_40px_100px_-20px_rgba(27,46,253,0.15)]">
          {/* Demo role picker */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Your Role</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'ceo', label: 'CEO', icon: 'business_center' },
                { value: 'manager', label: 'Manager', icon: 'manage_accounts' },
                { value: 'employee', label: 'Employee', icon: 'person' },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex items-center gap-2 p-2 rounded-xl border-2 text-sm font-bold transition-all shadow-sm ${role === r.value
                    ? 'border-primary-container bg-blue-50/50 text-blue-700'
                    : 'border-transparent bg-slate-50 text-slate-500 hover:border-blue-100 hover:bg-white'
                    }`}
                >
                  <span className="material-symbols-outlined text-base">{r.icon}</span> {r.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-red-500 text-lg">error_outline</span>
              <p className="text-sm font-bold text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">mail</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="admin@pentacrm.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all shadow-inner"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={form.remember} onChange={set('remember')} className="w-4 h-4 rounded accent-blue-600 border-slate-300 focus:ring-blue-500" />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors">Forgot password?</button>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group w-full py-2.5 bg-primary-container text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-3 hover:bg-[#ff5a1f] hover:shadow-orange-200 hover:-translate-y-0.5 ${isSubmitting ? 'opacity-75' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span> Signing In...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">login</span>
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-3">
          © 2026 Penta Squad CRM · All rights reserved
        </p>
      </div>
    </div>
  );
}
