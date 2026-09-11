'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Apartment } from '@/types';

type TabType = 'overview' | 'owner' | 'household' | 'residents' | 'vehicles' | 'invoices' | 'history';

interface DetailClientProps {
  apartment: Apartment;
}

export function ApartmentDetailClient({ apartment }: DetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showAddResidentModal, setShowAddResidentModal] = useState(false);

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      {/* Breadcrumb and Quick Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
          <Link href="/can-ho" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">domain</span>
            <span>Căn hộ</span>
          </Link>
          <span className="material-symbols-outlined text-outline-variant text-[14px]">chevron_right</span>
          <span className="text-on-surface-variant">{apartment.building}</span>
          <span className="material-symbols-outlined text-outline-variant text-[14px]">chevron_right</span>
          <span className="font-semibold text-on-surface">{apartment.roomNumber}</span>
        </nav>

        <div className="flex items-center gap-space-sm text-outline font-label-sm text-label-sm">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">update</span>
            Cập nhật: 10 phút trước
          </span>
          <span>•</span>
          <span>ID Căn: APT-PK-{apartment.roomNumber.replace('-', '')}</span>
        </div>
      </div>

      {/* Hero Header Section with Contrast & Elevation */}
      <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-xl shadow-sm border border-outline-variant/20 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start sm:items-center gap-space-md z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[36px] sm:text-[44px]">apartment</span>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-space-sm">
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                {apartment.roomNumber}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-container font-label-md text-label-md font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                Đang ở
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium">
                Gia đình thường trú
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant flex flex-wrap items-center gap-y-1 gap-x-2">
              <span className="font-medium text-on-surface">{apartment.building}</span>
              <span className="text-outline-variant">•</span>
              <span>Tầng {apartment.floor}</span>
              <span className="text-outline-variant">•</span>
              <span className="font-medium text-on-surface">{apartment.area} m²</span>
              <span className="text-outline-variant">•</span>
              <span>{apartment.roomType}</span>
              <span className="text-outline-variant">•</span>
              <span className="inline-flex items-center gap-1 text-secondary font-medium">
                <span className="material-symbols-outlined text-[14px]">explore</span> {apartment.direction}
              </span>
            </p>
          </div>
        </div>

        {/* Hero Actions */}
        <div className="flex items-center gap-space-sm z-10 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => alert('Chức năng chỉnh sửa thông tin căn hộ')}
            className="px-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-medium transition-colors flex items-center gap-2 border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit</span>
            <span>Chỉnh sửa căn hộ</span>
          </button>
          <button
            onClick={() => setShowAddResidentModal(true)}
            className="px-space-md py-2.5 rounded-lg bg-primary-container hover:bg-primary text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-2 shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Thêm cư dân</span>
          </button>
          <button
            onClick={() => alert('Xuất hồ sơ căn hộ PDF')}
            className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors flex items-center justify-center border border-outline-variant/30"
            type="button"
            title="Tùy chọn khác"
          >
            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
          </button>
        </div>
      </div>

      {/* Navigation Underline Tabs */}
      <div className="bg-surface-container-lowest px-space-md rounded-lg shadow-sm border border-outline-variant/20 overflow-x-auto">
        <div className="flex items-center gap-space-lg min-w-max">
          {[
            { id: 'overview', label: 'Tổng quan', icon: 'space_dashboard' },
            { id: 'owner', label: 'Chủ sở hữu', icon: 'shield_person' },
            { id: 'household', label: 'Hộ dân', icon: 'family_restroom', badge: '1' },
            { id: 'residents', label: 'Cư dân', icon: 'groups', badge: String(apartment.residents?.length || 4) },
            { id: 'vehicles', label: 'Phương tiện', icon: 'directions_car', badge: String(apartment.vehicles?.length || 2) },
            { id: 'invoices', label: 'Hóa đơn & Phí', icon: 'receipt_long' },
            { id: 'history', label: 'Lịch sử thay đổi', icon: 'history' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-3.5 px-1 font-label-md text-label-md flex items-center gap-1.5 transition-colors border-b-2 font-medium ${
                activeTab === tab.id
                  ? 'text-primary border-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-surface-container text-[11px] text-on-surface-variant font-semibold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Detail Layout (2/3 Left, 1/3 Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-space-lg">
          {/* Card 1: Hộ gia đình & Nhân khẩu cư trú */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Nhân khẩu cư trú hiện tại
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Danh sách cư dân đã đăng ký thường trú / tạm trú tại căn {apartment.roomNumber}
                </p>
              </div>
              <button
                onClick={() => setShowAddResidentModal(true)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Thêm người</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20 text-xs text-outline font-semibold uppercase">
                    <th className="py-2.5 px-3">Họ và tên</th>
                    <th className="py-2.5 px-3">Quan hệ</th>
                    <th className="py-2.5 px-3">CCCD</th>
                    <th className="py-2.5 px-3">Ngày sinh</th>
                    <th className="py-2.5 px-3">Cư trú</th>
                    <th className="py-2.5 px-3 text-right">Số ĐT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {(apartment.residents?.length ? apartment.residents : [
                    { id: '1', fullName: 'Trần Hoàng Nam', relationship: 'Chủ hộ', citizenId: '001090012345', dateOfBirth: '14/05/1985', residentStatus: 'PERMANENT', phone: '0912 345 678', isHead: true },
                    { id: '2', fullName: 'Lê Thị Mai', relationship: 'Vợ', citizenId: '001192023456', dateOfBirth: '22/08/1988', residentStatus: 'PERMANENT', phone: '0988 123 456', isHead: false },
                    { id: '3', fullName: 'Trần Hoàng Quân', relationship: 'Con trai', citizenId: '001215034567', dateOfBirth: '10/11/2014', residentStatus: 'PERMANENT', phone: '—', isHead: false },
                    { id: '4', fullName: 'Trần Linh Chi', relationship: 'Con gái', citizenId: 'Chưa cấp', dateOfBirth: '05/03/2020', residentStatus: 'PERMANENT', phone: '—', isHead: false },
                  ]).map((resident) => (
                    <tr key={resident.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-on-surface flex items-center gap-2">
                          <span>{resident.fullName}</span>
                          {resident.isHead && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-fixed text-primary">
                              Chủ hộ
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-on-surface-variant">{resident.relationship}</td>
                      <td className="py-3 px-3 font-mono text-xs text-on-surface">{resident.citizenId}</td>
                      <td className="py-3 px-3 text-on-surface-variant text-xs">{resident.dateOfBirth}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-tertiary-fixed/30 text-tertiary">
                          Thường trú
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs text-on-surface-variant">
                        {resident.phone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2: Danh sách phương tiện */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Phương tiện & Thẻ giữ xe
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Xe đã được cấp thẻ định danh tại hầm gửi xe
                </p>
              </div>
              <button
                onClick={() => alert('Thêm phương tiện mới')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Đăng ký xe</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">directions_car</span>
                    <span className="font-mono font-bold text-base text-on-surface">29A-888.99</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">Mazda CX-5 (Màu Trắng)</p>
                  <p className="text-xs text-secondary font-medium">Vị trí: B2-A14 (Ô tô)</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-tertiary-fixed/40 text-tertiary">
                  Đang hoạt động
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">two_wheeler</span>
                    <span className="font-mono font-bold text-base text-on-surface">29B1-234.56</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">Honda SH 150i (Màu Đen)</p>
                  <p className="text-xs text-secondary font-medium">Vị trí: B1-XM-205 (Xe máy)</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-tertiary-fixed/40 text-tertiary">
                  Đang hoạt động
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Hóa đơn & Phí gần nhất */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Hóa đơn & Dịch vụ gần nhất
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Theo dõi tiền quản lý, điện, nước và dịch vụ gửi xe
                </p>
              </div>
              <Link href="/phi-chung-cu" className="text-xs font-semibold text-primary hover:underline">
                Xem toàn bộ lịch sử
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20 text-xs text-outline font-semibold uppercase">
                    <th className="py-2.5 px-3">Mã Hóa đơn</th>
                    <th className="py-2.5 px-3">Kỳ hóa đơn</th>
                    <th className="py-2.5 px-3">Phí QL</th>
                    <th className="py-2.5 px-3">Điện & Nước</th>
                    <th className="py-2.5 px-3">Gửi xe</th>
                    <th className="py-2.5 px-3 font-bold">Tổng tiền</th>
                    <th className="py-2.5 px-3 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-xs text-primary">INV-202510-A1205</td>
                    <td className="py-3 px-3 font-medium text-on-surface">Tháng 10/2025</td>
                    <td className="py-3 px-3 text-on-surface-variant">1.290.000đ</td>
                    <td className="py-3 px-3 text-on-surface-variant">1.395.000đ</td>
                    <td className="py-3 px-3 text-on-surface-variant">1.350.000đ</td>
                    <td className="py-3 px-3 font-bold text-on-surface">4.035.000đ</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary-fixed/40 text-tertiary">
                        Đã thanh toán
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-xs text-primary">INV-202509-A1205</td>
                    <td className="py-3 px-3 font-medium text-on-surface">Tháng 09/2025</td>
                    <td className="py-3 px-3 text-on-surface-variant">1.290.000đ</td>
                    <td className="py-3 px-3 text-on-surface-variant">1.650.000đ</td>
                    <td className="py-3 px-3 text-on-surface-variant">1.350.000đ</td>
                    <td className="py-3 px-3 font-bold text-on-surface">4.290.000đ</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary-fixed/40 text-tertiary">
                        Đã thanh toán
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Owner Info, Meters & Quick Notes */}
        <div className="space-y-space-lg">
          {/* Card: Chủ sở hữu căn hộ */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Chủ sở hữu căn hộ
              </h3>
              <span className="material-symbols-outlined text-outline text-[20px]">badge</span>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/20">
              <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center text-base">
                NAM
              </div>
              <div>
                <h4 className="font-bold text-on-surface">{apartment.ownerName}</h4>
                <p className="text-xs text-on-surface-variant">Chủ hộ kiêm chủ sở hữu</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Số CCCD:</span>
                <span className="font-mono font-medium text-on-surface">{apartment.ownerCitizenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Số điện thoại:</span>
                <span className="font-mono font-medium text-primary">{apartment.ownerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Hợp đồng mua bán:</span>
                <span className="font-mono font-medium text-on-surface">HĐ-PK-1205/2022</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Ngày bàn giao:</span>
                <span className="font-medium text-on-surface">{apartment.handoverDate}</span>
              </div>
            </div>

            <button
              onClick={() => alert('Liên hệ chủ hộ qua điện thoại')}
              className="w-full py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Gọi điện cho chủ hộ</span>
            </button>
          </div>

          {/* Card: Chỉ số đồng hồ tiêu thụ */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Chỉ số tiêu thụ kỳ này
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-surface-container-low/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-on-surface">Điện sinh hoạt</div>
                    <div className="text-[11px] text-on-surface-variant">Chỉ số: 4,820 kWh</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-on-surface font-mono">245 kWh</div>
                  <div className="text-[11px] text-secondary font-medium">-12 kWh so với kỳ trước</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">water_drop</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-on-surface">Nước sinh hoạt</div>
                    <div className="text-[11px] text-on-surface-variant">Chỉ số: 182 m³</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-on-surface font-mono">18 m³</div>
                  <div className="text-[11px] text-on-surface-variant font-medium">+1 m³ so với kỳ trước</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Phản ánh của căn hộ */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-3">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Ý kiến & Yêu cầu gần nhất
            </h3>
            <div className="p-3 rounded-lg bg-surface-container-low/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-on-surface">Thêm thẻ xe điện hầm B1</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Tiếp nhận
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Yêu cầu cấp thêm 01 thẻ RFID gửi xe điện tầng hầm B1.
              </p>
              <div className="text-[11px] text-outline pt-1">Gửi lúc: Hôm qua, 16:45</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Resident Modal */}
      {showAddResidentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/30 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                Thêm cư dân vào căn {apartment.roomNumber}
              </h3>
              <button
                onClick={() => setShowAddResidentModal(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Đã thêm cư dân vào căn ${apartment.roomNumber} thành công!`);
                setShowAddResidentModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Họ và tên *
                </label>
                <input
                  required
                  placeholder="VD: Trần Hoàng Anh"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Số CCCD / Mã định danh
                  </label>
                  <input
                    placeholder="12 chữ số"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Ngày sinh *
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Quan hệ với chủ hộ *
                  </label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none">
                    <option>Con</option>
                    <option>Bố / Mẹ</option>
                    <option>Vợ / Chồng</option>
                    <option>Anh / Chị / Em</option>
                    <option>Khách thuê</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Tình trạng cư trú *
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
                  onClick={() => setShowAddResidentModal(false)}
                  className="px-4 py-2 text-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-primary-container text-white hover:bg-primary font-semibold shadow-sm"
                >
                  Lưu cư dân
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
