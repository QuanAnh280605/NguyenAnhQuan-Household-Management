import { httpClient } from './httpClient';
import { mockFeedbacks } from '@/lib/mock-data';
import { Feedback } from '@/types';

export const feedbackApi = {
  async getFeedbacks(status?: string, category?: string): Promise<{ data: Feedback[]; isFallback: boolean }> {
    const query = new URLSearchParams();
    if (status && status !== 'ALL') query.append('status', status);
    if (category && category !== 'ALL') query.append('category', category);

    const qs = query.toString();
    const endpoint = `/feedbacks${qs ? `?${qs}` : ''}`;
    const res = await httpClient.get<Feedback[]>(endpoint);

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return { data: res.data, isFallback: false };
    }

    let filtered = [...mockFeedbacks];
    if (status && status !== 'ALL') {
      filtered = filtered.filter(f => f.status === status);
    }
    return { data: filtered, isFallback: true };
  },

  async createFeedback(payload: unknown): Promise<{ success: boolean; data?: unknown; message?: string }> {
    const res = await httpClient.post('/feedbacks', payload);
    return {
      success: res.success,
      data: res.data,
      message: res.error?.detail || 'Gửi phản ánh thành công',
    };
  },

  async updateStatus(feedbackId: string, status: string, message: string): Promise<{ success: boolean; data?: unknown; message?: string }> {
    const res = await httpClient.patch(`/feedbacks/${feedbackId}/status`, { status, message });
    return {
      success: res.success,
      data: res.data,
      message: res.error?.detail || 'Cập nhật tiến độ thành công',
    };
  },
};
