'use client';

export default function LichSuCuTruPage() {
  const historyLogs = [
    {
      id: 'log-1',
      date: '24/10/2025 09:15',
      action: 'New Resident Registration',
      details: 'Unit A-0501: Added resident Hoang Minh Tuan to permanent residence registry',
      actor: 'Nguyen Van An (Management)',
    },
    {
      id: 'log-2',
      date: '22/10/2025 14:30',
      action: 'Temporary Stay Extension',
      details: 'Unit A-1207: Extended temporary stay for 12 months for 02 occupants',
      actor: 'Nguyen Van An (Management)',
    },
    {
      id: 'log-3',
      date: '18/10/2025 10:00',
      action: 'Move-out Declaration',
      details: 'Unit B-0302: Completed move-out departure procedure and settled balance',
      actor: 'Le Thi Thu (Accounting)',
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
          Residence History & Audit Trail
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Audit log recording household additions, splits, move-ins, and departure records.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 divide-y divide-outline-variant/15">
        {historyLogs.map((log) => (
          <div key={log.id} className="p-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-on-surface">{log.action}</span>
                <span className="text-xs text-outline">•</span>
                <span className="text-xs text-on-surface-variant font-mono">{log.date}</span>
              </div>
              <p className="text-xs text-on-surface">{log.details}</p>
            </div>
            <span className="text-xs text-on-surface-variant font-medium flex-shrink-0">
              Logged by: <strong>{log.actor}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
