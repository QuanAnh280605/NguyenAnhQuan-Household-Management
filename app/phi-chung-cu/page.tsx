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

  // Calculate dynamic KPIs
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
    setTransactionCode(`TX-${Date.now().toString().slice(-6)}`);
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
    setSuccessToast(`Ghi nhận thanh toán ${Number(paymentAmount).toLocaleString('vi-VN')} đ cho căn hộ ${payingInvoice.roomNumber} thành công!`);
    setPayingInvoice(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('vi-VN') + ' đ';
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Đã thanh toán
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
            <span className="material-symbols-outlined text-[14px]">timelapse</span>
            Thu 1 phần
          </span>
        );
      case 'UNPAID':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            <span className="material-symbols-outlined text-[14px]">pending</span>
            Chưa nộp
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 animate-pulse">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            Quá hạn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-bounce">
          <span className="material-symbols-outlined text-[20px]">verified</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Phí Chung Cư & Thu Phí Dịch Vụ
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">
              Kỳ thu tự động
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Quản lý bảng kê hóa đơn hàng tháng, theo dõi công nợ cư dân và ghi nhận thu tiền đa kênh.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              alert('Hệ thống tự động đồng bộ và chốt chỉ số công tơ điện nước cho 320 căn hộ.');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg border border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">electric_meter</span>
            <span>Chốt số điện nước</span>
          </button>
          <button
            onClick={() => {
              alert('Đã sinh hóa đơn tự động tháng mới cho toàn bộ các căn hộ đang có người ở.');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary transition-colors font-label-md text-label-md font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Phát hành hóa đơn</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between text-outline">
            <span className="text-xs uppercase font-semibold">Tổng doanh thu kỳ</span>
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          </div>
          <div className="font-metric-display text-2xl font-bold text-on-surface mt-1">
            {(totalBilled / 1000000).toFixed(2)} triệu
          </div>
          <p className="text-xs text-on-surface-variant mt-1">{invoices.length} căn hộ phát hành</p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs uppercase font-semibold">Đã thực thu</span>
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <div className="font-metric-display text-2xl font-bold text-emerald-700 mt-1">
            {(totalCollected / 1000000).toFixed(2)} triệu
          </div>
          <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${collectionRate}%` }}></div>
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">Tỷ lệ thu: {collectionRate}%</p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs uppercase font-semibold">Công nợ còn tồn</span>
            <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          </div>
          <div className="font-metric-display text-2xl font-bold text-rose-700 mt-1">
            {(totalOutstanding / 1000000).toFixed(2)} triệu
          </div>
          <p className="text-xs text-rose-700 font-semibold mt-1">
            {invoices.filter((i) => i.status !== 'PAID').length} căn chưa thu đủ
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs uppercase font-semibold">Hóa đơn quá hạn</span>
            <span className="material-symbols-outlined text-[20px]">priority_high</span>
          </div>
          <div className="font-metric-display text-2xl font-bold text-amber-700 mt-1">
            {overdueCount} căn
          </div>
          <p className="text-xs text-amber-700 font-semibold mt-1">Cần gửi thông báo nhắc nợ</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo phòng (A-1205), tên chủ hộ, mã hóa đơn..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Lọc theo kỳ hóa đơn"
              className="px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              <option value="ALL">Tất cả các kỳ</option>
              <option value="Tháng 10/2025">Tháng 10/2025</option>
              <option value="Tháng 11/2025">Tháng 11/2025</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-outline-variant/15 pt-3">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'UNPAID', label: 'Chưa thanh toán' },
            { id: 'PARTIAL', label: 'Thu 1 phần' },
            { id: 'PAID', label: 'Đã thanh toán' },
            { id: 'OVERDUE', label: 'Quá hạn' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/20 text-xs font-semibold uppercase tracking-wider text-outline">
                <th className="py-3.5 px-4">Mã hóa đơn</th>
                <th className="py-3.5 px-4">Căn hộ</th>
                <th className="py-3.5 px-4">Chủ hộ</th>
                <th className="py-3.5 px-4">Kỳ phí</th>
                <th className="py-3.5 px-4 text-right">Phí QL</th>
                <th className="py-3.5 px-4 text-right">Điện & Nước</th>
                <th className="py-3.5 px-4 text-right">Phí gửi xe</th>
                <th className="py-3.5 px-4 text-right font-bold">Tổng nộp</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-on-surface-variant text-sm">
                    Không tìm thấy hóa đơn nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const remaining = inv.totalAmount - (inv.paidAmount || 0);
                  return (
                    <tr key={inv.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-primary">
                        {inv.invoiceCode}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        <Link
                          href={`/can-ho/${inv.roomNumber}`}
                          className="text-on-surface hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px] text-outline">apartment</span>
                          {inv.roomNumber}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-on-surface font-medium">{inv.householdHead}</td>
                      <td className="py-3.5 px-4 text-xs text-on-surface-variant font-medium">
                        {inv.billingMonth}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs">
                        {inv.managementFee.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs">
                        {(inv.waterFee + inv.electricityFee).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs">
                        {inv.vehicleFee.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-bold text-sm text-on-surface">
                          {formatCurrency(inv.totalAmount)}
                        </div>
                        {inv.status === 'PARTIAL' && (
                          <div className="text-[11px] text-rose-600 font-medium">
                            Còn nợ: {formatCurrency(remaining)}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">{getStatusBadge(inv.status)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {inv.status !== 'PAID' && (
                            <button
                              onClick={() => handleOpenPayment(inv)}
                              title="Ghi nhận thu tiền"
                              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1 shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[14px]">point_of_sale</span>
                              Thu tiền
                            </button>
                          )}
                          <button
                            onClick={() => setViewingInvoice(inv)}
                            title="Xem chi tiết hóa đơn"
                            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between bg-primary-container/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">payments</span>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Ghi Nhận Thu Tiền Dịch Vụ</h3>
                  <p className="text-xs text-on-surface-variant">Hóa đơn {payingInvoice.invoiceCode}</p>
                </div>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="p-5 space-y-4">
              <div className="bg-surface-container-low p-3 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-outline">Căn hộ:</span>
                  <span className="font-bold text-on-surface">{payingInvoice.roomNumber} ({payingInvoice.householdHead})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Tổng hóa đơn:</span>
                  <span className="font-bold text-on-surface">{formatCurrency(payingInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Đã nộp trước đó:</span>
                  <span className="font-medium text-emerald-700">{formatCurrency(payingInvoice.paidAmount || 0)}</span>
                </div>
                <div className="flex justify-between border-t border-outline-variant/20 pt-1.5 font-bold text-sm">
                  <span className="text-rose-700">Còn phải nộp:</span>
                  <span className="text-rose-700">{formatCurrency(payingInvoice.totalAmount - (payingInvoice.paidAmount || 0))}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Số tiền thực thu lần này (VNĐ) *
                </label>
                <input
                  type="number"
                  min={1000}
                  max={payingInvoice.totalAmount - (payingInvoice.paidAmount || 0)}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none font-mono font-bold text-on-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Hình thức thanh toán *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-on-surface"
                >
                  <option value="Chuyển khoản VietQR">Chuyển khoản VietQR / Quét mã ngân hàng</option>
                  <option value="Tiền mặt">Tiền mặt tại quầy BQL</option>
                  <option value="VNPay QR">Cổng thanh toán VNPay</option>
                  <option value="Ví MoMo">Ví điện tử MoMo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Mã tham chiếu / Biên lai giao dịch
                </label>
                <input
                  type="text"
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none font-mono text-on-surface"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary-container text-white hover:bg-primary rounded-lg shadow-sm transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-outline-variant/20 flex items-start justify-between bg-surface-container-low/50">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-outline font-bold">Phiếu Báo Thu Phí Dịch Vụ</span>
                <h3 className="font-bold text-lg text-on-surface mt-0.5">{viewingInvoice.invoiceCode}</h3>
                <p className="text-xs text-on-surface-variant">Kỳ tính phí: {viewingInvoice.billingMonth}</p>
              </div>
              <button
                onClick={() => setViewingInvoice(null)}
                className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-xl text-xs">
                <div>
                  <span className="text-outline">Căn hộ:</span>
                  <div className="font-bold text-on-surface mt-0.5">{viewingInvoice.roomNumber}</div>
                </div>
                <div>
                  <span className="text-outline">Chủ hộ / Đại diện:</span>
                  <div className="font-bold text-on-surface mt-0.5">{viewingInvoice.householdHead}</div>
                </div>
                <div>
                  <span className="text-outline">Hạn thanh toán:</span>
                  <div className="font-bold text-rose-700 mt-0.5">{viewingInvoice.dueDate}</div>
                </div>
                <div>
                  <span className="text-outline">Trạng thái:</span>
                  <div className="mt-0.5">{getStatusBadge(viewingInvoice.status)}</div>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="border border-outline-variant/20 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-surface-container-low/80 font-semibold text-outline border-b border-outline-variant/20">
                    <tr>
                      <th className="py-2.5 px-3 text-left">Hạng mục dịch vụ</th>
                      <th className="py-2.5 px-3 text-right">Đơn giá / Định mức</th>
                      <th className="py-2.5 px-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 font-medium">
                    <tr>
                      <td className="py-2.5 px-3">Phí quản lý vận hành tòa nhà</td>
                      <td className="py-2.5 px-3 text-right text-outline">Theo diện tích m²</td>
                      <td className="py-2.5 px-3 text-right font-mono">{viewingInvoice.managementFee.toLocaleString('vi-VN')} đ</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3">Tiền nước sinh hoạt</td>
                      <td className="py-2.5 px-3 text-right text-outline">Theo đồng hồ nước</td>
                      <td className="py-2.5 px-3 text-right font-mono">{viewingInvoice.waterFee.toLocaleString('vi-VN')} đ</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3">Tiền điện sinh hoạt</td>
                      <td className="py-2.5 px-3 text-right text-outline">Lũy tiến EVN</td>
                      <td className="py-2.5 px-3 text-right font-mono">{viewingInvoice.electricityFee.toLocaleString('vi-VN')} đ</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3">Phí trông giữ phương tiện (Ô tô & Xe máy)</td>
                      <td className="py-2.5 px-3 text-right text-outline">Thẻ xe đăng ký</td>
                      <td className="py-2.5 px-3 text-right font-mono">{viewingInvoice.vehicleFee.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-surface-container-low/50 font-bold border-t border-outline-variant/20">
                    <tr>
                      <td colSpan={2} className="py-3 px-3 text-right">TỔNG CỘNG PHẢI THU:</td>
                      <td className="py-3 px-3 text-right font-mono text-primary text-sm">{formatCurrency(viewingInvoice.totalAmount)}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="py-2 px-3 text-right text-emerald-700 text-xs font-medium">Đã thanh toán:</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700 text-xs font-medium">{formatCurrency(viewingInvoice.paidAmount || 0)}</td>
                    </tr>
                    {viewingInvoice.totalAmount - (viewingInvoice.paidAmount || 0) > 0 && (
                      <tr className="text-rose-700">
                        <td colSpan={2} className="py-2 px-3 text-right font-bold text-xs">CÒN PHẢI NỘP:</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-xs">{formatCurrency(viewingInvoice.totalAmount - (viewingInvoice.paidAmount || 0))}</td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>

              {viewingInvoice.paymentMethod && (
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
                  <span>Phương thức: <strong>{viewingInvoice.paymentMethod}</strong></span>
                  <span>Ngày nộp: <strong>{viewingInvoice.paymentDate}</strong></span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  onClick={() => alert('Đang xuất phiếu hóa đơn sang định dạng PDF / In nhiệt 80mm...')}
                  className="px-3 py-2 text-xs font-semibold bg-surface-container-low hover:bg-surface-container-high rounded-lg text-on-surface transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  In phiếu thu
                </button>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-container rounded-lg transition-colors"
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
