'use client';

export default function LichSuCuTruPage() {
  const historyLogs = [
    {
      id: 'log-1',
      date: '24/10/2025 09:15',
      action: 'Nhập hộ mới',
      details: 'Căn A-0501: Thêm cư dân Hoàng Minh Tuấn vào danh sách thường trú',
      actor: 'Nguyễn Văn An (BQL)',
    },
    {
      id: 'log-2',
      date: '22/10/2025 14:30',
      action: 'Gia hạn tạm trú',
      details: 'Căn A-1207: Gia hạn tạm trú thêm 12 tháng cho 02 nhân khẩu',
      actor: 'Nguyễn Văn An (BQL)',
    },
    {
      id: 'log-3',
      date: '18/10/2025 10:00',
      action: 'Khai báo chuyển đi',
      details: 'Căn B-0302: Hoàn tất thủ tục chuyển đi và thanh toán công nợ',
      actor: 'Lê Thị Thu (Kế toán)',
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
          Lịch sử Cư trú & Biến động
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Nhật ký lưu trữ kiểm toán toàn bộ thay đổi nhân khẩu, tách hộ, chuyển đến và rời đi.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 divide-y divide-outline-variant/15">
        {historyLogs.map((log) => (
          <div key={log.id} className="p-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-on-surface">{log.action}</span>
                <span className="text-xs text-outline">•</span>
                <span className="text-xs text-on-surface-variant font-mono">{log.date}</span>
              </div>
              <p className="text-xs text-on-surface">{log.details}</p>
            </div>
            <span className="text-xs text-on-surface-variant font-medium flex-shrink-0">
              Thực hiện: <strong>{log.actor}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
