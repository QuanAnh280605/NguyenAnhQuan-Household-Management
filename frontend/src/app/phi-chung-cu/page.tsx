'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockInvoicesList } from '@/lib/mock-data';
import { Invoice, InvoiceStatus } from '@/types';

export default function PhiChungCuPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoicesList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Chuyển khoản VietQR');
  const [transactionCode, setTransactionCode] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filtered list
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.householdHead.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMonth =
      selectedMonth === 'ALL' || inv.billingMonth === selectedMonth;

    const matchesStatus =
      statusFilter === 'ALL' || inv.status === statusFilter;

    return matchesSearch && matchesMonth && matchesStatus;
  });

  // Dynamic KPIs
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalOutstanding = totalBilled - totalCollected;
  const overdueCount = invoices.filter((inv) => inv.status === 'OVERDUE').length;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Open payment modal
  const handleOpenPayment = (inv: Invoice) => {
    setPayingInvoice(inv);
    const remaining = inv.totalAmount - (inv.paidAmount || 0);
    setPaymentAmount(remaining);
    setTransactionCode(`TX-${inv.id.replace('inv-', '')}-${inv.roomNumber}`);
  };

  // Submit payment
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    const newPaidAmount = (payingInvoice.paidAmount || 0) + Number(paymentAmount);
    let newStatus: InvoiceStatus = payingInvoice.status;

    if (newPaidAmount >= payingInvoice.totalAmount) {
      newStatus = 'PAID';
    } else if (newPaidAmount > 0) {
      newStatus = 'PARTIAL';
    }

    const updatedInvoices = invoices.map((inv) =>
      inv.id === payingInvoice.id
        ? {
            ...inv,
            paidAmount: Math.min(newPaidAmount, inv.totalAmount),
            status: newStatus,
            paymentMethod: paymentMethod,
            paymentDate: new Date().toLocaleDateString('vi-VN'),
          }
        : inv
    );

    setInvoices(updatedInvoices);
    setSuccessToast(`Đã ghi nhận thanh toán ${Number(paymentAmount).toLocaleString('vi-VN')} đ cho căn ${payingInvoice.roomNumber}`);
    setPayingInvoice(null);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('vi-VN') + ' đ';
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Đã nộp đủ
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Thu 1 phần
          </span>
        );
      case 'UNPAID':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Chưa nộp
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            Quá hạn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Quản Lý Phí & Hóa Đơn Chung Cư
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
              Kỳ T10/2025
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Bảng kê phí quản lý, điện nước, trông giữ xe và biên lai thanh toán cư dân.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setSuccessToast('Đã đồng bộ chỉ số điện nước tự động thành công cho 320 căn!');
              setTimeout(() => setSuccessToast(null), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">electric_meter</span>
            <span>Chốt số điện nước</span>
          </button>
          <button
            onClick={() => {
              setSuccessToast('Đã phát hành thông báo thu phí tháng 11/2025 tới toàn bộ cư dân!');
              setTimeout(() => setSuccessToast(null), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-700 text-white shadow-sm hover:bg-blue-800 text-xs font-semibold transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">receipt_long</span>
            <span>Phát hành hóa đơn</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">DOANH THU KỲ T10</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
              {(totalBilled / 1000000).toFixed(1)} tr
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{invoices.length} hóa đơn phát hành</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-blue-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ĐÃ THỰC THU</span>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">
              {(totalCollected / 1000000).toFixed(1)} tr
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Đạt tỷ lệ {collectionRate}%</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CÔNG NỢ CÒN TỒN</span>
            <div className="text-xl font-bold text-amber-700 font-mono mt-0.5">
              {(totalOutstanding / 1000000).toFixed(1)} tr
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {invoices.filter((i) => i.status !== 'PAID').length} căn chưa thu đủ
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">HÓA ĐƠN QUÁ HẠN</span>
            <div className="text-xl font-bold text-red-600 font-mono mt-0.5">
              {overdueCount} căn
            </div>
            <p className="text-[11px] text-red-600 font-medium mt-0.5">Cần gửi đôn đốc lần 2</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">priority_high</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div className="relative flex-1 w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[17px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo số căn (A-1205), tên chủ hộ, mã phiếu..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Lọc theo kỳ hóa đơn"
              className="px-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 font-medium cursor-pointer"
            >
              <option value="ALL">Tất cả kỳ phí</option>
              <option value="Tháng 10/2025">Tháng 10/2025</option>
              <option value="Tháng 09/2025">Tháng 09/2025</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-100 pt-2 text-xs">
          {[
            { id: 'ALL', label: 'Tất cả hóa đơn' },
            { id: 'UNPAID', label: 'Chưa nộp' },
            { id: 'PARTIAL', label: 'Nộp 1 phần' },
            { id: 'PAID', label: 'Đã hoàn tất' },
            { id: 'OVERDUE', label: 'Quá hạn' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices High-Density Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-3.5">Mã phiếu</th>
                <th className="py-2.5 px-3.5">Căn hộ</th>
                <th className="py-2.5 px-3.5">Chủ hộ</th>
                <th className="py-2.5 px-3.5">Kỳ phí</th>
                <th className="py-2.5 px-3.5 text-right">Phí QL</th>
                <th className="py-2.5 px-3.5 text-right">Điện & Nước</th>
                <th className="py-2.5 px-3.5 text-right">Gửi xe</th>
                <th className="py-2.5 px-3.5 text-right font-bold">Tổng nộp</th>
                <th className="py-2.5 px-3.5 text-center">Trạng thái</th>
                <th className="py-2.5 px-3.5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                    Không tìm thấy bản ghi hóa đơn nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const remaining = inv.totalAmount - (inv.paidAmount || 0);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3.5 font-mono font-bold text-blue-700">
                        {inv.invoiceCode}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold font-mono">
                        <Link
                          href={`/can-ho/${inv.roomNumber}`}
                          className="text-slate-900 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
                        >
                          {inv.roomNumber}
                        </Link>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-800 font-medium">{inv.householdHead}</td>
                      <td className="py-2.5 px-3.5 text-slate-500">
                        {inv.billingMonth}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-600">
                        {inv.managementFee.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-600">
                        {(inv.waterFee + inv.electricityFee).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-600">
                        {inv.vehicleFee.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-2.5 px-3.5 text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(inv.totalAmount)}
                        </div>
                        {inv.status === 'PARTIAL' && (
                          <div className="text-[10px] text-amber-700 font-medium">
                            Còn nợ: {formatCurrency(remaining)}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5 text-center">{getStatusBadge(inv.status)}</td>
                      <td className="py-2.5 px-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {inv.status !== 'PAID' && (
                            <button
                              onClick={() => handleOpenPayment(inv)}
                              className="px-2 py-1 text-[11px] font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1 shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[13px]">point_of_sale</span>
                              Thu tiền
                            </button>
                          )}
                          <button
                            onClick={() => setViewingInvoice(inv)}
                            title="Xem chi tiết hóa đơn"
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px]">visibility</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Ghi nhận thanh toán */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[22px]">payments</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Ghi Nhận Thu Tiền Dịch Vụ</h3>
                  <p className="text-[11px] text-slate-500">Mã phiếu: {payingInvoice.invoiceCode}</p>
                </div>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="p-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Căn hộ:</span>
                  <span className="font-bold text-slate-900">{payingInvoice.roomNumber} ({payingInvoice.householdHead})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tổng hóa đơn:</span>
                  <span className="font-bold text-slate-900 font-mono">{formatCurrency(payingInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Đã nộp trước đó:</span>
                  <span className="font-medium text-emerald-700 font-mono">{formatCurrency(payingInvoice.paidAmount || 0)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-xs">
                  <span className="text-red-700">Còn phải nộp:</span>
                  <span className="text-red-700 font-mono">{formatCurrency(payingInvoice.totalAmount - (payingInvoice.paidAmount || 0))}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Số tiền thực thu lần này (VNĐ) *
                </label>
                <input
                  type="number"
                  min={1000}
                  max={payingInvoice.totalAmount - (payingInvoice.paidAmount || 0)}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-blue-700 focus:outline-none font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hình thức thanh toán *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-blue-700 focus:outline-none text-slate-800"
                >
                  <option value="Chuyển khoản VietQR">Chuyển khoản VietQR / Ngân hàng</option>
                  <option value="Tiền mặt">Tiền mặt tại văn phòng BQL</option>
                  <option value="Cổng VNPay">Cổng thanh toán VNPay</option>
                  <option value="Ví MoMo">Ví điện tử MoMo</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mã giao dịch ngân hàng / Số biên lai
                </label>
                <input
                  type="text"
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-blue-700 focus:outline-none font-mono text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-3.5 py-1.5 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 rounded shadow-sm"
                >
                  Xác nhận & Cấp biên lai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chi tiết hóa đơn */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Phiếu Báo Thu Phí Dịch Vụ</span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">{viewingInvoice.invoiceCode}</h3>
                <p className="text-xs text-slate-500">Kỳ tính phí: {viewingInvoice.billingMonth}</p>
              </div>
              <button
                onClick={() => setViewingInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded border border-slate-200">
                <div>
                  <span className="text-slate-400">Căn hộ:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{viewingInvoice.roomNumber}</div>
                </div>
                <div>
                  <span className="text-slate-400">Chủ hộ:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{viewingInvoice.householdHead}</div>
                </div>
                <div>
                  <span className="text-slate-400">Hạn thanh toán:</span>
                  <div className="font-bold text-red-600 mt-0.5">{viewingInvoice.dueDate}</div>
                </div>
                <div>
                  <span className="text-slate-400">Trạng thái:</span>
                  <div className="mt-0.5">{getStatusBadge(viewingInvoice.status)}</div>
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
                      <td className="py-2 px-3 text-right font-mono">{viewingInvoice.managementFee.toLocaleString('vi-VN')} đ</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-800">Nước sinh hoạt</td>
                      <td className="py-2 px-3 text-right text-slate-400">Đồng hồ nước</td>
                      <td className="py-2 px-3 text-right font-mono">{viewingInvoice.waterFee.toLocaleString('vi-VN')} đ</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-800">Điện sinh hoạt</td>
                      <td className="py-2 px-3 text-right text-slate-400">Đồng hồ điện</td>
                      <td className="py-2 px-3 text-right font-mono">{viewingInvoice.electricityFee.toLocaleString('vi-VN')} đ</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-800">Trông giữ phương tiện</td>
                      <td className="py-2 px-3 text-right text-slate-400">Thẻ xe</td>
                      <td className="py-2 px-3 text-right font-mono">{viewingInvoice.vehicleFee.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={2} className="py-2.5 px-3 text-right">TỔNG CỘNG:</td>
                      <td className="py-2.5 px-3 text-right font-mono text-blue-800 text-sm">{formatCurrency(viewingInvoice.totalAmount)}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="py-1.5 px-3 text-right text-emerald-700 text-xs">Đã thanh toán:</td>
                      <td className="py-1.5 px-3 text-right font-mono text-emerald-700 text-xs">{formatCurrency(viewingInvoice.paidAmount || 0)}</td>
                    </tr>
                    {viewingInvoice.totalAmount - (viewingInvoice.paidAmount || 0) > 0 && (
                      <tr className="text-red-700">
                        <td colSpan={2} className="py-1.5 px-3 text-right font-bold text-xs">CÒN NỢ:</td>
                        <td className="py-1.5 px-3 text-right font-mono font-bold text-xs">{formatCurrency(viewingInvoice.totalAmount - (viewingInvoice.paidAmount || 0))}</td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>

              {viewingInvoice.paymentMethod && (
                <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200 text-xs flex items-center justify-between">
                  <span>Phương thức: <strong>{viewingInvoice.paymentMethod}</strong></span>
                  <span>Ngày nộp: <strong>{viewingInvoice.paymentDate}</strong></span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => {
                    setSuccessToast('Đang kết nối máy in nhiệt cấp biên lai...');
                    setTimeout(() => setSuccessToast(null), 3000);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  In phiếu thu
                </button>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 rounded transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
