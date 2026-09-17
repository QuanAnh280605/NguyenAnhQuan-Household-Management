import { httpClient } from './httpClient';
import { mockInvoicesList } from '@/lib/mock-data';
import { Invoice } from '@/types';

export const billingApi = {
  async getInvoices(month?: string, status?: string): Promise<{ data: Invoice[]; isFallback: boolean }> {
    const query = new URLSearchParams();
    if (month && month !== 'ALL') query.append('month', month);
    if (status && status !== 'ALL') query.append('status', status);

    const qs = query.toString();
    const endpoint = `/billing/invoices${qs ? `?${qs}` : ''}`;
    const res = await httpClient.get<Invoice[]>(endpoint);

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return { data: res.data, isFallback: false };
    }

    // Graceful fallback
    let filtered = [...mockInvoicesList];
    if (month && month !== 'ALL') {
      filtered = filtered.filter(inv => inv.billingMonth === month);
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter(inv => inv.status === status);
    }

    return { data: filtered, isFallback: true };
  },

  async createPaySession(invoiceId: string): Promise<{ success: boolean; data?: unknown; message?: string }> {
    const res = await httpClient.post(`/billing/invoices/${invoiceId}/pay-session`);
    return {
      success: res.success,
      data: res.data,
      message: res.error?.detail,
    };
  },
};
