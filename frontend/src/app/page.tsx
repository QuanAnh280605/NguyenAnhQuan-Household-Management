'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockFeedbacks } from '@/lib/mock-data';

export default function HomePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const monthlyFlowData = [
    { month: 'May/25', in: 18, out: 5 },
    { month: 'Jun/25', in: 24, out: 6 },
    { month: 'Jul/25', in: 19, out: 4 },
    { month: 'Aug/25', in: 22, out: 7 },
    { month: 'Sep/25', in: 15, out: 3 },
    { month: 'Oct/25', in: 12, out: 2 },
  ];

  const maxVal = 28;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(false);
    setToastMessage('New resident record successfully registered in operations database!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex flex-col w-full space-y-5 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 bg-emerald-700 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 text-sm font-medium">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Operational Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 lg:p-5 rounded-lg border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
              Building Operations Command Console
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
              Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Parkview Tower Complex (Towers A & B) • Real-time telemetry as of Oct 24, 2025
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => {
              setToastMessage('Shift operational log is exporting to Excel file...');
              setTimeout(() => setToastMessage(null), 3500);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">file_download</span>
            <span>Export Shift Report</span>
          </button>

          <Link
            href="/phi-chung-cu"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">receipt_long</span>
            <span>Quick Billing</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">person_add</span>
            <span>Register Resident</span>
          </button>
        </div>
      </div>

      {/* 4 Professional KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Total Apartments */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              TOTAL APARTMENTS
            </span>
            <span className="p-1 rounded bg-slate-100 text-blue-800">
              <span className="material-symbols-outlined text-[18px]">apartment</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              320 <span className="text-xs font-normal text-slate-500">units</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>Occupied: <strong>298</strong> (93.1%)</span>
              <span className="text-slate-400">•</span>
              <span>Vacant: <strong>24</strong></span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1 border-t border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>12 units currently in fit-out</span>
          </div>
        </div>

        {/* Total Residents */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              DEMOGRAPHIC SCALE
            </span>
            <span className="p-1 rounded bg-slate-100 text-blue-800">
              <span className="material-symbols-outlined text-[18px]">groups</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              1,248 <span className="text-xs font-normal text-slate-500">residents</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>306 households</span>
              <span className="text-slate-400">•</span>
              <span>Avg 3.9 / household</span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1 border-t border-slate-100">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>Net growth +12 residents this month</span>
          </div>
        </div>

        {/* Fee Collection Progress */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              BILLING OCT 2025
            </span>
            <span className="p-1 rounded bg-slate-100 text-blue-800">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              564.2M <span className="text-xs font-normal text-slate-500">VND</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>Rate: <strong>81.7%</strong> collected</span>
              <span className="text-red-600 font-medium">42 unpaid</span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
            <span>Target: 690.7M VND</span>
            <Link href="/phi-chung-cu" className="text-blue-700 font-semibold hover:underline">
              Outstanding debt
            </Link>
          </div>
        </div>

        {/* Operational Issues & Feedbacks */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              TICKETS & INCIDENTS
            </span>
            <span className="p-1 rounded bg-slate-100 text-blue-800">
              <span className="material-symbols-outlined text-[18px]">assignment_late</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              14 <span className="text-xs font-normal text-slate-500">tickets</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span className="text-red-600 font-semibold">2 urgent</span>
              <span className="text-slate-400">•</span>
              <span>4 in progress</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700">8 resolved</span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1 border-t border-slate-100">
            <span className="material-symbols-outlined text-[14px] text-blue-700">timer</span>
            <span>Avg response SLA: 18 mins</span>
          </div>
        </div>
      </div>

      {/* Main Operations Grid: 2 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Columns: Monthly Resident Migration Bar Chart & Recent Feedbacks */}
        <div className="lg:col-span-2 space-y-5">
          {/* Monthly Migration Chart */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Monthly Resident Movement Trends
                </h2>
                <p className="text-xs text-slate-500">
                  Move-in and move-out counts over the last 6 months
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-blue-700"></span>
                  <span>Move In</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-slate-400"></span>
                  <span>Move Out</span>
                </div>
              </div>
            </div>

            {/* Structured Bar Visualization */}
            <div className="pt-4 pb-1">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 h-48 border-b border-slate-200 px-2">
                {monthlyFlowData.map((item, idx) => {
                  const inHeight = Math.round((item.in / maxVal) * 100);
                  const outHeight = Math.round((item.out / maxVal) * 100);

                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full gap-1">
                      <div className="flex items-end gap-1.5 w-full justify-center h-full">
                        {/* In Bar */}
                        <div
                          style={{ height: `${inHeight}%` }}
                          className="w-4 sm:w-6 bg-blue-700 hover:bg-blue-800 rounded-t transition-all group relative flex justify-center"
                        >
                          <span className="absolute -top-5 text-[10px] font-bold text-slate-700 opacity-80 group-hover:opacity-100">
                            +{item.in}
                          </span>
                        </div>
                        {/* Out Bar */}
                        <div
                          style={{ height: `${outHeight}%` }}
                          className="w-4 sm:w-6 bg-slate-300 hover:bg-slate-400 rounded-t transition-all group relative flex justify-center"
                        >
                          <span className="absolute -top-5 text-[10px] font-bold text-slate-500 opacity-80 group-hover:opacity-100">
                            -{item.out}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 mt-2">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2.5 px-1">
                <span>Total 6-month move-in: <strong>+110 residents</strong></span>
                <span>Total 6-month move-out: <strong>-27 residents</strong></span>
                <span className="text-blue-700 font-semibold">Net Growth: +83</span>
              </div>
            </div>
          </div>

          {/* Recent Feedbacks / Incidents */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Active Requests & Incident Triage
                </h2>
                <p className="text-xs text-slate-500">
                  Recent maintenance tickets and resident inquiries requiring attention
                </p>
              </div>
              <Link
                href="/phan-anh-va-yeu-cau"
                className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>View all (14)</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {mockFeedbacks.map((item) => (
                <div key={item.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          item.priority === 'URGENT'
                            ? 'bg-red-100 text-red-800'
                            : item.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.priority === 'URGENT' ? 'Urgent' : item.priority === 'HIGH' ? 'High' : 'Normal'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="font-semibold text-blue-700">Unit {item.roomNumber}</span>
                      <span>•</span>
                      <span>{item.residentName}</span>
                      <span>•</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded flex-shrink-0 ${
                      item.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status === 'RESOLVED'
                      ? 'Resolved'
                      : item.status === 'IN_PROGRESS'
                      ? 'In Progress'
                      : 'Received'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Operational Alerts & Residence Structure */}
        <div className="space-y-5">
          {/* Overdue Fee Warning Widget */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">warning</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Overdue Accounts (&gt; 60 Days)
                </h3>
              </div>
              <span className="text-[11px] text-red-600 font-bold">3 units</span>
            </div>

            <p className="text-xs text-slate-500">
              Units with balances outstanding for &gt; 2 billing cycles. Automated reminders sent before the 30th.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Unit B-0802</div>
                  <div className="text-[11px] text-slate-500">Head: Vu Duc Thanh</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 font-mono">12,850,000 ₫</div>
                  <div className="text-[10px] text-slate-400">3 months overdue</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Unit A-1207</div>
                  <div className="text-[11px] text-slate-500">Head: Nguyen Tien Dung</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 font-mono">8,420,000 ₫</div>
                  <div className="text-[10px] text-slate-400">2 months overdue</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Unit B-1504</div>
                  <div className="text-[11px] text-slate-500">Head: Do Hoang Yen</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 font-mono">6,150,000 ₫</div>
                  <div className="text-[10px] text-slate-400">2 months overdue</div>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/phi-chung-cu"
                className="w-full py-1.5 px-3 rounded bg-blue-50 hover:bg-blue-100/70 text-blue-800 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <span>Manage Collections & Reminders</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Residence Structure Progress */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100">
              Residency Composition
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">Permanent (1,036 residents)</span>
                  <span className="text-slate-900 font-bold">83%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-700 rounded" style={{ width: '83%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">Temporary (175 residents)</span>
                  <span className="text-slate-900 font-bold">14%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-600 rounded" style={{ width: '14%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">Absent (37 residents)</span>
                  <span className="text-slate-900 font-bold">3%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded" style={{ width: '3%' }}></div>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-700 text-[18px]">verified</span>
              <span>100% of permanent profiles verified against national digital ID registry.</span>
            </div>
          </div>

          {/* Duty Schedule / Operations Notice */}
          <div className="bg-slate-900 text-white rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">
                Today&apos;s Operations Duty Schedule
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Morning Shift (07:00 - 15:00):</span>
                <span className="font-semibold text-white">Alex Nguyen (Supervisor)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">MEP Maintenance:</span>
                <span className="font-semibold text-white">Le Van Hung</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lobby Security A & B:</span>
                <span className="font-semibold text-white">Security Squad 1 (4 guards)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Resident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[22px]">person_add</span>
                <h3 className="text-base font-bold text-slate-900">New Resident Registration</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Resident Full Name *
                </label>
                <input
                  required
                  placeholder="e.g. Tran Hoang Nam"
                  className="w-full px-3 py-2 text-xs rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    National Citizen ID (12 digits) *
                  </label>
                  <input
                    required
                    placeholder="12 digits CCCD"
                    className="w-full px-3 py-2 text-xs rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned Apartment Unit *
                  </label>
                  <select className="w-full px-3 py-2 text-xs rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700">
                    <option>A-1205 (Occupied)</option>
                    <option>A-1206 (Occupied)</option>
                    <option>A-0501 (Vacant - Handover)</option>
                    <option>B-0802 (Occupied)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 text-xs rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Relationship to Household Head
                  </label>
                  <select className="w-full px-3 py-2 text-xs rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700">
                    <option>Head of Household</option>
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Parent</option>
                    <option>Tenant</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs rounded bg-blue-700 text-white hover:bg-blue-800 font-semibold shadow-sm"
                >
                  Save Resident Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
