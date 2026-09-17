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
              Parkview Operations
            </span>
            <span className="text-[11px] text-slate-500 leading-tight truncate mt-0.5">
              Apartment Management Hub
            </span>
          </div>
        </Link>

        {/* Navigation Sections */}
        <div className="px-3 py-3 space-y-4">
          {/* OVERVIEW */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              OVERVIEW
            </div>
            <nav className="space-y-0.5">
              <Link href="/" className={navItemClass('/')}>
                <span className="material-symbols-outlined text-[19px]">dashboard</span>
                <span>Operations Console</span>
              </Link>
            </nav>
          </div>

          {/* PROPERTIES & DEMOGRAPHICS */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              PROPERTIES & DEMOGRAPHICS
            </div>
            <nav className="space-y-0.5">
              <Link href="/can-ho" className={navItemClass('/can-ho')}>
                <span className="material-symbols-outlined text-[19px]">apartment</span>
                <span>Apartments Directory</span>
              </Link>
              <Link href="/ho-dan" className={navItemClass('/ho-dan')}>
                <span className="material-symbols-outlined text-[19px]">family_restroom</span>
                <span>Household Dossiers</span>
              </Link>
              <Link href="/cu-dan" className={navItemClass('/cu-dan')}>
                <span className="material-symbols-outlined text-[19px]">group</span>
                <span>Resident Registry</span>
              </Link>
              <Link href="/cu-tru" className={navItemClass('/cu-tru')}>
                <span className="material-symbols-outlined text-[19px]">badge</span>
                <span>Residence Tracking</span>
              </Link>
            </nav>
          </div>

          {/* FINANCE & OPERATIONS */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              FINANCE & OPERATIONS
            </div>
            <nav className="space-y-0.5">
              <Link href="/phi-chung-cu" className={navItemClass('/phi-chung-cu')}>
                <span className="material-symbols-outlined text-[19px]">payments</span>
                <span>Billing & Invoices</span>
              </Link>
              <Link href="/phuong-tien-va-bai-do" className={navItemClass('/phuong-tien-va-bai-do')}>
                <span className="material-symbols-outlined text-[19px]">directions_car</span>
                <span>Vehicles & Parking</span>
              </Link>
              <Link href="/phan-anh-va-yeu-cau" className={navItemClass('/phan-anh-va-yeu-cau')}>
                <span className="material-symbols-outlined text-[19px]">support_agent</span>
                <span>Tickets & SLA</span>
              </Link>
            </nav>
          </div>

          {/* SYSTEM & SETTINGS */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              SYSTEM & GOVERNANCE
            </div>
            <nav className="space-y-0.5">
              <Link href="/lich-su-cu-tru" className={navItemClass('/lich-su-cu-tru')}>
                <span className="material-symbols-outlined text-[19px]">history</span>
                <span>Audit Log & History</span>
              </Link>
              <Link href="/nguoi-dung" className={navItemClass('/nguoi-dung')}>
                <span className="material-symbols-outlined text-[19px]">manage_accounts</span>
                <span>Users & Access Roles</span>
              </Link>
              <Link href="/cai-dat" className={navItemClass('/cai-dat')}>
                <span className="material-symbols-outlined text-[19px]">settings</span>
                <span>Building Settings</span>
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
              Alex Nguyen
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              Operations Supervisor
            </span>
          </div>
          <button
            type="button"
            title="Switch Shift / Options"
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
          >
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
