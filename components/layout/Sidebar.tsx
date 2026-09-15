'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const isNavActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navItemClass = (path: string) => {
    const active = isNavActive(path);
    return active
      ? 'flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg bg-blue-50 text-blue-800 border-l-[3px] border-blue-700 transition-colors'
      : 'flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 rounded-lg transition-colors font-medium';
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[256px] bg-white z-50 flex flex-col justify-between shadow-[1px_0_4px_rgba(0,0,0,0.03)] border-r border-slate-200">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <Link
          href="/"
          className="h-16 px-4 flex items-center gap-3 border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">domain</span>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-sm text-slate-900 leading-tight tracking-tight truncate font-bold uppercase">
              BQL Parkview Tower
            </span>
            <span className="text-[11px] text-slate-500 leading-tight truncate mt-0.5">
              Hệ thống Vận hành Chung cư
            </span>
          </div>
        </Link>

        {/* Navigation Sections */}
        <div className="px-3 py-3 space-y-4">
          {/* TỔNG QUAN */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              TỔNG QUAN
            </div>
            <nav className="space-y-0.5">
              <Link href="/" className={navItemClass('/')}>
                <span className="material-symbols-outlined text-[19px]">dashboard</span>
                <span>Bảng điều khiển</span>
              </Link>
            </nav>
          </div>

          {/* QUẢN LÝ CĂN HỘ & CƯ DÂN */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              CĂN HỘ & NHÂN KHẨU
            </div>
            <nav className="space-y-0.5">
              <Link href="/can-ho" className={navItemClass('/can-ho')}>
                <span className="material-symbols-outlined text-[19px]">apartment</span>
                <span>Quản lý Căn hộ</span>
              </Link>
              <Link href="/ho-dan" className={navItemClass('/ho-dan')}>
                <span className="material-symbols-outlined text-[19px]">family_restroom</span>
                <span>Hồ sơ Hộ dân</span>
              </Link>
              <Link href="/cu-dan" className={navItemClass('/cu-dan')}>
                <span className="material-symbols-outlined text-[19px]">group</span>
                <span>Danh bạ Cư dân</span>
              </Link>
              <Link href="/cu-tru" className={navItemClass('/cu-tru')}>
                <span className="material-symbols-outlined text-[19px]">badge</span>
                <span>Biến động Cư trú</span>
              </Link>
            </nav>
          </div>

          {/* TÀI CHÍNH & VẬN HÀNH */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              TÀI CHÍNH & VẬN HÀNH
            </div>
            <nav className="space-y-0.5">
              <Link href="/phi-chung-cu" className={navItemClass('/phi-chung-cu')}>
                <span className="material-symbols-outlined text-[19px]">payments</span>
                <span>Thu phí & Hóa đơn</span>
              </Link>
              <Link href="/phuong-tien-va-bai-do" className={navItemClass('/phuong-tien-va-bai-do')}>
                <span className="material-symbols-outlined text-[19px]">directions_car</span>
                <span>Phương tiện & Vé xe</span>
              </Link>
              <Link href="/phan-anh-va-yeu-cau" className={navItemClass('/phan-anh-va-yeu-cau')}>
                <span className="material-symbols-outlined text-[19px]">support_agent</span>
                <span>Phản ánh & Sự cố</span>
              </Link>
            </nav>
          </div>

          {/* HỆ THỐNG & CẤU HÌNH */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              HỆ THỐNG
            </div>
            <nav className="space-y-0.5">
              <Link href="/lich-su-cu-tru" className={navItemClass('/lich-su-cu-tru')}>
                <span className="material-symbols-outlined text-[19px]">history</span>
                <span>Nhật ký & Lịch sử</span>
              </Link>
              <Link href="/nguoi-dung" className={navItemClass('/nguoi-dung')}>
                <span className="material-symbols-outlined text-[19px]">manage_accounts</span>
                <span>Tài khoản & Phân quyền</span>
              </Link>
              <Link href="/cai-dat" className={navItemClass('/cai-dat')}>
                <span className="material-symbols-outlined text-[19px]">settings</span>
                <span>Cấu hình Tòa nhà</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-200">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-md bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
              AN
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs text-slate-900 font-bold truncate">
              Nguyễn Văn An
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              Trưởng ca trực BQL
            </span>
          </div>
          <button
            type="button"
            title="Đổi ca trực / Tùy chọn"
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
          >
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
