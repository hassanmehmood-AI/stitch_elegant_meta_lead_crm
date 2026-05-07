import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusTag from '../shared/StatusTag';
import { useRole } from '../../hooks/useRole';
import { api, AGENTS } from '../../services/api';

const AGENT_MAP = Object.fromEntries(AGENTS.map((a) => [a.initials, a]));

function AgentDropdown({ leadId, current, onAssign }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const agentInfo = current ? AGENT_MAP[current] : null;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
          agentInfo
            ? 'bg-blue-100 border-white text-blue-700 font-bold text-xs shadow-sm ring-2 ring-white'
            : 'border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50'
        }`}
      >
        {agentInfo ? (
          agentInfo.initials
        ) : (
          <span className="material-symbols-outlined text-xs">add</span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-blue-100/30 rounded-xl shadow-xl z-[100] py-1 overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Agent</p>
          </div>
          {current && (
            <button
              onClick={() => { onAssign(leadId, null); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors font-semibold"
            >
              Remove Assignment
            </button>
          )}
          {AGENTS.map((agent) => (
            <button
              key={agent.initials}
              onClick={() => { onAssign(leadId, agent.initials); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                current === agent.initials
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                  {agent.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold leading-tight truncate">{agent.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{agent.role}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LeadRow({ lead, onUpdate }) {
  const navigate = useNavigate();
  const role = useRole();
  const isRestricted = role === 'manager' || role === 'ceo';

  const handleAssign = async (leadId, agentInitials) => {
    await api.assignLeadToAgent(leadId, agentInitials);
    onUpdate?.(); // Refresh the list
  };

  return (
    <tr
      onClick={() => !isRestricted && navigate(`/leads/${lead.id}`)}
      className={`transition-colors group ${isRestricted ? 'cursor-default' : 'hover:bg-blue-50/20 cursor-pointer'}`}
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
            {lead.initials}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{lead.name}</p>
            <p className="text-xs text-slate-400">{lead.company}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-400 text-lg">language</span>
          <span className="text-sm text-slate-600">{lead.source}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <StatusTag status={lead.status} />
      </td>
      <td className="px-6 py-5 text-sm text-slate-500">{lead.createdDate}</td>
      <td className="px-6 py-5">
        {role === 'manager' ? (
          <AgentDropdown 
            leadId={lead.id} 
            current={lead.assignedTo || lead.assignedAgent} 
            onAssign={handleAssign} 
          />
        ) : role === 'ceo' ? (
          (lead.assignedTo || lead.assignedAgent) ? (
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border-2 border-white">
              {(lead.assignedTo || lead.assignedAgent)[0]}
            </div>
          ) : (
            <div className="flex items-center justify-center w-7 h-7 rounded-full border border-dashed border-slate-300 text-slate-400">
              <span className="material-symbols-outlined text-xs">remove</span>
            </div>
          )
        ) : (
          lead.assignedTo ? (
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border-2 border-white">
              {lead.assignedTo[0]}
            </div>
          ) : (
            <div className="flex items-center justify-center w-7 h-7 rounded-full border border-dashed border-slate-300 text-slate-400">
              <span className="material-symbols-outlined text-xs">add</span>
            </div>
          )
        )}
      </td>
      <td className="px-6 py-5 text-right">
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-slate-300 group-hover:text-blue-600 transition-colors"
        >
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </td>
    </tr>
  );
}
