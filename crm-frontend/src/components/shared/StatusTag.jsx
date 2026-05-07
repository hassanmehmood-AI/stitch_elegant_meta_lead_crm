const STATUS_MAP = {
  'New Lead':          { bg: 'bg-slate-100',      text: 'text-slate-600'   },
  'CREATED':           { bg: 'bg-slate-100',      text: 'text-slate-600'   },
  'Qualified':         { bg: 'bg-green-100',      text: 'text-green-700'   },
  'Meeting Scheduled': { bg: 'bg-green-100',      text: 'text-green-700'   },
  'Highly Interested': { bg: 'bg-green-100',      text: 'text-green-700'   },
  'In Discussion':     { bg: 'bg-green-100',      text: 'text-green-700'   },
  'Meeting Done':      { bg: 'bg-green-700',      text: 'text-white'       },
  'Converted':         { bg: 'bg-green-700',      text: 'text-white'       },
  'Strong Follow-up':  { bg: 'bg-green-100',      text: 'text-green-700'   },
  'Not Qualified':     { bg: 'bg-red-700',        text: 'text-white'       },
  'Not Interested':    { bg: 'bg-red-700',        text: 'text-white'       },
  'Not Responding':    { bg: 'bg-red-700',        text: 'text-white'       },
  'Lead Lost':         { bg: 'bg-red-900',        text: 'text-white'       },
  'Busy call back':    { bg: 'bg-green-100',      text: 'text-green-700'   },
};

export default function StatusTag({ status }) {
  const s = STATUS_MAP[status] ?? { bg: 'bg-slate-100', text: 'text-slate-600' };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
      {status}
    </span>
  );
}
