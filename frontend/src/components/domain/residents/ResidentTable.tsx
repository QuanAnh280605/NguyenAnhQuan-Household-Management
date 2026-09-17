'use client';

import React from 'react';
import Link from 'next/link';
import { Resident } from '@/types';

interface ResidentTableProps {
  residents: Resident[];
}

export default function ResidentTable({ residents }: ResidentTableProps) {
  if (residents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500 text-xs">
        Không tìm thấy cư dân nào phù hợp với điều kiện lọc.
      </div>
    );
  }

  return (
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
            {residents.map((r) => (
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
  );
}
