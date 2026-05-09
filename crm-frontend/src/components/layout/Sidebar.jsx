import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';

const NAV = [
  { icon: 'dashboard',      label: 'Dashboard',    to: 'dashboard',     roles: ['ceo', 'manager', 'employee'] },
  { icon: 'filter_list',    label: 'All Leads',    to: '/leads',        roles: ['ceo', 'manager'] },
  { icon: 'person',         label: 'My Leads',     to: '/leads/my',     roles: ['employee'] },
  { icon: 'groups',         label: 'Team',         to: '/team',         roles: ['ceo', 'manager'] },
  { icon: 'calendar_today', label: 'Meetings',     to: '/meetings',     roles: ['ceo', 'manager'] },
];

export default function Sidebar({ user }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const role = useRole();

  const handleLogout = () => {
    localStorage.removeItem('crm_role');
    navigate('/login');
  };
  const dashboardPath = `/dashboard/${role}`;
  const visibleNav = NAV.filter((item) => item.roles.includes(role)).map((item) => {
    if (item.to === 'dashboard') return { ...item, to: dashboardPath };
    return item;
  });

  const active = (to) => {
    if (to === dashboardPath) return pathname.startsWith('/dashboard/');
    if (to === '/leads/my') return pathname === '/leads/my' || (pathname.startsWith('/leads/') && pathname !== '/leads/assign');
    if (to === '/leads') return pathname === '/leads';
    return pathname === to;
  };

  return (
    <aside className="fixed left-0 h-screen w-64 border-r border-blue-100/20 bg-slate-50/50 backdrop-blur-md shadow-[40px_0_60px_-15px_rgba(27,46,253,0.03)] flex flex-col py-6 px-4 z-50">
      <div className="mb-10 px-2 flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
        <div>
          <h1 className="text-xl font-bold text-blue-700 tracking-tight leading-none">Penta CRM</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Lead Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {visibleNav.map(({ icon, label, to }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
              active(to)
                ? 'text-blue-700 bg-blue-50/50 font-semibold border-r-4 border-blue-600 rounded-l-xl'
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/30 rounded-xl font-medium'
            }`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-blue-100/20">
        {user && (
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.initials || user.name?.[0] || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
