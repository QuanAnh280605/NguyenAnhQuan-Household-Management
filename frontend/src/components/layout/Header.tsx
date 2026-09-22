'use client';

import { useState } from 'react';
import { useAuth, DEMO_PROFILES } from '@/context/AuthContext';

export function Header() {
  const [selectedBuilding, setSelectedBuilding] = useState('Parkview Complex (Towers A & B)');
  const [showBuildingMenu, setShowBuildingMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [roleToast, setRoleToast] = useState<string | null>(null);

  const { currentProfile, role, switchDemoRole, isLoading } = useAuth();

  const handleSelectRole = async (username: string) => {
    await switchDemoRole(username);
    setShowRoleMenu(false);
    const selected = DEMO_PROFILES.find((p) => p.username === username);
    if (selected) {
      setRoleToast(`Đã chuyển sang vai trò: ${selected.role} (${selected.label})`);
      setTimeout(() => setRoleToast(null), 3500);
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN':
        return 'shield_person';
      case 'MANAGER':
        return 'manage_accounts';
      case 'TECHNICIAN':
        return 'build';
      case 'RESIDENT':
        return 'cottage';
      default:
        return 'person';
    }
  };

  const getRoleBadgeStyle = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'MANAGER':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'TECHNICIAN':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'RESIDENT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="fixed top-0 left-[256px] right-0 h-16 bg-white/95 backdrop-blur-md z-40 px-6 flex items-center justify-between border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Toast Role Switcher Feedback */}
      {roleToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold animate-in slide-in-from-top-2 border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified_user</span>
          <span>{roleToast}</span>
        </div>
      )}

      {/* Global Quick Search */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="flex items-center gap-2 w-full bg-slate-50 hover:bg-slate-100/70 px-3 py-1.5 rounded-lg border border-slate-200 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <span className="material-symbols-outlined text-slate-400 text-[19px]">search</span>
          <input
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
            placeholder="Tìm theo phòng, cư dân, CCCD, biển số xe..."
            type="text"
          />
        </div>
      </div>

      {/* Right Controls & Info */}
      <div className="flex items-center gap-3">
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
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium">Ca trực: <strong>07:00 - 15:00</strong></span>
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
                  Cảnh báo vận hành
                </span>
                <span className="text-[11px] text-blue-700 font-semibold cursor-pointer hover:underline">
                  Đã đọc tất cả
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Thanh toán Căn A-1205</span>
                    <span className="text-[10px] text-slate-400">5m ago</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">Kỳ 10/2025: 4,035,000 đ qua VietQR</p>
                </div>
                <div className="p-2 rounded bg-amber-50/60 hover:bg-amber-50 transition-colors border border-amber-200/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">Sự cố thang máy: Tháp B</span>
                    <span className="text-[10px] text-amber-600 font-semibold">Khẩn</span>
                  </div>
                  <p className="text-amber-800 mt-0.5">Rung lắc tầng 8 báo từ cư dân B-0802</p>
                </div>
                <div className="p-2 rounded bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Bàn giao căn hộ: A-0501</span>
                    <span className="text-[10px] text-slate-400">2h ago</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">Đã hoàn thành thẻ từ thang máy và RFID đỗ xe</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RBAC Quick Role Switcher Dropdown */}
        <div className="relative pl-1">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
            type="button"
            title="Nhấp để chuyển đổi vai trò Demo RBAC"
          >
            {/* Avatar Initials */}
            <div className="w-8 h-8 rounded-md bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-blue-800 transition-colors">
              {currentProfile.initials}
            </div>

            {/* User & Role Label */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {currentProfile.label.split(' ')[0]} {currentProfile.label.split(' ')[1] || ''}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold border mt-0.5 ${getRoleBadgeStyle(
                  role
                )}`}
              >
                <span className="material-symbols-outlined text-[11px]">{getRoleIcon(role)}</span>
                <span>{role}</span>
              </span>
            </div>

            <span className="material-symbols-outlined text-slate-400 text-[18px] ml-0.5">
              expand_more
            </span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Demo Role Switcher (RBAC)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Chuyển nhanh giữa 4 cấp vai trò phân quyền
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  4 Roles
                </span>
              </div>

              <div className="space-y-1.5">
                {DEMO_PROFILES.map((profile) => {
                  const isSelected = profile.username === currentProfile.username;
                  return (
                    <button
                      key={profile.username}
                      disabled={isLoading}
                      onClick={() => handleSelectRole(profile.username)}
                      className={`w-full p-2.5 rounded-lg text-left transition-all flex items-start justify-between border ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 shadow-2xs ${
                            isSelected
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {profile.initials}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              {profile.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span
                              className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold border ${getRoleBadgeStyle(
                                profile.role
                              )}`}
                            >
                              <span className="material-symbols-outlined text-[10px]">
                                {getRoleIcon(profile.role)}
                              </span>
                              <span>{profile.role}</span>
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 pt-0.5">
                            {profile.description}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="material-symbols-outlined text-blue-700 text-[18px] flex-shrink-0 mt-1">
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Bearer Token tự động đồng bộ</span>
                <span className="font-mono text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  localStorage Live
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

