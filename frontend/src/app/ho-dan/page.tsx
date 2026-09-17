'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockHouseholdsList } from '@/lib/mock-data';

export default function HoDanPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('ALL');
  const [filterSize, setFilterSize] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const filteredHouseholds = mockHouseholdsList.filter((hh) => {
    const matchesSearch =
      hh.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hh.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hh.householdCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hh.headPhone.includes(searchTerm);

    const matchesBuilding =
      filterBuilding === 'ALL' ||
      (filterBuilding === 'A' && hh.building.includes('A')) ||
      (filterBuilding === 'B' && hh.building.includes('B'));

    const matchesSize =
      filterSize === 'ALL' ||
      (filterSize === '1-2' && hh.memberCount <= 2) ||
      (filterSize === '3-4' && hh.memberCount >= 3 && hh.memberCount <= 4) ||
      (filterSize === '5+' && hh.memberCount >= 5);

    const matchesType =
      filterType === 'ALL' ||
      (filterType === 'PERMANENT' && hh.residenceType === 'Thường trú') ||
      (filterType === 'TEMPORARY' && hh.residenceType === 'Tạm trú');

    return matchesSearch && matchesBuilding && matchesSize && matchesType;
  });

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      {/* Header Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-sm">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Hộ dân
            </h1>
            <span className="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-primary-fixed text-primary font-bold">
              306 Hộ
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Quản lý danh sách các hộ gia đình gắn liền với từng căn hộ và cơ cấu nhân khẩu.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            onClick={() => alert('Xuất báo cáo nhân khẩu Excel')}
            className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant/30 shadow-sm hover:bg-surface-container-high transition-all text-body-sm font-medium"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">file_download</span>
            <span>Export báo cáo nhân khẩu</span>
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary transition-all text-body-sm font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Đăng ký hộ dân mới</span>
          </button>
        </div>
      </div>

      {/* 3 Stat Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Stat 1 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-fixed/20 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Tổng số hộ dân
            </span>
            <span className="p-2 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[20px]">
              family_restroom
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-space-sm">
            <span className="font-metric-display text-metric-display text-on-surface font-bold">306</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">hộ dân</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              95.6%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Tỷ lệ phủ căn hộ</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary-fixed/20 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Quy mô trung bình
            </span>
            <span className="p-2 rounded-lg bg-surface-container text-secondary material-symbols-outlined text-[20px]">
              groups
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-space-sm">
            <span className="font-metric-display text-metric-display text-on-surface font-bold">3.4</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">người / hộ</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
            <span className="font-bold text-on-surface">1,040</span> cư dân thường trú hiện hành
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-surface-variant/40 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Biến động trong tháng
            </span>
            <span className="p-2 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[20px]">
              sync_alt
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-space-sm">
            <span className="font-metric-display text-metric-display text-on-surface font-bold">7</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">hộ phát sinh</span>
          </div>
          <div className="mt-3 flex items-center gap-3 font-label-sm text-label-sm font-semibold">
            <span className="text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 4 đăng ký mới
            </span>
            <span className="text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span> 3 chuyển đi
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col lg:flex-row gap-space-sm lg:items-center justify-between">
        <div className="flex-1 max-w-lg relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low pl-10 pr-4 py-2 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-colors border border-transparent"
            placeholder="Tìm theo tên chủ hộ, mã căn, số điện thoại..."
            type="text"
          />
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Tòa */}
          <div className="relative">
            <select
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3.5 py-2 pr-8 rounded-lg cursor-pointer outline-none hover:bg-surface-container border border-transparent"
            >
              <option value="ALL">Tất cả Tòa</option>
              <option value="A">Tòa Parkview A</option>
              <option value="B">Tòa Parkview B</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Quy mô nhân khẩu */}
          <div className="relative">
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3.5 py-2 pr-8 rounded-lg cursor-pointer outline-none hover:bg-surface-container border border-transparent"
            >
              <option value="ALL">Quy mô nhân khẩu</option>
              <option value="1-2">1 - 2 người</option>
              <option value="3-4">3 - 4 người</option>
              <option value="5+">5+ người</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Loại cư trú */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3.5 py-2 pr-8 rounded-lg cursor-pointer outline-none hover:bg-surface-container border border-transparent"
            >
              <option value="ALL">Loại cư trú</option>
              <option value="PERMANENT">Thường trú</option>
              <option value="TEMPORARY">Tạm trú</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Household Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/20 text-xs font-semibold uppercase tracking-wider text-outline">
                <th className="py-3.5 px-4">Mã sổ hộ khẩu</th>
                <th className="py-3.5 px-4">Căn hộ</th>
                <th className="py-3.5 px-4">Chủ hộ</th>
                <th className="py-3.5 px-4">Số nhân khẩu</th>
                <th className="py-3.5 px-4">Phương tiện</th>
                <th className="py-3.5 px-4">Loại cư trú</th>
                <th className="py-3.5 px-4">Ngày đăng ký</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-sm">
              {filteredHouseholds.map((hh) => (
                <tr key={hh.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-xs text-primary">
                    {hh.householdCode}
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    <Link
                      href={`/can-ho/${hh.roomNumber}`}
                      className="text-on-surface hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">apartment</span>
                      <span>{hh.roomNumber}</span>
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-on-surface">{hh.headName}</div>
                    <div className="text-xs text-on-surface-variant font-mono">{hh.headPhone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container font-semibold text-xs text-on-surface">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      {hh.memberCount} người
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-outline">directions_car</span>
                      {hh.vehicleCount} xe
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        hh.residenceType === 'Thường trú'
                          ? 'bg-secondary-fixed text-on-secondary-container'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {hh.residenceType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                    {hh.registrationDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/can-ho/${hh.roomNumber}`}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-container-low hover:bg-surface-container text-primary transition-colors inline-block"
                    >
                      Xem hộ
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Đăng ký hộ dân mới */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/30 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">family_restroom</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Đăng ký hộ gia đình mới
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Đăng ký hộ dân thành công!');
                setShowRegisterModal(false);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Căn hộ tiếp nhận *
                  </label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none">
                    <option>A-1205</option>
                    <option>A-1206</option>
                    <option>A-1207</option>
                    <option>A-0501</option>
                    <option>B-0802</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Mã sổ hộ khẩu *
                  </label>
                  <input
                    required
                    defaultValue="HK-PKA-1208"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Họ tên chủ hộ *
                </label>
                <input
                  required
                  placeholder="VD: Trần Văn Bình"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Số CCCD chủ hộ *
                  </label>
                  <input
                    required
                    placeholder="12 chữ số"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Số điện thoại
                  </label>
                  <input
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Số nhân khẩu ban đầu *
                  </label>
                  <input
                    type="number"
                    defaultValue={3}
                    min={1}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Loại cư trú *
                  </label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none">
                    <option>Thường trú</option>
                    <option>Tạm trú</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 text-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-primary-container text-white hover:bg-primary font-semibold shadow-sm"
                >
                  Tạo hồ sơ hộ dân
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
