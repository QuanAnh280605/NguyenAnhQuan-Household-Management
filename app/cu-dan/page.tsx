'use client';

import Link from 'next/link';
import { mockApartmentA1205 } from '@/lib/mock-data';

export default function CuDanPage() {
  const residents = [
    ...mockApartmentA1205.residents,
    {
      id: 'res-5',
      fullName: 'Phạm Thị Lan',
      citizenId: '001188009988',
      dateOfBirth: '18/04/1986',
      gender: 'Nữ' as const,
      phone: '0903 888 777',
      apartmentId: 'apt-a1206',
      roomNumber: 'A-1206',
      relationship: 'Chủ hộ',
      residentStatus: 'PERMANENT' as const,
      isHead: true,
      moveInDate: '02/02/2023',
    },
    {
      id: 'res-6',
      fullName: 'Nguyễn Tiến Dũng',
      citizenId: '001085002233',
      dateOfBirth: '30/12/1982',
      gender: 'Nam' as const,
      phone: '0977 444 333',
      apartmentId: 'apt-a1207',
      roomNumber: 'A-1207',
      relationship: 'Chủ hộ (Thuê)',
      residentStatus: 'TEMPORARY' as const,
      isHead: true,
      moveInDate: '20/03/2023',
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Danh bạ Cư dân
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">
              1,248 Cư dân
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Quản lý hồ sơ cư dân thường trú, tạm trú và các thông tin liên lạc.
          </p>
        </div>

        <button
          onClick={() => alert('Thêm hồ sơ cư dân')}
          className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary transition-colors font-label-md text-label-md font-semibold self-start sm:self-auto"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Thêm cư dân mới</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/20 text-xs font-semibold uppercase tracking-wider text-outline">
                <th className="py-3.5 px-4">Họ và tên</th>
                <th className="py-3.5 px-4">Căn hộ</th>
                <th className="py-3.5 px-4">Số CCCD</th>
                <th className="py-3.5 px-4">Ngày sinh</th>
                <th className="py-3.5 px-4">Giới tính</th>
                <th className="py-3.5 px-4">Quan hệ</th>
                <th className="py-3.5 px-4">Loại cư trú</th>
                <th className="py-3.5 px-4">Điện thoại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-sm">
              {residents.map((r) => (
                <tr key={r.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                    <span>{r.fullName}</span>
                    {r.isHead && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-fixed text-primary">
                        Chủ hộ
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    <Link href={`/can-ho/${r.roomNumber}`} className="hover:underline">
                      {r.roomNumber}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-on-surface">{r.citizenId}</td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant">{r.dateOfBirth}</td>
                  <td className="py-3.5 px-4 text-xs">{r.gender}</td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant">{r.relationship}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        r.residentStatus === 'PERMANENT'
                          ? 'bg-secondary-fixed text-on-secondary-container'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {r.residentStatus === 'PERMANENT' ? 'Thường trú' : 'Tạm trú'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-on-surface-variant">{r.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
