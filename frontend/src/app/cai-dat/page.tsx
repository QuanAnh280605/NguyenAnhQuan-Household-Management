'use client';

export default function CaiDatPage() {
  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
          Cài đặt Hệ thống
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Cấu hình thông tin tòa nhà chung cư, đơn giá dịch vụ và chính sách thanh toán.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 space-y-6">
        <div>
          <h3 className="font-headline-sm text-base font-bold text-on-surface mb-3">
            Thông tin Dự án Chung cư
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tên chung cư</label>
              <input
                defaultValue="Parkview Towers Residential Complex"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Đơn vị Quản lý vận hành</label>
              <input
                defaultValue="Công ty CP Quản lý Tòa nhà ResidentHub"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Địa chỉ tòa nhà</label>
              <input
                defaultValue="Số 88 Đường Parkview, Phường Mỹ Đình, Nam Từ Liêm, Hà Nội"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/20">
          <h3 className="font-headline-sm text-base font-bold text-on-surface mb-3">
            Biểu phí dịch vụ định mức
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Phí quản lý (đ/m²/tháng)</label>
              <input
                defaultValue="15,000"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Phí gửi ô tô (đ/xe/tháng)</label>
              <input
                defaultValue="1,200,000"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Phí gửi xe máy (đ/xe/tháng)</label>
              <input
                defaultValue="150,000"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-outline-variant/20">
          <button
            onClick={() => alert('Đã lưu cấu hình hệ thống thành công!')}
            className="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-sm hover:bg-primary shadow-sm"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
