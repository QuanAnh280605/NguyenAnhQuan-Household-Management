'use client';

import React from 'react';
import { Invoice, InvoiceStatus } from '@/types';
import { formatCurrency } from '@/utils';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPayment?: (invoice: Invoice) => void;
}

export default function InvoiceDetailModal({
  invoice,
  isOpen,
  onClose,
  onOpenPayment,
}: InvoiceDetailModalProps) {
  if (!isOpen || !invoice) return null;

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Đã thanh toán
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Nộp một phần
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-800 border border-red-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            Quá hạn nộp
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Chưa thanh toán
          </span>
        );
    }
  };

  const remaining = invoice.totalAmount - (invoice.paidAmount || 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in">
        <div className="p-4 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Phiếu Báo Thu Phí Dịch Vụ</span>
            <h3 className="font-bold text-base text-slate-900 mt-0.5">{invoice.invoiceCode}</h3>
            <p className="text-xs text-slate-500">Kỳ tính phí: {invoice.billingMonth}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded border border-slate-200">
            <div>
              <span className="text-slate-400">Căn hộ:</span>
              <div className="font-bold text-slate-900 mt-0.5">{invoice.roomNumber}</div>
            </div>
            <div>
              <span className="text-slate-400">Chủ hộ:</span>
              <div className="font-bold text-slate-900 mt-0.5">{invoice.householdHead}</div>
            </div>
            <div>
              <span className="text-slate-400">Hạn thanh toán:</span>
              <div className="font-bold text-red-600 mt-0.5">{invoice.dueDate}</div>
            </div>
            <div>
              <span className="text-slate-400">Trạng thái:</span>
              <div className="mt-0.5">{getStatusBadge(invoice.status)}</div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2 px-3 text-left">Hạng mục</th>
                  <th className="py-2 px-3 text-right">Định mức</th>
                  <th className="py-2 px-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3 text-slate-800">Phí quản lý vận hành</td>
                  <td className="py-2 px-3 text-right text-slate-400">m² diện tích</td>
                  <td className="py-2 px-3 text-right font-mono">{invoice.managementFee.toLocaleString('vi-VN')} đ</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-800">Nước sinh hoạt</td>
                  <td className="py-2 px-3 text-right text-slate-400">Đồng hồ nước</td>
                  <td className="py-2 px-3 text-right font-mono">{invoice.waterFee.toLocaleString('vi-VN')} đ</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-800">Điện sinh hoạt</td>
                  <td className="py-2 px-3 text-right text-slate-400">Đồng hồ điện</td>
                  <td className="py-2 px-3 text-right font-mono">{invoice.electricityFee.toLocaleString('vi-VN')} đ</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-800">Trông giữ phương tiện</td>
                  <td className="py-2 px-3 text-right text-slate-400">Thẻ xe</td>
                  <td className="py-2 px-3 text-right font-mono">{invoice.vehicleFee.toLocaleString('vi-VN')} đ</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="py-2.5 px-3 text-right">TỔNG CỘNG:</td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-800 text-sm">{formatCurrency(invoice.totalAmount)}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="py-1.5 px-3 text-right text-emerald-700 text-xs">Đã thanh toán:</td>
                  <td className="py-1.5 px-3 text-right font-mono text-emerald-700 text-xs">{formatCurrency(invoice.paidAmount || 0)}</td>
                </tr>
                {remaining > 0 && (
                  <tr className="text-red-700">
                    <td colSpan={2} className="py-1.5 px-3 text-right font-bold text-xs">CÒN NỢ:</td>
                    <td className="py-1.5 px-3 text-right font-mono font-bold text-xs">{formatCurrency(remaining)}</td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          {invoice.paymentMethod && (
            <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200 text-xs flex items-center justify-between">
              <span>Phương thức: <strong>{invoice.paymentMethod}</strong></span>
              {invoice.paidAt && <span className="text-[11px] text-emerald-700">{invoice.paidAt}</span>}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Đóng lại
            </button>
            {remaining > 0 && onOpenPayment && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPayment(invoice);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 rounded shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">payments</span>
                <span>Thu phí ngay</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
