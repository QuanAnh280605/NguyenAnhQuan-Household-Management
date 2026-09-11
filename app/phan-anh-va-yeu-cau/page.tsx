'use client';

import Link from 'next/link';
import { mockFeedbacks } from '@/lib/mock-data';

export default function PhanAnhPage() {
  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Phản ánh & Yêu cầu Dịch vụ
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">
              14 Ý kiến trong tháng
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Tiếp nhận, xử lý và phản hồi các kiến nghị, sự cố kỹ thuật từ cư dân.
          </p>
        </div>

        <button
          onClick={() => alert('Tạo phiếu tiếp nhận phản ánh')}
          className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary transition-colors font-label-md text-label-md font-semibold self-start sm:self-auto"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add_task</span>
          <span>Tạo phiếu tiếp nhận</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 divide-y divide-outline-variant/15">
        {mockFeedbacks.map((fb) => (
          <div key={fb.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-low/30 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-bold text-base text-on-surface">{fb.title}</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    fb.priority === 'URGENT'
                      ? 'bg-error-container text-on-error-container'
                      : fb.priority === 'HIGH'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {fb.priority === 'URGENT' ? 'Khẩn cấp' : fb.priority === 'HIGH' ? 'Ưu tiên cao' : 'Bình thường'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                  {fb.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant flex-wrap">
                <Link href={`/can-ho/${fb.roomNumber}`} className="font-bold text-primary hover:underline">
                  Căn hộ {fb.roomNumber}
                </Link>
                <span>•</span>
                <span>Người gửi: <strong>{fb.residentName}</strong></span>
                <span>•</span>
                <span>Tiếp nhận: {fb.createdAt}</span>
                <span>•</span>
                <span>Cập nhật: {fb.updatedAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  fb.status === 'RESOLVED'
                    ? 'bg-tertiary-fixed/40 text-tertiary'
                    : fb.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {fb.status === 'RESOLVED' ? 'Đã giải quyết' : fb.status === 'IN_PROGRESS' ? 'Đang xử lý' : 'Chờ xử lý'}
              </span>
              <button
                onClick={() => alert(`Xem chi tiết phiếu phản ánh: ${fb.title}`)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                Xử lý
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
