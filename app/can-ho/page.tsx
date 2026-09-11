'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockApartmentsList } from '@/lib/mock-data';
import { Apartment } from '@/types';

export default function CanHoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter apartments
  const filteredApartments = mockApartmentsList.filter((apt) => {
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-container font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Đang ở (Chính chủ)
          </span>
        );
      case 'RENTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Đang cho thuê
          </span>
        );
      case 'EMPTY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-outline font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            Còn trống
          </span>
        );
      case 'REPAIRING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Đang thi công
          </span>
        );
    }
  };

  const getFeeBadge = (status: Apartment['feeStatus']) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed/40 text-tertiary font-bold text-xs">
            Đã đóng đủ
          </span>
        );
      case 'UNPAID':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
            Chưa đóng
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-bold text-xs">
            Quá hạn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      {/* 4 Top Stat Highlights & Context Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Tổng số căn hộ
            </span>
            <div className="font-metric-display text-metric-display text-on-surface font-bold">320</div>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-medium">
              <span className="material-symbols-outlined text-[15px]">trending_up</span>
              <span>100% bàn giao thiết kế</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[26px]">apartment</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Đang có người ở
            </span>
            <div className="font-metric-display text-metric-display text-on-surface font-bold">284</div>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-medium">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>Tỷ lệ lấp đầy 88.75%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[26px]">family_restroom</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Căn hộ còn trống
            </span>
            <div className="font-metric-display text-metric-display text-on-surface font-bold">24</div>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-outline font-medium">
              <span>7.5% sẵn sàng bàn giao</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[26px]">door_front</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Đang thi công / Sửa
            </span>
            <div className="font-metric-display text-metric-display text-on-surface font-bold">12</div>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-amber-700 font-medium">
              <span className="material-symbols-outlined text-[15px]">construction</span>
              <span>Đã cấp phép PCCC & ồn</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-[26px]">handyman</span>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Căn hộ
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-semibold">
              Tòa Parkview
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Quản lý toàn bộ căn hộ, tình trạng bàn giao và thông tin chủ sở hữu.
          </p>
        </div>

        <div className="flex items-center gap-space-sm flex-shrink-0">
          <button
            onClick={() => alert('Xuất file danh sách căn hộ thành công!')}
            className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant/30 shadow-sm hover:bg-surface-container-high transition-colors font-label-md text-label-md font-medium"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Xuất Excel / CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary transition-colors font-label-md text-label-md font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Thêm căn hộ</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex flex-wrap items-center gap-space-sm flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-space-md py-2 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container border border-transparent"
              placeholder="Tìm theo mã căn hộ, tên chủ nhà, SĐT..."
              type="text"
            />
          </div>

          {/* Building Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer border border-transparent"
            >
              <option value="ALL">Tất cả Tòa</option>
              <option value="A">Tòa Parkview A</option>
              <option value="B">Tòa Parkview B</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              expand_more
            </span>
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer border border-transparent"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="OCCUPIED">Đang có người ở</option>
              <option value="EMPTY">Căn hộ còn trống</option>
              <option value="REPAIRING">Đang thi công</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              expand_more
            </span>
          </div>
        </div>

        <div className="text-xs text-on-surface-variant font-medium">
          Tìm thấy <strong className="text-on-surface font-bold">{filteredApartments.length}</strong> căn hộ phù hợp
        </div>
      </div>

      {/* Apartments Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/20 text-xs font-semibold uppercase tracking-wider text-outline">
                <th className="py-3.5 px-4">Mã căn</th>
                <th className="py-3.5 px-4">Tòa & Tầng</th>
                <th className="py-3.5 px-4">Diện tích / Loại</th>
                <th className="py-3.5 px-4">Chủ sở hữu</th>
                <th className="py-3.5 px-4">Số ĐT liên hệ</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Phí dịch vụ</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-sm">
              {filteredApartments.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-surface-container-low/40 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-bold text-primary">
                    <Link
                      href={`/can-ho/${apt.roomNumber}`}
                      className="hover:underline flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">apartment</span>
                      <span>{apt.roomNumber}</span>
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface">
                    <span>{apt.building}</span>
                    <span className="text-outline-variant mx-1.5">•</span>
                    <span className="text-on-surface-variant">Tầng {apt.floor}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-on-surface">{apt.area} m²</div>
                    <div className="text-xs text-on-surface-variant">{apt.roomType}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-on-surface">
                    {apt.ownerName}
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-mono text-xs">
                    {apt.ownerPhone}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(apt.status)}</td>
                  <td className="py-3.5 px-4">{getFeeBadge(apt.feeStatus)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/can-ho/${apt.roomNumber}`}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-container-low hover:bg-surface-container text-primary transition-colors"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div>
            Hiển thị 1 - {filteredApartments.length} của 320 căn hộ
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low disabled:opacity-40" disabled>
              Trước
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary-container text-white font-bold">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low">
              3
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Add Apartment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/30 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">add_home</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Thêm căn hộ mới</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Đã thêm căn hộ thành công!');
                setShowAddModal(false);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Tòa nhà *
                  </label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none">
                    <option>Tòa Parkview A</option>
                    <option>Tòa Parkview B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Số phòng / Mã căn *
                  </label>
                  <input
                    required
                    placeholder="VD: A-1208"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Tầng *
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="VD: 12"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Diện tích (m²) *
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="VD: 86"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Chủ sở hữu
                  </label>
                  <input
                    placeholder="Họ tên chủ nhà"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Số điện thoại
                  </label>
                  <input
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-primary-container text-white hover:bg-primary font-semibold shadow-sm"
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
