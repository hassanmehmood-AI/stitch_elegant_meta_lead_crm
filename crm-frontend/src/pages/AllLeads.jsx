import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import LeadsTable from '../components/leads/LeadsTable';
import AddLeadModal from '../components/leads/AddLeadModal';
import FilterDropdown from '../components/shared/FilterDropdown';
import LeadDetailsDrawer from '../components/shared/LeadDetailsDrawer';
import { useRole } from '../hooks/useRole';
import { api } from '../services/api';

const DATE_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All Time'];
const STATUS_OPTIONS = ['All Statuses', 'New Lead', 'CREATED', 'Qualified', 'Meeting Scheduled', 'Highly Interested', 'In Discussion', 'Meeting Done', 'Converted', 'Strong Follow-up', 'Not Qualified', 'Not Interested', 'Not Responding', 'Lead Lost', 'Busy call back'];

export default function AllLeads() {
  const role = useRole();
  const initials = localStorage.getItem('crm_initials') || 'MC';
  const name     = localStorage.getItem('crm_name')     || 'Marcus Chen';
  const displayRole = role === 'ceo' ? 'Chief Executive Officer' : role === 'manager' ? 'Sales Manager' : 'Account Manager';
  const USER = { name, role: displayRole, initials };

  const [showAddLead, setShowAddLead] = useState(false);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const dateRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    // Fetch agents once
    api.getAgents().then(setAgents).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const activeStatus = statusFilter !== 'All Statuses' ? statusFilter : null;
        const data = await api.getLeads(searchQuery, activeStatus, page, pageSize);
        setLeads(data);
      } catch (err) {
        setError(err.message || 'Failed to load leads. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, page]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setShowDateDropdown(false);
      if (statusRef.current && !statusRef.current.contains(e.target)) setShowStatusDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddLead = async (form) => {
    const newLeadData = {
      initials: form.name.split(' ').map((n) => n[0]).join('').toUpperCase(),
      name: form.name,
      company: form.company || '—',
      source: form.source,
      status: form.status,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      assignedTo: null,
    };
    setLoading(true);
    try {
      const savedLead = await api.addLead(newLeadData);
      setLeads((prev) => [savedLead, ...prev]);
      setShowAddLead(false);
    } catch (err) {
      setError(err.message || 'Failed to add lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const maxLeadDate = leads.length
    ? leads.reduce((max, l) => { const d = new Date(l.createdDate); return d > max ? d : max; }, new Date(0))
    : new Date();

  const filteredLeads = leads.filter((lead) => {
    if (dateFilter !== 'All Time') {
      const days = dateFilter === 'Last 7 Days' ? 7 : dateFilter === 'Last 30 Days' ? 30 : 90;
      const cutoff = new Date(maxLeadDate);
      cutoff.setDate(cutoff.getDate() - days);
      if (new Date(lead.createdDate) < cutoff) return false;
    }
    return true;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar user={USER} />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNavbar 
          onAddLead={role !== 'ceo' ? () => setShowAddLead(true) : undefined} 
          searchPlaceholder="Search leads, companies..." 
          role={role} 
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        <div className="p-container-padding max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-xl">
            <div>
              <h2 className="font-h2 text-[32px] text-on-surface mb-2">All Leads</h2>
              <p className="text-slate-500">Manage and track your pipeline of prospective clients.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">

              {/* Date Range Filter */}
              <div ref={dateRef} className="relative">
                <FilterDropdown 
                  icon="event" 
                  label={dateFilter} 
                  onClick={() => { setShowDateDropdown((v) => !v); setShowStatusDropdown(false); }} 
                />
                {showDateDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-blue-100/30 rounded-xl shadow-lg z-20 py-1">
                    {DATE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setDateFilter(opt); setShowDateDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          dateFilter === opt
                            ? 'text-blue-600 font-semibold bg-blue-50'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div ref={statusRef} className="relative">
                <FilterDropdown 
                  icon="filter_alt" 
                  label={statusFilter} 
                  onClick={() => { setShowStatusDropdown((v) => !v); setShowDateDropdown(false); }} 
                />
                {showStatusDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-blue-100/30 rounded-xl shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setStatusFilter(opt); setShowStatusDropdown(false); }}
                        className={`w-full text-left px-4 py-1.5 text-[11px] transition-colors ${
                          statusFilter === opt
                            ? 'text-blue-600 font-bold bg-blue-50'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="p-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all">
                <span className="material-symbols-outlined">view_list</span>
              </button>
            </div>
          </div>

          {error ? (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <span className="material-symbols-outlined text-4xl text-red-400">error_outline</span>
              <p className="text-red-500 font-semibold">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  const activeStatus = statusFilter !== 'All Statuses' ? statusFilter : null;
                  api.getLeads(searchQuery, activeStatus, page, pageSize)
                    .then((data) => { setLeads(data); setLoading(false); })
                    .catch((err) => { setError(err.message || 'Failed to load leads.'); setLoading(false); });
                }}
                className="px-5 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Loading leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-3 block">search_off</span>
              No leads match the selected filters.
            </div>
          ) : (
            <LeadsTable 
              leads={filteredLeads} 
              agents={agents}
              page={page} 
              pageSize={pageSize} 
              onPageChange={setPage} 
              onViewDetail={(lead) => setSelectedLead(lead)}
              onUpdate={() => {
                api.getLeads(searchQuery, statusFilter !== 'All Statuses' ? statusFilter : null, page, pageSize).then(setLeads);
              }} 
            />
          )}
        </div>
      </main>

      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} onSubmit={handleAddLead} />}
      <LeadDetailsDrawer lead={selectedLead} isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
