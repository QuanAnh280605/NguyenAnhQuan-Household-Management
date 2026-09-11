'use client';

import { useState } from 'react';

export function Header() {
  const [selectedBuilding, setSelectedBuilding] = useState('Tòa Parkview Tower A & B');
  const [showBuildingMenu, setShowBuildingMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-[250px] right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl z-40 px-space-xl flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30">
      {/* Global Quick Search */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="flex items-center gap-space-sm w-full bg-surface-container-low px-space-md py-2 rounded-lg border border-transparent focus-within:border-primary-container focus-within:bg-surface-container-lowest transition-all">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
          <input
            className="w-full bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface placeholder:text-outline"
            placeholder="Tìm cư dân, căn hộ, biển số..."
            type="text"
          />
          <span className="px-1.5 py-0.5 font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant rounded font-mono">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Controls & Info */}
      <div className="flex items-center gap-space-md">
        {/* Building Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBuildingMenu(!showBuildingMenu)}
            className="flex items-center gap-space-sm px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors text-left"
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-[18px]">domain</span>
            <span className="font-label-md text-label-md text-on-surface font-medium">
              {selectedBuilding}
            </span>
            <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
          </button>

          {showBuildingMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-1.5 z-50 animate-in fade-in zoom-in-95">
              {['Tòa Parkview Tower A & B', 'Tòa Parkview A', 'Tòa Parkview B'].map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setSelectedBuilding(b);
                    setShowBuildingMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-body-sm flex items-center justify-between hover:bg-surface-container-low transition-colors ${
                    selectedBuilding === b ? 'text-primary font-semibold bg-primary-fixed/30' : 'text-on-surface'
                  }`}
                >
                  <span>{b}</span>
                  {selectedBuilding === b && (
                    <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* System Health Status */}
        <div className="flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Hệ thống: Bình thường
          </span>
        </div>

        <div className="h-5 w-px bg-surface-container-high"></div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-error text-on-error font-label-sm text-[10px] rounded-full font-bold">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-2">
                <span className="font-headline-sm text-sm font-semibold">Thông báo mới</span>
                <span className="font-label-sm text-xs text-primary cursor-pointer hover:underline">
                  Đánh dấu đã đọc
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                  <p className="font-medium text-on-surface">Căn A-1205 vừa thanh toán hóa đơn</p>
                  <p className="text-on-surface-variant mt-0.5">Số tiền: 4.035.000đ • 5 phút trước</p>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                  <p className="font-medium text-on-surface">Yêu cầu bảo trì mới từ căn B-0802</p>
                  <p className="text-on-surface-variant mt-0.5">Thang máy rung lắc • 30 phút trước</p>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                  <p className="font-medium text-on-surface">Căn A-0501 hoàn tất thủ tục bàn giao</p>
                  <p className="text-on-surface-variant mt-0.5">2 giờ trước</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Button */}
        <button
          className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
          type="button"
          title="Trợ giúp & Hướng dẫn"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>

        {/* Header Avatar */}
        <div className="flex items-center pl-space-xs">
          <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-primary-fixed">
            AN
          </div>
        </div>
      </div>
    </header>
  );
}
