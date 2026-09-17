'use client';

import React, { useState } from 'react';
import { Invoice } from '@/types';
import { formatCurrency } from '@/utils';

interface PaymentModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (invoiceId: string, amount: number, method: string, txnCode: string) => void;
}

function PaymentForm({
  invoice,
  onClose,
  onConfirm,
}: {
  invoice: Invoice;
  onClose: () => void;
  onConfirm: (invoiceId: string, amount: number, method: string, txnCode: string) => void;
}) {
  const remainingBalance = invoice.totalAmount - (invoice.paidAmount || 0);
  const [paymentAmount, setPaymentAmount] = useState<number>(remainingBalance);
  const [paymentMethod, setPaymentMethod] = useState<string>('VietQR Transfer');
  const [transactionCode, setTransactionCode] = useState<string>(
    `TX-${invoice.id.replace('inv-', '')}-${invoice.roomNumber}`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(invoice.id, Number(paymentAmount), paymentMethod, transactionCode);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
      <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
        <div className="flex justify-between text-slate-500">
          <span>Invoice / Unit:</span>
          <span className="font-bold text-slate-900">{invoice.invoiceCode} ({invoice.roomNumber})</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Household Head:</span>
          <span className="font-semibold text-slate-800">{invoice.householdHead}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Total Invoiced:</span>
          <span className="font-mono text-slate-900">{formatCurrency(invoice.totalAmount)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Previously Paid:</span>
          <span className="font-mono text-emerald-700">{formatCurrency(invoice.paidAmount || 0)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-xs">
          <span className="text-red-700">Remaining Due:</span>
          <span className="text-red-700 font-mono">{formatCurrency(remainingBalance)}</span>
        </div>
      </div>

      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          Settlement Amount This Receipt (VND) *
        </label>
        <input
          type="number"
          min={1000}
          max={remainingBalance}
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(Number(e.target.value))}
          required
          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-blue-700 focus:outline-none font-mono font-bold text-slate-900"
        />
      </div>

      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          Payment Method *
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-blue-700 focus:outline-none text-slate-800"
        >
          <option value="VietQR Transfer">VietQR / Instant Bank Transfer</option>
          <option value="Cash">Cash at Building Management Office</option>
          <option value="VNPay Gateway">VNPay Payment Gateway</option>
          <option value="MoMo Wallet">MoMo E-Wallet</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          Bank Transaction Reference / Receipt No.
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
          onClick={onClose}
          className="px-3.5 py-1.5 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3.5 py-1.5 text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 rounded shadow-sm"
        >
          Confirm & Issue Receipt
        </button>
      </div>
    </form>
  );
}

export default function PaymentModal({ invoice, isOpen, onClose, onConfirm }: PaymentModalProps) {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-700 text-[20px]">payments</span>
            <h3 className="font-bold text-sm text-slate-900">Record Fee Settlement</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <PaymentForm
          key={invoice.id}
          invoice={invoice}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  );
}
