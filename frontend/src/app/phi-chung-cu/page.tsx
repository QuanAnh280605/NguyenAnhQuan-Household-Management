'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Invoice, InvoiceStatus } from '@/types';
import { formatCurrency } from '@/utils';
import { billingApi } from '@/services/api/billingApi';
import PaymentModal from '@/components/forms/PaymentModal';
import InvoiceDetailModal from '@/components/domain/billing/InvoiceDetailModal';

export default function PhiChungCuPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    billingApi.getInvoices(selectedMonth, statusFilter).then((res) => {
      if (!ignore) {
        setInvoices(res.data);
        setIsLiveApi(!res.isFallback);
        setLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, [selectedMonth, statusFilter]);

  // Filtered list
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.householdHead.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Dynamic KPIs
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalOutstanding = totalBilled - totalCollected;
  const overdueCount = invoices.filter((inv) => inv.status === 'OVERDUE').length;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Confirm payment callback
  const handleConfirmPayment = (invoiceId: string, amount: number, method: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const newPaid = (inv.paidAmount || 0) + amount;
          let newStatus: InvoiceStatus = inv.status;
          if (newPaid >= inv.totalAmount) {
            newStatus = 'PAID';
          } else if (newPaid > 0) {
            newStatus = 'PARTIAL';
          }
          return {
            ...inv,
            paidAmount: newPaid,
            status: newStatus,
            paymentMethod: method,
            paidAt: 'Vừa thanh toán',
          };
        }
        return inv;
      })
    );

    setSuccessToast(`Đã ghi nhận thanh toán ${formatCurrency(amount)} thành công!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

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

  return (
    <div className="flex flex-col w-full space-y-4 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-700 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-semibold animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
              Quản Lý Phí Dịch Vụ & Hóa Đơn Tòa Nhà
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
              Kỳ T10/2025
            </span>
            {isLiveApi ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                FastAPI Live
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                Demo Store
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tính toán tự động biểu phí quản lý, công tơ điện nước lũy tiến và đối soát thanh toán VietQR
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSuccessToast('Đang kết xuất bảng đối soát tài chính tháng ra file Excel...');
              setTimeout(() => setSuccessToast(null), 3500);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">file_download</span>
            <span>Báo cáo Excel</span>
          </button>
          <button
            onClick={() => {
              setSuccessToast('Hệ thống đang chạy quy trình tự động chốt công tơ & tạo hóa đơn...');
              setTimeout(() => setSuccessToast(null), 4000);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-blue-700 text-white hover:bg-blue-800 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Lập hóa đơn kỳ mới</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Tổng phí phát sinh kỳ này</div>
          <div className="text-lg font-bold text-slate-900 mt-1 font-mono">{formatCurrency(totalBilled)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Đã chốt công tơ ngày 25/10</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Thực thu đã đối soát</div>
          <div className="text-lg font-bold text-emerald-700 mt-1 font-mono">{formatCurrency(totalCollected)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Tỷ lệ thu: {collectionRate}% tổng quỹ</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Tổng nợ đọng cần thu</div>
          <div className="text-lg font-bold text-red-700 mt-1 font-mono">{formatCurrency(totalOutstanding)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Gồm phí chưa thanh toán & trả góp</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Hóa đơn quá hạn nộp</div>
          <div className="text-lg font-bold text-amber-800 mt-1 font-mono">{overdueCount} căn hộ</div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">Cần gửi thông báo nhắc nợ lần 2</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[17px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã HĐ, phòng, chủ hộ..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 text-slate-800"
            />
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 font-medium cursor-pointer"
          >
            <option value="ALL">Tất cả các tháng</option>
            <option value="10/2025">Kỳ T10/2025</option>
            <option value="09/2025">Kỳ T09/2025</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 font-medium cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="PARTIAL">Nộp một phần</option>
            <option value="UNPAID">Chưa đóng</option>
            <option value="OVERDUE">Quá hạn nộp</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Hiển thị <strong>{filteredInvoices.length}</strong> hóa đơn
        </div>
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400 text-xs">
          Đang nạp danh sách hóa đơn từ hệ thống...
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-3.5">Mã hóa đơn</th>
                  <th className="py-2.5 px-3.5">Căn hộ</th>
                  <th className="py-2.5 px-3.5">Chủ hộ</th>
                  <th className="py-2.5 px-3.5">Kỳ phí</th>
                  <th className="py-2.5 px-3.5 text-right">Tổng phải nộp</th>
                  <th className="py-2.5 px-3.5 text-right">Đã nộp</th>
                  <th className="py-2.5 px-3.5 text-right">Còn nợ</th>
                  <th className="py-2.5 px-3.5">Trạng thái</th>
                  <th className="py-2.5 px-3.5">Hạn đóng</th>
                  <th className="py-2.5 px-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const remaining = inv.totalAmount - (inv.paidAmount || 0);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 font-mono">
                        {inv.invoiceCode}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold text-blue-700 font-mono">
                        <Link href={`/can-ho/${inv.roomNumber}`} className="hover:underline">
                          {inv.roomNumber}
                        </Link>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-800">{inv.householdHead}</td>
                      <td className="py-2.5 px-3.5 text-slate-500 font-mono">{inv.billingMonth}</td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-slate-900 font-mono">
                        {formatCurrency(inv.totalAmount)}
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-emerald-700 font-mono">
                        {formatCurrency(inv.paidAmount || 0)}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono font-semibold">
                        <span className={remaining > 0 ? 'text-red-600' : 'text-slate-400'}>
                          {formatCurrency(remaining)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5">{getStatusBadge(inv.status)}</td>
                      <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px]">{inv.dueDate}</td>
                      <td className="py-2.5 px-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setViewingInvoice(inv)}
                          className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          Chi tiết
                        </button>
                        {remaining > 0 && (
                          <button
                            onClick={() => setPayingInvoice(inv)}
                            className="px-2 py-1 text-[11px] font-semibold rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                          >
                            Thu tiền
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Extracted Modals */}
      <PaymentModal
        invoice={payingInvoice}
        isOpen={Boolean(payingInvoice)}
        onClose={() => setPayingInvoice(null)}
        onConfirm={handleConfirmPayment}
      />

      <InvoiceDetailModal
        invoice={viewingInvoice}
        isOpen={Boolean(viewingInvoice)}
        onClose={() => setViewingInvoice(null)}
        onOpenPayment={(inv) => setPayingInvoice(inv)}
      />
    </div>
  );
}
