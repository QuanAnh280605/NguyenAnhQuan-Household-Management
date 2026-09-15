'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockFeedbacks } from '@/lib/mock-data';

export default function HomePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const monthlyFlowData = [
    { month: 'T5/25', in: 18, out: 5 },
    { month: 'T6/25', in: 24, out: 6 },
    { month: 'T7/25', in: 19, out: 4 },
    { month: 'T8/25', in: 22, out: 7 },
    { month: 'T9/25', in: 15, out: 3 },
    { month: 'T10/25', in: 12, out: 2 },
  ];

  const maxVal = 28;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(false);
    setToastMessage('Đã lưu hồ sơ cư dân mới thành công vào cơ sở dữ liệu BQL!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex flex-col w-full space-y-5 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 bg-emerald-700 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 text-sm font-medium">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Operational Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 lg:p-5 rounded-lg border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
              Bảng Điều Khiển Vận Hành Tòa Nhà
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
              Trực tiếp
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Chung cư Parkview Tower (Tháp A & B) • Cập nhật dữ liệu lúc 09:30 ngày 24/10/2025
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => {
              setToastMessage('Báo cáo ca trực đang được kết xuất thành file Excel...');
              setTimeout(() => setToastMessage(null), 3500);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">file_download</span>
            <span>Báo cáo ca trực</span>
          </button>

          <Link
            href="/phi-chung-cu"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">receipt_long</span>
            <span>Thu phí nhanh</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">person_add</span>
            <span>Thêm cư dân</span>
          </button>
        </div>
      </div>

      {/* 4 Professional KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Total Apartments */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              TỔNG CĂN HỘ
            </span>
            <span className="p-1 rounded bg-slate-100 text-blue-800">
              <span className="material-symbols-outlined text-[18px]">apartment</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              320 <span className="text-xs font-normal text-slate-500">căn</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>Đang ở: <strong>298</strong> (93.1%)</span>
              <span className="text-slate-400">•</span>
              <span>Trống: <strong>24</strong></span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1 border-t border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>12 căn đang hoàn thiện nội thất</span>
          </div>
        </div>

        {/* Total Residents */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              QUY MÔ DÂN CƯ
            </span>
            <span className="p-1 rounded bg-slate-100 text-blue-800">
              <span className="material-symbols-outlined text-[18px]">groups</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              1,248 <span className="text-xs font-normal text-slate-500">nhân khẩu</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>306 hộ gia đình</span>
              <span className="text-slate-400">•</span>
              <span>TB 3.9 người/hộ</span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1 border-t border-slate-100">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>Tăng trưởng thuần +12 người tháng này</span>
          </div>
        </div>

        {/* Fee Collection Progress */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              THU PHÍ T10/2025
            </span>
            <span className="p-1 rounded bg-slate-100 text-blue-800">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              564.2 <span className="text-xs font-normal text-slate-500">triệu đ</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>Đạt <strong>81.7%</strong> kỳ thu</span>
              <span className="text-red-600 font-medium">42 căn chưa nộp</span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
            <span>Kế hoạch: 690.7 tr</span>
            <Link href="/phi-chung-cu" className="text-blue-700 font-semibold hover:underline">
              Chi tiết nợ
            </Link>
          </div>
        </div>

        {/* Operational Issues & Feedbacks */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              PHẢN ÁNH & SỰ CỐ
            </span>
            <span className="p-1 rounded bg-slate-100 text-blue-800">
              <span className="material-symbols-outlined text-[18px]">assignment_late</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              14 <span className="text-xs font-normal text-slate-500">yêu cầu</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span className="text-red-600 font-semibold">2 khẩn cấp</span>
              <span className="text-slate-400">•</span>
              <span>4 đang xử lý</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700">8 đã xong</span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1 border-t border-slate-100">
            <span className="material-symbols-outlined text-[14px] text-blue-700">timer</span>
            <span>Thời gian phản hồi TB: 18 phút</span>
          </div>
        </div>
      </div>

      {/* Main Operations Grid: 2 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Columns: Monthly Resident Migration Bar Chart & Recent Feedbacks */}
        <div className="lg:col-span-2 space-y-5">
          {/* Monthly Migration Chart (Realistic Bar Chart) */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Biến Động Cư Dân Theo Tháng
                </h2>
                <p className="text-xs text-slate-500">
                  Số lượt cư dân chuyển đến và rời đi trong 6 tháng gần nhất
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-blue-700"></span>
                  <span>Chuyển đến</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-slate-400"></span>
                  <span>Chuyển đi</span>
                </div>
              </div>
            </div>

            {/* Structured Bar Visualization */}
            <div className="pt-4 pb-1">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 h-48 border-b border-slate-200 px-2">
                {monthlyFlowData.map((item, idx) => {
                  const inHeight = Math.round((item.in / maxVal) * 100);
                  const outHeight = Math.round((item.out / maxVal) * 100);

                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full gap-1">
                      <div className="flex items-end gap-1.5 w-full justify-center h-full">
                        {/* In Bar */}
                        <div
                          style={{ height: `${inHeight}%` }}
                          className="w-4 sm:w-6 bg-blue-700 hover:bg-blue-800 rounded-t transition-all group relative flex justify-center"
                        >
                          <span className="absolute -top-5 text-[10px] font-bold text-slate-700 opacity-80 group-hover:opacity-100">
                            +{item.in}
                          </span>
                        </div>
                        {/* Out Bar */}
                        <div
                          style={{ height: `${outHeight}%` }}
                          className="w-4 sm:w-6 bg-slate-300 hover:bg-slate-400 rounded-t transition-all group relative flex justify-center"
                        >
                          <span className="absolute -top-5 text-[10px] font-bold text-slate-500 opacity-80 group-hover:opacity-100">
                            -{item.out}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 mt-2">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2.5 px-1">
                <span>Tổng chuyển đến 6 tháng: <strong>+110 người</strong></span>
                <span>Tổng chuyển đi 6 tháng: <strong>-27 người</strong></span>
                <span className="text-blue-700 font-semibold">Tăng thuần: +83 người</span>
              </div>
            </div>
          </div>

          {/* Recent Feedbacks / Incidents */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Phản Ánh & Yêu Cầu Cần Xử Lý
                </h2>
                <p className="text-xs text-slate-500">
                  Danh sách sự cố và ý kiến cư dân mới gửi trong ngày
                </p>
              </div>
              <Link
                href="/phan-anh-va-yeu-cau"
                className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>Xem tất cả (14)</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {mockFeedbacks.map((item) => (
                <div key={item.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          item.priority === 'URGENT'
                            ? 'bg-red-100 text-red-800'
                            : item.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.priority === 'URGENT' ? 'Khẩn cấp' : item.priority === 'HIGH' ? 'Ưu tiên cao' : 'Bình thường'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="font-semibold text-blue-700">Căn {item.roomNumber}</span>
                      <span>•</span>
                      <span>{item.residentName}</span>
                      <span>•</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded flex-shrink-0 ${
                      item.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
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

        {/* Right 1 Column: Operational Alerts & Residence Structure */}
        <div className="space-y-5">
          {/* Overdue Fee Warning Widget (Replaced AI Demo Card) */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">warning</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Đôn Đốc Nợ Phí (&gt; 60 Ngày)
                </h3>
              </div>
              <span className="text-[11px] text-red-600 font-bold">3 căn</span>
            </div>

            <p className="text-xs text-slate-500">
              Các căn hộ có dư nợ quá 2 kỳ, cần gửi thông báo đôn đốc trước ngày 30 hàng tháng.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Căn B-0802</div>
                  <div className="text-[11px] text-slate-500">Chủ hộ: Nguyễn Văn Hùng</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 font-mono">12.850.000 đ</div>
                  <div className="text-[10px] text-slate-400">Nợ 3 tháng</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Căn A-1207</div>
                  <div className="text-[11px] text-slate-500">Chủ hộ: Nguyễn Tiến Dũng</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 font-mono">8.420.000 đ</div>
                  <div className="text-[10px] text-slate-400">Nợ 2 tháng</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Căn B-1504</div>
                  <div className="text-[11px] text-slate-500">Chủ hộ: Đỗ Hoàng Yến</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 font-mono">6.150.000 đ</div>
                  <div className="text-[10px] text-slate-400">Nợ 2 tháng</div>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/phi-chung-cu"
                className="w-full py-1.5 px-3 rounded bg-blue-50 hover:bg-blue-100/70 text-blue-800 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <span>Xử lý đôn đốc thu phí</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Residence Structure Progress */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100">
              Cơ Cấu Cư Trú
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">Thường trú (1,036 người)</span>
                  <span className="text-slate-900 font-bold">83%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-700 rounded" style={{ width: '83%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">Tạm trú (175 người)</span>
                  <span className="text-slate-900 font-bold">14%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-600 rounded" style={{ width: '14%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">Tạm vắng (37 người)</span>
                  <span className="text-slate-900 font-bold">3%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded" style={{ width: '3%' }}></div>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-700 text-[18px]">verified</span>
              <span>100% hồ sơ thường trú đã đối soát CCCD chip qua VNeID.</span>
            </div>
          </div>

          {/* Duty Schedule / Operations Notice */}
          <div className="bg-slate-900 text-white rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">
                Lịch Trực Vận Hành Hôm Nay
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Ca sáng (07h - 15h):</span>
                <span className="font-semibold text-white">Nguyễn Văn An (Trưởng ca)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Kỹ thuật điện nước:</span>
                <span className="font-semibold text-white">Lê Văn Hưng</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bảo vệ sảnh A & B:</span>
                <span className="font-semibold text-white">Tổ An ninh 1 (4 đ/c)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Resident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[22px]">person_add</span>
                <h3 className="text-base font-bold text-slate-900">Tiếp nhận Hồ sơ Cư dân Mới</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Họ và tên cư dân *
                </label>
                <input
                  required
                  placeholder="VD: Trần Hoàng Nam"
                  className="w-full px-3 py-2 text-xs rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số CCCD / Mã định danh *
                  </label>
                  <input
                    required
                    placeholder="12 chữ số"
                    className="w-full px-3 py-2 text-xs rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Căn hộ tiếp nhận *
                  </label>
                  <select className="w-full px-3 py-2 text-xs rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700">
                    <option>A-1205 (Đang ở)</option>
                    <option>A-1206 (Đang ở)</option>
                    <option>A-0501 (Trống - Bàn giao mới)</option>
                    <option>B-0802 (Đang ở)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 text-xs rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quan hệ với chủ hộ
                  </label>
                  <select className="w-full px-3 py-2 text-xs rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700">
                    <option>Chủ hộ</option>
                    <option>Vợ / Chồng</option>
                    <option>Con</option>
                    <option>Bố / Mẹ</option>
                    <option>Khách thuê</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs rounded bg-blue-700 text-white hover:bg-blue-800 font-semibold shadow-sm"
                >
                  Lưu hồ sơ cư dân
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
