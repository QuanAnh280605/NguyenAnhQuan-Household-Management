'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockFeedbacks, mockApartmentA1205 } from '@/lib/mock-data';

export default function HomePage() {
  const [chartPeriod, setChartPeriod] = useState<'6m' | '12m'>('6m');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      {/* Welcome Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Xin chào, Nguyễn Văn An
            </h1>
            <span className="text-2xl select-none">👋</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Tổng quan tình hình cư dân và vận hành chung cư hôm nay.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-space-sm">
          <div className="flex items-center gap-2 px-space-md py-2 rounded-lg bg-surface-container-lowest shadow-sm border border-outline-variant/30 text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-outline">calendar_today</span>
            <span className="font-label-md text-label-md font-medium">Hôm nay, 24 Tháng 10 2025</span>
          </div>

          <div className="relative">
            <select className="appearance-none bg-surface-container-lowest border border-outline-variant/30 shadow-sm px-space-md py-2 pr-8 rounded-lg font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer">
              <option>30 ngày qua</option>
              <option>Tuần này</option>
              <option>Quý này</option>
              <option>Năm nay</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              expand_more
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-primary-container hover:bg-primary text-white font-label-md text-label-md shadow-sm transition-all active:scale-[0.99] font-medium"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Thêm cư dân</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Total Apartments */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              TỔNG CĂN HỘ
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">apartment</span>
            </div>
          </div>
          <div>
            <div className="font-metric-display text-metric-display text-on-surface tracking-tight font-bold">
              320
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-body-sm text-body-sm text-on-surface-variant">298 đang có người ở</span>
              <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-tertiary-fixed/40 text-tertiary font-bold">
                93.1%
              </span>
            </div>
          </div>
          <div className="pt-2 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 border-t border-outline-variant/15">
            <span className="material-symbols-outlined text-[14px] text-tertiary font-bold">add_circle</span>
            <span>+2 căn bàn giao tháng này</span>
          </div>
        </div>

        {/* Total Residents */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              TỔNG CƯ DÂN
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">groups</span>
            </div>
          </div>
          <div>
            <div className="font-metric-display text-metric-display text-on-surface tracking-tight font-bold">
              1,248
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-body-sm text-body-sm text-on-surface-variant">+12 trong tháng này</span>
              <span className="flex items-center px-1.5 py-0.5 rounded-full font-label-sm text-label-sm bg-tertiary-fixed/40 text-tertiary font-bold">
                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 1.2%
              </span>
            </div>
          </div>
          <div className="pt-2 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-2 border-t border-outline-variant/15">
            <span>642 nam</span>
            <span className="text-outline-variant">•</span>
            <span>606 nữ</span>
          </div>
        </div>

        {/* Households */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              HỘ DÂN
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">family_restroom</span>
            </div>
          </div>
          <div>
            <div className="font-metric-display text-metric-display text-on-surface tracking-tight font-bold">
              306
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-body-sm text-body-sm text-on-surface-variant">95.6% căn hộ đã đăng ký</span>
            </div>
          </div>
          <div className="pt-2 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 border-t border-outline-variant/15">
            <span className="material-symbols-outlined text-[14px] text-primary">person_pin_circle</span>
            <span>4 hộ chuyển đến gần đây</span>
          </div>
        </div>

        {/* Outstanding Fees */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              CÔNG NỢ PHÍ
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
          </div>
          <div>
            <div className="font-metric-display text-metric-display text-on-surface tracking-tight font-bold">
              126.5 <span className="font-headline-sm text-headline-sm font-normal text-on-surface-variant">triệu</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-error-container text-on-error-container font-semibold">
                42 chưa đóng
              </span>
            </div>
          </div>
          <div className="pt-2 text-on-surface-variant font-label-sm text-label-sm flex items-center justify-between border-t border-outline-variant/15">
            <span>Đã thu 81.7% tổng kỳ</span>
            <Link href="/phi-chung-cu" className="font-medium text-primary hover:underline">
              Chi tiết
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Operations Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Left 2 Columns: Chart & Feedbacks */}
        <div className="lg:col-span-2 space-y-space-lg">
          {/* Biến động cư dân Chart Card */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Biến động cư dân
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Lưu lượng chuyển đến và rời đi theo các tháng gần đây
                </p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-lg self-start sm:self-auto border border-outline-variant/20">
                <button
                  onClick={() => setChartPeriod('6m')}
                  className={`px-3 py-1 text-label-sm font-label-sm rounded-md transition-all font-medium ${
                    chartPeriod === '6m'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  6 tháng
                </button>
                <button
                  onClick={() => setChartPeriod('12m')}
                  className={`px-3 py-1 text-label-sm font-label-sm rounded-md transition-all font-medium ${
                    chartPeriod === '12m'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  12 tháng
                </button>
              </div>
            </div>

            {/* Legend & Stats */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Chuyển đến (+108)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Chuyển đi (-24)
                </span>
              </div>
              <div className="ml-auto font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>Trung bình +14 cư dân/tháng</span>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="relative w-full h-64 pt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4338ca" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4338ca" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006a61" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#006a61" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="190" x2="600" y2="190" stroke="#c7c4d7" strokeWidth="1" />

                {/* Area and Line for Inflow (Chuyển đến) */}
                <path
                  d="M 20 150 Q 80 130 140 110 T 260 85 T 380 60 T 500 70 T 580 45 L 580 190 L 20 190 Z"
                  fill="url(#primaryGradient)"
                />
                <path
                  d="M 20 150 Q 80 130 140 110 T 260 85 T 380 60 T 500 70 T 580 45"
                  fill="none"
                  stroke="#4338ca"
                  strokeWidth="3"
                />

                {/* Area and Line for Outflow (Chuyển đi) */}
                <path
                  d="M 20 170 Q 80 160 140 165 T 260 155 T 380 145 T 500 150 T 580 140 L 580 190 L 20 190 Z"
                  fill="url(#secondaryGradient)"
                />
                <path
                  d="M 20 170 Q 80 160 140 165 T 260 155 T 380 145 T 500 150 T 580 140"
                  fill="none"
                  stroke="#006a61"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                />

                {/* Points on Primary Line */}
                {[
                  { cx: 20, cy: 150 },
                  { cx: 140, cy: 110 },
                  { cx: 260, cy: 85 },
                  { cx: 380, cy: 60 },
                  { cx: 500, cy: 70 },
                  { cx: 580, cy: 45 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#4338ca"
                    strokeWidth="2.5"
                  />
                ))}
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[11px] font-medium text-outline pt-2">
                <span>Tháng 5</span>
                <span>Tháng 6</span>
                <span>Tháng 7</span>
                <span>Tháng 8</span>
                <span>Tháng 9</span>
                <span>Tháng 10 (Hiện tại)</span>
              </div>
            </div>
          </div>

          {/* Phản ánh & Yêu cầu gần đây */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Phản ánh & Yêu cầu gần đây
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Ý kiến đóng góp và sự cố cần ban quản lý giải quyết
                </p>
              </div>
              <Link
                href="/phan-anh-va-yeu-cau"
                className="font-label-md text-label-md text-primary font-medium hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>

            <div className="divide-y divide-outline-variant/15">
              {mockFeedbacks.map((item) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-on-surface">{item.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.priority === 'URGENT'
                            ? 'bg-error-container text-on-error-container'
                            : item.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {item.priority === 'URGENT' ? 'Khẩn cấp' : item.priority === 'HIGH' ? 'Ưu tiên cao' : 'Bình thường'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="font-semibold text-primary">Căn {item.roomNumber}</span>
                      <span>•</span>
                      <span>{item.residentName}</span>
                      <span>•</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      item.status === 'RESOLVED'
                        ? 'bg-tertiary-fixed/40 text-tertiary'
                        : item.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status === 'RESOLVED'
                      ? 'Đã xử lý'
                      : item.status === 'IN_PROGRESS'
                      ? 'Đang xử lý'
                      : 'Tiếp nhận'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Residence breakdown, Fee Collection, Quick Apartment Link */}
        <div className="space-y-space-lg">
          {/* Tỷ lệ cư trú */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Cơ cấu cư trú
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-on-surface">Thường trú (1,036 người)</span>
                  <span className="text-primary font-bold">83%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-on-surface">Tạm trú (175 người)</span>
                  <span className="text-secondary font-bold">14%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-on-surface">Tạm vắng (37 người)</span>
                  <span className="text-outline font-bold">3%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-outline rounded-full" style={{ width: '3%' }}></div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low text-xs text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span>100% hồ sơ thường trú đã đối soát qua CCCD gắn chip VNeID.</span>
            </div>
          </div>

          {/* Thu phí tháng 10/2025 */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Thu phí tháng 10/2025
              </h3>
              <span className="text-xs font-bold text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
                81.7%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Đã thu:</span>
                <span className="font-bold text-on-surface">564.2 triệu</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Kế hoạch kỳ:</span>
                <span className="font-bold text-on-surface">690.7 triệu</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                <div className="h-full bg-tertiary-container rounded-full" style={{ width: '81.7%' }}></div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/phi-chung-cu"
                className="w-full py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-medium text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <span>Xem danh sách căn còn nợ phí (42 căn)</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Căn hộ tiêu biểu - Quick link to A-1205 */}
          <div className="bg-gradient-to-br from-primary-container to-primary text-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-primary-fixed/80 font-bold">
                Căn hộ mẫu kiểm thử
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold">
                Đang ở
              </span>
            </div>

            <div>
              <h4 className="text-2xl font-bold">{mockApartmentA1205.roomNumber}</h4>
              <p className="text-xs text-primary-fixed mt-1">
                {mockApartmentA1205.building} • Tầng {mockApartmentA1205.floor} • {mockApartmentA1205.area} m²
              </p>
              <p className="text-xs text-white/90 mt-2">
                Chủ hộ: <strong className="text-white">{mockApartmentA1205.ownerName}</strong> (4 nhân khẩu, 2 phương tiện)
              </p>
            </div>

            <Link
              href="/can-ho/A-1205"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-primary font-label-md text-xs font-bold hover:bg-white/90 transition-colors shadow-sm"
            >
              <span>Xem trang chi tiết A-1205</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Add Resident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/30 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">person_add</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Thêm cư dân mới</h3>
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
                alert('Đã thêm cư dân thành công!');
                setShowAddModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Họ và tên cư dân *
                </label>
                <input
                  required
                  placeholder="VD: Trần Hoàng Nam"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Số CCCD / Định danh *
                  </label>
                  <input
                    required
                    placeholder="12 chữ số"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:border-primary-container"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Căn hộ *
                  </label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:border-primary-container">
                    <option>A-1205</option>
                    <option>A-1206</option>
                    <option>A-1207</option>
                    <option>B-0802</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Số điện thoại
                  </label>
                  <input
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:border-primary-container"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Quan hệ với chủ hộ
                  </label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:border-primary-container">
                    <option>Chủ hộ</option>
                    <option>Vợ / Chồng</option>
                    <option>Con</option>
                    <option>Bố / Mẹ</option>
                    <option>Khách thuê</option>
                  </select>
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
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
