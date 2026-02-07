import React from 'react';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { category: 'Normal Assignment',   keys: ['Ctrl', '\\'],         description: 'Execute task' },
  { category: 'Normal Assignment',   keys: ['Ctrl', 'Shift', ']'], description: 'Paste formatted feedback' },
  { category: 'Rechecks',  keys: ['Ctrl', '/'],          description: 'Open recheck' },
  { category: 'Rechecks',  keys: ['Ctrl', '.'],          description: 'Execute latest recheck' },
  { category: 'Rechecks',  keys: ['Ctrl', ', (comma)'],          description: 'Focus reason field' },
];

const grouped = shortcuts.reduce<Record<string, Shortcut[]>>((acc, s) => {
  acc[s.category] = acc[s.category] || [];
  acc[s.category].push(s);
  return acc;
}, {});

const CompactShortcuts: React.FC = () => {
  return (
    <div className="
      bg-white dark:bg-slate-900 
      border border-slate-200 dark:border-slate-700 
      rounded-lg shadow-sm dark:shadow-slate-950/40 
      text-slate-800 dark:text-slate-200 
      text-sm overflow-hidden
    ">
      {/* Header */}
      <div className="
        px-4 py-2.5 
        border-b border-slate-200 dark:border-slate-700 
        bg-slate-50 dark:bg-slate-800/60
      ">
        <h2 className="text-base font-semibold tracking-tight">
          Keyboard Shortcuts
        </h2>
      </div>

      {/* Content */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="px-4 py-2.5">
            <h3 className="
              mb-1.5 text-xs font-semibold uppercase tracking-wider 
              text-slate-500 dark:text-slate-400
            ">
              {category}
            </h3>

            <div className="space-y-1.5">
              {items.map((shortcut, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-slate-700 dark:text-slate-300 truncate pr-3">
                    {shortcut.description}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    {shortcut.keys.map((k, idx) => (
                      <React.Fragment key={idx}>
                        <kbd
                          className="
                            min-w-[1.9rem] rounded 
                            border border-slate-300 dark:border-slate-600 
                            bg-slate-100 dark:bg-slate-800 
                            px-1.5 py-0.5 
                            text-xs font-mono font-semibold 
                            text-slate-700 dark:text-slate-300 
                            shadow-sm dark:shadow-inner
                          "
                        >
                          {k}
                        </kbd>
                        {idx < shortcut.keys.length - 1 && (
                          <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                            +
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tiny footer tip */}
      <div className="
        px-4 py-2 text-xs 
        text-slate-500 dark:text-slate-400 
        border-t border-slate-200 dark:border-slate-700 
        bg-slate-50/70 dark:bg-slate-950/30
      ">
        PH JS Kicker
      </div>
    </div>
  );
};

export default CompactShortcuts;