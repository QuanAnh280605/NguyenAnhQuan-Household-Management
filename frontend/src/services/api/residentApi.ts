import { httpClient } from './httpClient';
import { mockApartmentA1205 } from '@/lib/mock-data';
import { Resident } from '@/types';

const INITIAL_FALLBACK_RESIDENTS: Resident[] = [
  ...mockApartmentA1205.residents,
  {
    id: 'res-5',
    fullName: 'Phạm Thị Lan',
    citizenId: '001188009988',
    dateOfBirth: '18/04/1986',
    gender: 'Nữ',
    phone: '0903 888 777',
    apartmentId: 'apt-a1206',
    roomNumber: 'A-1206',
    relationship: 'Chủ hộ',
    residentStatus: 'PERMANENT',
    isHead: true,
    moveInDate: '02/02/2023',
  },
  {
    id: 'res-6',
    fullName: 'Nguyễn Tiến Dũng',
    citizenId: '001085002233',
    dateOfBirth: '30/12/1982',
    gender: 'Nam',
    phone: '0977 444 333',
    apartmentId: 'apt-a1207',
    roomNumber: 'A-1207',
    relationship: 'Chủ hộ (Thuê)',
    residentStatus: 'TEMPORARY',
    isHead: true,
    moveInDate: '20/03/2023',
  },
];

export const residentApi = {
  async getResidents(search?: string, status?: string): Promise<{ data: Resident[]; isFallback: boolean }> {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (status && status !== 'ALL') query.append('status', status);

    const qs = query.toString();
    const endpoint = `/residents${qs ? `?${qs}` : ''}`;
    const res = await httpClient.get<Resident[]>(endpoint);

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return { data: res.data, isFallback: false };
    }

    // Graceful fallback
    let filtered = [...INITIAL_FALLBACK_RESIDENTS];
    if (status && status !== 'ALL') {
      filtered = filtered.filter(r => r.residentStatus === status);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.fullName.toLowerCase().includes(s) ||
        r.roomNumber.toLowerCase().includes(s) ||
        r.citizenId.includes(s) ||
        r.phone.includes(s)
      );
    }

    return { data: filtered, isFallback: true };
  },

  async registerResident(payload: unknown): Promise<{ success: boolean; data?: unknown; message?: string }> {
    const res = await httpClient.post('/residents', payload);
    return {
      success: res.success,
      data: res.data,
      message: res.error?.detail || 'Đăng ký cư dân thành công',
    };
  },
};
