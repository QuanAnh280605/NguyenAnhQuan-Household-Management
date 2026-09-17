import { httpClient } from './httpClient';
import { mockApartmentsList } from '@/lib/mock-data';
import { Apartment } from '@/types';

export interface ApartmentFilterParams {
  building?: string;
  status?: string;
  search?: string;
}

export const apartmentApi = {
  async getApartments(params?: ApartmentFilterParams): Promise<{ data: Apartment[]; isFallback: boolean }> {
    const query = new URLSearchParams();
    if (params?.building && params.building !== 'ALL') query.append('building', params.building);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString();
    const endpoint = `/apartments${qs ? `?${qs}` : ''}`;
    const res = await httpClient.get<Apartment[]>(endpoint);

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return { data: res.data, isFallback: false };
    }

    // Graceful fallback for offline dev/demo
    let filtered = [...mockApartmentsList];
    if (params?.building && params.building !== 'ALL') {
      filtered = filtered.filter(a => a.building.includes(params.building!));
    }
    if (params?.status && params.status !== 'ALL') {
      filtered = filtered.filter(a => a.status === params.status);
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.roomNumber.toLowerCase().includes(s) || 
        a.ownerName.toLowerCase().includes(s) ||
        a.ownerPhone.includes(s)
      );
    }

    return { data: filtered, isFallback: true };
  },

  async createApartment(payload: unknown): Promise<{ success: boolean; data?: unknown; message?: string }> {
    const res = await httpClient.post('/apartments', payload);
    return {
      success: res.success,
      data: res.data,
      message: res.error?.detail || 'Thực hiện thành công',
    };
  },
};
