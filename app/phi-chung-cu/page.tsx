'use client';

import Link from 'next/link';

export default function PhiChungCuPage() {
  const invoices = [
    {
      code: 'INV-202510-A1205',
      room: 'A-1205',
      head: 'Trần Hoàng Nam',
      month: '10/2025',
      management: 1290000,
      utilities: 1395000,
      parking: 1350000,
      total: 4035000,
      status: 'PAID',
    },
    {
      code: 'INV-202510-A1207',
      room: 'A-1207',
      head: 'Nguyễn Tiến Dũng',
      month: '10/2025',
      management: 1650000,
      utilities: 1820000,
      parking: 2000000,
      total: 5470000,
      status: 'UNPAID',
    },
    {
      code: 'INV-202510-B0802',
      room: 'B-0802',
      head: 'Vũ Đức Thành',
      month: '10/2025',
      management: 1425000,
      utilities: 1540000,
      parking: 1500000,
      total: 4465000,
      status: 'OVERDUE',
    },
    {
      code: 'INV-202510-B1401',
      room: 'B-1401',
      head: 'Bùi Quốc Cường',
      month: '10/2025',
      management: 2025000,
      utilities: 2450000,
      parking: 2800000,
      total: 7275000,
      status: 'PAID',
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Phí Chung cư & Hóa đơn
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">
              Kỳ 10/2025
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Quản lý công nợ, tiền quản lý, điện, nước và gửi xe từng căn hộ.
          </p>
        </div>

        <button
          onClick={() => alert('Đã tạo bảng kê hóa đơn cho kỳ mới!')}
          className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary transition-colors font-label-md text-label-md font-semibold self-start sm:self-auto"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Tạo kỳ thu phí mới</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-outline uppercase font-semibold">Tổng doanh thu dự kiến</span>
          <div className="font-metric-display text-2xl font-bold text-on-surface mt-1">690.7 triệu</div>
          <p className="text-xs text-on-surface-variant mt-1">320 căn hộ trong danh sách thu</p>
        </div>
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-outline uppercase font-semibold">Đã thực thu</span>
          <div className="font-metric-display text-2xl font-bold text-secondary mt-1">564.2 triệu</div>
          <p className="text-xs text-secondary font-semibold mt-1">81.7% tiến độ hoàn thành</p>
        </div>
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-outline uppercase font-semibold">Công nợ còn tồn</span>
          <div className="font-metric-display text-2xl font-bold text-error mt-1">126.5 triệu</div>
          <p className="text-xs text-error font-semibold mt-1">42 căn chưa hoàn tất đóng phí</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/20 text-xs font-semibold uppercase tracking-wider text-outline">
                <th className="py-3.5 px-4">Mã hóa đơn</th>
                <th className="py-3.5 px-4">Căn hộ</th>
                <th className="py-3.5 px-4">Chủ hộ</th>
                <th className="py-3.5 px-4">Phí QL tòa nhà</th>
                <th className="py-3.5 px-4">Điện & Nước</th>
                <th className="py-3.5 px-4">Gửi xe</th>
                <th className="py-3.5 px-4 font-bold">Tổng tiền</th>
                <th className="py-3.5 px-4 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {invoices.map((inv) => (
                <tr key={inv.code} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-xs text-primary">{inv.code}</td>
                  <td className="py-3.5 px-4 font-bold">
                    <Link href={`/can-ho/${inv.room}`} className="text-on-surface hover:text-primary">
                      {inv.room}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-on-surface">{inv.head}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-mono text-xs">
                    {inv.management.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-mono text-xs">
                    {inv.utilities.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-mono text-xs">
                    {inv.parking.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-3.5 px-4 font-bold text-on-surface font-mono text-xs">
                    {inv.total.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-tertiary-fixed/40 text-tertiary'
                          : inv.status === 'OVERDUE'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status === 'PAID' ? 'Đã thu' : inv.status === 'OVERDUE' ? 'Quá hạn' : 'Chưa đóng'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
