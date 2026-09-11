'use client';

import Link from 'next/link';

export default function CuTruPage() {
  const records = [
    {
      id: 'rec-1',
      name: 'Nguyễn Tiến Dũng',
      room: 'A-1207',
      type: 'Đăng ký Tạm trú',
      startDate: '20/03/2023',
      endDate: '20/03/2025',
      status: 'Hợp lệ',
    },
    {
      id: 'rec-2',
      name: 'Trần Hoàng Nam',
      room: 'A-1205',
      type: 'Nhập hộ Thường trú',
      startDate: '20/01/2023',
      endDate: 'Vô thời hạn',
      status: 'Đã duyệt',
    },
    {
      id: 'rec-3',
      name: 'Vũ Đức Thành',
      room: 'B-0802',
      type: 'Khai báo Tạm vắng',
      startDate: '01/10/2025',
      endDate: '01/11/2025',
      status: 'Đang theo dõi',
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Biến động Cư trú
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">
              Tạm trú & Tạm vắng
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Đăng ký tạm trú, thông báo lưu trú và khai báo tạm vắng theo quy định của công an phường.
          </p>
        </div>

        <button
          onClick={() => alert('Thêm hồ sơ cư trú mới')}
          className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary transition-colors font-label-md text-label-md font-semibold self-start sm:self-auto"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">post_add</span>
          <span>Đăng ký biến động mới</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/20 text-xs font-semibold uppercase tracking-wider text-outline">
                <th className="py-3.5 px-4">Cư dân</th>
                <th className="py-3.5 px-4">Căn hộ</th>
                <th className="py-3.5 px-4">Loại biến động</th>
                <th className="py-3.5 px-4">Ngày bắt đầu</th>
                <th className="py-3.5 px-4">Ngày kết thúc</th>
                <th className="py-3.5 px-4 text-right">Trạng thái hồ sơ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface">{r.name}</td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    <Link href={`/can-ho/${r.room}`} className="hover:underline">
                      {r.room}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface font-medium">{r.type}</td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant">{r.startDate}</td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant">{r.endDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary-fixed/40 text-tertiary">
                      {r.status}
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
