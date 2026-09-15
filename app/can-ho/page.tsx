'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockApartmentsList } from '@/lib/mock-data';
import { Apartment } from '@/types';

export default function CanHoPage() {
  const [apartments, setApartments] = useState<Apartment[]>(mockApartmentsList);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter apartments
  const filteredApartments = apartments.filter((apt) => {
    const matchesSearch =
      apt.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.ownerPhone.includes(searchTerm);

    const matchesBuilding =
      filterBuilding === 'ALL' ||
      (filterBuilding === 'A' && apt.building.includes('A')) ||
      (filterBuilding === 'B' && apt.building.includes('B'));

    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'OCCUPIED' && (apt.status === 'OWNER_OCCUPIED' || apt.status === 'RENTED')) ||
      (filterStatus === 'EMPTY' && apt.status === 'EMPTY') ||
      (filterStatus === 'REPAIRING' && apt.status === 'REPAIRING');

    return matchesSearch && matchesBuilding && matchesStatus;
  });

  const getStatusBadge = (status: Apartment['status']) => {
    switch (status) {
      case 'OWNER_OCCUPIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
            Chính chủ ở
          </span>
        );
      case 'RENTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
            Cho thuê
          </span>
        );
      case 'EMPTY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Còn trống
          </span>
        );
      case 'REPAIRING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Đang sửa chữa
          </span>
        );
    }
  };

  const getFeeBadge = (status: Apartment['feeStatus']) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            Đã nộp đủ
          </span>
        );
      case 'UNPAID':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
            Chưa nộp
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-800 border border-red-200/60">
            Quá hạn
          </span>
        );
      default:
        return null;
    }
  };

  const handleCreateApartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newApt: Apartment = {
      id: `apt-${Date.now()}`,
      building: formData.get('building') as string,
      roomNumber: formData.get('roomNumber') as string,
      floor: Number(formData.get('floor')),
      area: Number(formData.get('area')),
      roomType: 'Căn hộ tiêu chuẩn',
      status: 'EMPTY',
      direction: 'Đông Nam',
      ownerName: (formData.get('ownerName') as string) || 'Chưa cập nhật',
      ownerPhone: (formData.get('ownerPhone') as string) || '—',
      ownerCitizenId: '—',
      handoverDate: new Date().toLocaleDateString('vi-VN'),
      feeStatus: 'PAID',
      residents: [],
      vehicles: [],
      invoices: [],
    };

    setApartments([newApt, ...apartments]);
    setShowAddModal(false);
    setToastMessage(`Đã khởi tạo dữ liệu căn hộ ${newApt.roomNumber} thành công!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-semibold animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Quản Lý Danh Sách Căn Hộ
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
              320 Căn hộ
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Theo dõi trạng thái sở hữu, tỷ lệ lấp đầy, hồ sơ bàn giao và tiến độ nộp phí dịch vụ.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              setToastMessage('Đang xuất tệp dữ liệu Excel danh sách căn hộ...');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-slate-700 border border-slate-300 shadow-sm hover:bg-slate-50 text-xs font-semibold transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">file_download</span>
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-700 text-white shadow-sm hover:bg-blue-800 text-xs font-semibold transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>Thêm căn hộ mới</span>
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TỔNG SỐ CĂN</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">320</div>
            <div className="text-[11px] text-slate-500 mt-0.5">100% bàn giao thiết kế</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-blue-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">apartment</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ĐANG CÓ NGƯỜI Ở</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">284</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Tỷ lệ lấp đầy: 88.75%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">family_restroom</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CĂN HỘ TRỐNG</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">24</div>
            <div className="text-[11px] text-slate-500 mt-0.5">7.5% sẵn sàng bàn giao</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">door_front</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ĐANG THI CÔNG</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">12</div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">Đã cấp phép PCCC & ồn</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">handyman</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined text-[17px]">search</span>
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-slate-50 text-slate-800 placeholder:text-slate-400 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 border border-slate-300"
              placeholder="Tìm theo mã căn, chủ nhà, SĐT..."
              type="text"
            />
          </div>

          {/* Building Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="w-full appearance-none pl-3 pr-7 py-1.5 rounded-md bg-slate-50 text-slate-700 text-xs font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 border border-slate-300 cursor-pointer"
            >
              <option value="ALL">Tất cả Tòa</option>
              <option value="A">Tháp Parkview A</option>
              <option value="B">Tháp Parkview B</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
              expand_more
            </span>
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none pl-3 pr-7 py-1.5 rounded-md bg-slate-50 text-slate-700 text-xs font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 border border-slate-300 cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="OCCUPIED">Đang có người ở</option>
              <option value="EMPTY">Căn hộ còn trống</option>
              <option value="REPAIRING">Đang sửa chữa</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
              expand_more
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Hiển thị <strong className="text-slate-900 font-bold">{filteredApartments.length}</strong> / {apartments.length} căn hộ
        </div>
      </div>

      {/* High-Density Enterprise Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-3.5">Mã căn</th>
                <th className="py-2.5 px-3.5">Tòa & Tầng</th>
                <th className="py-2.5 px-3.5">Diện tích</th>
                <th className="py-2.5 px-3.5">Chủ sở hữu</th>
                <th className="py-2.5 px-3.5">Điện thoại</th>
                <th className="py-2.5 px-3.5">Tình trạng ở</th>
                <th className="py-2.5 px-3.5">Phí dịch vụ</th>
                <th className="py-2.5 px-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredApartments.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  <td className="py-2.5 px-3.5 font-bold text-blue-700 font-mono">
                    <Link
                      href={`/can-ho/${apt.roomNumber}`}
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{apt.roomNumber}</span>
                    </Link>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-800">
                    <span>{apt.building}</span>
                    <span className="text-slate-300 mx-1.5">•</span>
                    <span className="text-slate-500">Tầng {apt.floor}</span>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="font-semibold text-slate-800">{apt.area} m²</span>
                    <span className="text-[11px] text-slate-400 block">{apt.roomType}</span>
                  </td>
                  <td className="py-2.5 px-3.5 font-medium text-slate-900">
                    {apt.ownerName}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-500 font-mono">
                    {apt.ownerPhone}
                  </td>
                  <td className="py-2.5 px-3.5">{getStatusBadge(apt.status)}</td>
                  <td className="py-2.5 px-3.5">{getFeeBadge(apt.feeStatus)}</td>
                  <td className="py-2.5 px-3.5 text-right">
                    <Link
                      href={`/can-ho/${apt.roomNumber}`}
                      className="inline-flex items-center px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 transition-colors"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compact Footer */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <div>
            Trang 1 / 1 (Tổng số <strong>{filteredApartments.length}</strong> kết quả)
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-300 hover:bg-white disabled:opacity-40" disabled>
              Trước
            </button>
            <button className="px-2.5 py-1 rounded bg-blue-700 text-white font-bold">
              1
            </button>
            <button className="px-2.5 py-1 rounded border border-slate-300 hover:bg-white disabled:opacity-40" disabled>
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Add Apartment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[22px]">add_home</span>
                <h3 className="text-base font-bold text-slate-900">Thêm Căn Hộ Mới Vào Hệ Thống</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateApartment} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tòa nhà *
                  </label>
                  <select
                    name="building"
                    className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700"
                  >
                    <option>Tháp Parkview A</option>
                    <option>Tháp Parkview B</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số phòng / Mã căn *
                  </label>
                  <input
                    name="roomNumber"
                    required
                    placeholder="VD: A-1208"
                    className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tầng *
                  </label>
                  <input
                    name="floor"
                    required
                    type="number"
                    placeholder="VD: 12"
                    className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Diện tích thông thủy (m²) *
                  </label>
                  <input
                    name="area"
                    required
                    type="number"
                    placeholder="VD: 86"
                    className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Họ tên chủ sở hữu
                  </label>
                  <input
                    name="ownerName"
                    placeholder="VD: Nguyễn Văn B"
                    className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    name="ownerPhone"
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-blue-700 text-white hover:bg-blue-800 font-semibold shadow-sm"
                >
                  Lưu căn hộ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
