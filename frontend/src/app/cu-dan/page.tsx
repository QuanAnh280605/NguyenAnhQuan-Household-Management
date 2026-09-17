'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockApartmentA1205 } from '@/lib/mock-data';

export default function CuDanPage() {
  const initialResidents = [
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

  const [residents] = useState(initialResidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.citizenId.includes(searchTerm) ||
      r.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'ALL' || r.residentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col w-full space-y-4 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Sổ Danh Bạ Cư Dân Tòa Nhà
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
              1,248 Cư dân
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Hồ sơ nhân khẩu, tình trạng cư trú (thường trú/tạm trú) và đối soát CCCD gắn chip VNeID.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setToastMessage('Đang xuất danh sách cư dân sang định dạng chuẩn Bộ Công An...');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">file_download</span>
            <span>Xuất danh sách</span>
          </button>
          <button
            onClick={() => {
              setToastMessage('Chức năng thêm hồ sơ cư dân đã được đồng bộ với biểu mẫu BQL.');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-700 text-white shadow-sm hover:bg-blue-800 text-xs font-semibold transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">person_add</span>
            <span>Đăng ký cư dân mới</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[17px]">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo họ tên, số CCCD, phòng, SĐT..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 text-slate-800"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 font-medium cursor-pointer"
          >
            <option value="ALL">Tất cả diện cư trú</option>
            <option value="PERMANENT">Thường trú</option>
            <option value="TEMPORARY">Tạm trú</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Hiển thị <strong>{filteredResidents.length}</strong> cư dân
        </div>
      </div>

      {/* High-Density Residents Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-3.5">Họ và tên</th>
                <th className="py-2.5 px-3.5">Căn hộ</th>
                <th className="py-2.5 px-3.5">Số CCCD</th>
                <th className="py-2.5 px-3.5">Ngày sinh</th>
                <th className="py-2.5 px-3.5">Giới tính</th>
                <th className="py-2.5 px-3.5">Quan hệ chủ hộ</th>
                <th className="py-2.5 px-3.5">Diện cư trú</th>
                <th className="py-2.5 px-3.5">Số điện thoại</th>
                <th className="py-2.5 px-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResidents.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3.5 font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                      {r.fullName.split(' ').pop()?.slice(0, 1) || 'N'}
                    </div>
                    <span>{r.fullName}</span>
                    {r.isHead && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200/60">
                        Chủ hộ
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-blue-700 font-mono">
                    <Link href={`/can-ho/${r.roomNumber}`} className="hover:underline">
                      {r.roomNumber}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-700">{r.citizenId}</td>
                  <td className="py-2.5 px-3.5 text-slate-500">{r.dateOfBirth}</td>
                  <td className="py-2.5 px-3.5 text-slate-600">{r.gender}</td>
                  <td className="py-2.5 px-3.5 text-slate-600">{r.relationship}</td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.residentStatus === 'PERMANENT'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                          : 'bg-sky-50 text-sky-800 border border-sky-200/60'
                      }`}
                    >
                      {r.residentStatus === 'PERMANENT' ? 'Thường trú' : 'Tạm trú'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-500">{r.phone}</td>
                  <td className="py-2.5 px-3.5 text-right">
                    <Link
                      href={`/can-ho/${r.roomNumber}`}
                      className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 transition-colors"
                    >
                      Hồ sơ hộ
                    </Link>
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
