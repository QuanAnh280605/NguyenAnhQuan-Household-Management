'use client';

import { useState } from 'react';

export function Header() {
  const [selectedBuilding, setSelectedBuilding] = useState('Parkview Complex (Towers A & B)');
  const [showBuildingMenu, setShowBuildingMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-[256px] right-0 h-16 bg-white/95 backdrop-blur-md z-40 px-6 flex items-center justify-between border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Global Quick Search */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="flex items-center gap-2 w-full bg-slate-50 hover:bg-slate-100/70 px-3 py-1.5 rounded-lg border border-slate-200 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <span className="material-symbols-outlined text-slate-400 text-[19px]">search</span>
          <input
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
            placeholder="Search by unit number, resident name, citizen ID, license plate..."
            type="text"
          />
        </div>
      </div>

      {/* Right Controls & Info */}
      <div className="flex items-center gap-3.5">
        {/* Building Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBuildingMenu(!showBuildingMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 text-left transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-blue-700 text-[18px]">apartment</span>
            <span className="text-xs font-semibold text-slate-800">
              {selectedBuilding}
            </span>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
          </button>

          {showBuildingMenu && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in">
              {['Parkview Complex (Towers A & B)', 'Parkview Tower A (Floors 1 - 25)', 'Parkview Tower B (Floors 1 - 25)'].map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setSelectedBuilding(b);
                    setShowBuildingMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    selectedBuilding === b ? 'text-blue-700 font-bold bg-blue-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>{b}</span>
                  {selectedBuilding === b && (
                    <span className="material-symbols-outlined text-blue-700 text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Operational Shift Info */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium">Duty Shift: <strong>07:00 - 15:00</strong></span>
        </div>

        {/* Hotline */}
        <div className="hidden xl:flex items-center gap-1 text-slate-500 text-xs pl-1">
          <span className="material-symbols-outlined text-[16px] text-slate-400">call</span>
          <span>Hotline: <strong className="text-slate-700">024.3999.8888</strong></span>
        </div>

        <div className="h-4 w-px bg-slate-200"></div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            type="button"
            title="Operational Notifications"
          >
            <span className="material-symbols-outlined text-[21px]">notifications</span>
            <span className="absolute top-0.5 right-0.5 flex items-center justify-center w-4 h-4 bg-red-600 text-white text-[10px] rounded-full font-bold">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Operational Alerts
                </span>
                <span className="text-[11px] text-blue-700 font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Unit A-1205 Payment Recorded</span>
                    <span className="text-[10px] text-slate-400">5m ago</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">Oct 2025 Statement: 4,035,000 VND via VietQR</p>
                </div>
                <div className="p-2 rounded bg-amber-50/60 hover:bg-amber-50 transition-colors border border-amber-200/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">Incident Alert: B-0802</span>
                    <span className="text-[10px] text-amber-600 font-semibold">Urgent</span>
                  </div>
                  <p className="text-amber-800 mt-0.5">Elevator vibration reported in Tower B</p>
                </div>
                <div className="p-2 rounded bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Unit Handover: A-0501</span>
                    <span className="text-[10px] text-slate-400">2h ago</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">Key & RFID access card checklist completed</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center pl-1">
          <div className="w-8 h-8 rounded-md bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            AN
          </div>
        </div>
      </div>
    </header>
  );
}
