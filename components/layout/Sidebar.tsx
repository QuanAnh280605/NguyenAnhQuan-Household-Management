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
      ? 'flex items-center gap-space-sm px-space-md py-2.5 transition-colors bg-primary-fixed text-primary font-medium rounded-lg'
      : 'flex items-center gap-space-sm px-space-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-normal';
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[250px] bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-outline-variant/30">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <Link href="/" className="h-16 px-space-md flex items-center gap-space-sm bg-surface-container-lowest border-b border-outline-variant/20 hover:opacity-90 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="34" height="34" fill="none" className="flex-shrink-0">
            <rect width="40" height="40" rx="10" fill="#4338CA" />
            <path d="M12 28V18L20 12L28 18V28H23V21H17V28H12Z" fill="white" fillOpacity="0.95" />
            <circle cx="20" cy="16.5" r="1.75" fill="#818CF8" />
            <rect x="18.5" y="24" width="3" height="4" rx="0.5" fill="#4338CA" />
          </svg>
          <div className="flex flex-col justify-center min-w-0">
            <span className="font-headline-sm text-headline-sm text-on-surface leading-tight tracking-tight truncate font-bold">
              ResidentHub
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight truncate">
              Apartment Management
            </span>
          </div>
        </Link>

        {/* Main Dashboard */}
        <div className="px-space-sm py-space-sm">
          <nav className="space-y-space-xs">
            <Link href="/" className={navItemClass('/')}>
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="font-label-md text-label-md">Dashboard</span>
            </Link>
          </nav>
        </div>

        {/* Navigation Sections */}
        <div className="px-space-sm pb-space-md space-y-space-md">
          {/* QUẢN LÝ CỐT LÕI */}
          <div className="space-y-1">
            <div className="px-space-md py-1 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              QUẢN LÝ CỐT LÕI
            </div>
            <nav className="space-y-space-xs">
              <Link href="/can-ho" className={navItemClass('/can-ho')}>
                <span className="material-symbols-outlined text-[20px]">apartment</span>
                <span className="font-label-md text-label-md">Căn hộ</span>
              </Link>
              <Link href="/ho-dan" className={navItemClass('/ho-dan')}>
                <span className="material-symbols-outlined text-[20px]">family_restroom</span>
                <span className="font-label-md text-label-md">Hộ dân</span>
              </Link>
              <Link href="/cu-dan" className={navItemClass('/cu-dan')}>
                <span className="material-symbols-outlined text-[20px]">group</span>
                <span className="font-label-md text-label-md">Cư dân</span>
              </Link>
            </nav>
          </div>

          {/* VẬN HÀNH */}
          <div className="space-y-1">
            <div className="px-space-md py-1 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              VẬN HÀNH
            </div>
            <nav className="space-y-space-xs">
              <Link href="/cu-tru" className={navItemClass('/cu-tru')}>
                <span className="material-symbols-outlined text-[20px]">badge</span>
                <span className="font-label-md text-label-md">Cư trú</span>
              </Link>
              <Link href="/phi-chung-cu" className={navItemClass('/phi-chung-cu')}>
                <span className="material-symbols-outlined text-[20px]">payments</span>
                <span className="font-label-md text-label-md">Phí chung cư</span>
              </Link>
              <Link href="/phuong-tien-va-bai-do" className={navItemClass('/phuong-tien-va-bai-do')}>
                <span className="material-symbols-outlined text-[20px]">directions_car</span>
                <span className="font-label-md text-label-md">Phương tiện & Bãi đỗ</span>
              </Link>
            </nav>
          </div>

          {/* DỊCH VỤ */}
          <div className="space-y-1">
            <div className="px-space-md py-1 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              DỊCH VỤ
            </div>
            <nav className="space-y-space-xs">
              <Link href="/phan-anh-va-yeu-cau" className={navItemClass('/phan-anh-va-yeu-cau')}>
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                <span className="font-label-md text-label-md">Phản ánh & Yêu cầu</span>
              </Link>
              <Link href="/lich-su-cu-tru" className={navItemClass('/lich-su-cu-tru')}>
                <span className="material-symbols-outlined text-[20px]">history</span>
                <span className="font-label-md text-label-md">Lịch sử cư trú</span>
              </Link>
            </nav>
          </div>

          {/* HỆ THỐNG */}
          <div className="space-y-1">
            <div className="px-space-md py-1 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              HỆ THỐNG
            </div>
            <nav className="space-y-space-xs">
              <Link href="/nguoi-dung" className={navItemClass('/nguoi-dung')}>
                <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                <span className="font-label-md text-label-md">Người dùng</span>
              </Link>
              <Link href="/cai-dat" className={navItemClass('/cai-dat')}>
                <span className="material-symbols-outlined text-[20px]">settings</span>
                <span className="font-label-md text-label-md">Cài đặt</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-space-sm bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex items-center gap-space-sm p-2 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm shadow-sm">
              AN
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-surface-container-lowest"></span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
              Nguyễn Văn An
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
              Ban quản lý
            </span>
          </div>
          <span className="material-symbols-outlined text-outline text-[18px]">unfold_more</span>
        </div>
      </div>
    </aside>
  );
}
