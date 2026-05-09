const STATUS_MAP = {
  // Neutral / Starting
  'New Lead':          { bg: 'bg-slate-50',       text: 'text-slate-500'   },
  'CREATED':           { bg: 'bg-slate-50',       text: 'text-slate-500'   },
  
  // Positive / Interest
  'Qualified':         { bg: 'bg-emerald-50',     text: 'text-emerald-600' },
  'Highly Interested': { bg: 'bg-emerald-50',     text: 'text-emerald-600' },
  
  // Active / Discussion
  'In Discussion':     { bg: 'bg-indigo-50',      text: 'text-indigo-600'  },
  'Strong Follow-up':  { bg: 'bg-indigo-50',      text: 'text-indigo-600'  },
  
  // Attention / Follow-up
  'Meeting Scheduled': { bg: 'bg-amber-50',       text: 'text-amber-600'   },
  'Busy call back':    { bg: 'bg-amber-50',       text: 'text-amber-600'   },
  
  // Success / Milestones
  'Meeting Done':      { bg: 'bg-blue-600',       text: 'text-white'       },
  'Converted':         { bg: 'bg-blue-700',       text: 'text-white'       },
  
  // Negative / Lost
  'Not Qualified':     { bg: 'bg-rose-50',        text: 'text-rose-500'    },
  'Not Interested':    { bg: 'bg-rose-50',        text: 'text-rose-500'    },
  'Not Responding':    { bg: 'bg-rose-50',        text: 'text-rose-500'    },
  'Lead Lost':         { bg: 'bg-slate-200',      text: 'text-slate-600'   },
};

export default function StatusTag({ status }) {
  const s = STATUS_MAP[status] ?? { bg: 'bg-slate-50', text: 'text-slate-500' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-tight ${s.bg} ${s.text} border border-black/5`}>
      {status}
    </span>
  );
}
