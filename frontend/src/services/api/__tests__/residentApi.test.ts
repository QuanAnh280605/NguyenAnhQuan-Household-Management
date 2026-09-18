import { describe, it, expect, vi } from 'vitest';
import { residentApi } from '../residentApi';
import { httpClient } from '../httpClient';
import { Resident } from '@/types';

describe('residentApi service', () => {
  it('falls back to mock data when backend API is unreachable', async () => {
    // Spy on httpClient.get to simulate backend failure
    vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      success: false,
      data: null as unknown as Resident[],
      timestamp: new Date().toISOString(),
      error: { status: 503, detail: 'Backend unreachable' },
    });

    const result = await residentApi.getResidents();
    expect(result.isFallback).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('filters fallback residents by status when status filter is applied', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      success: false,
      data: null as unknown as Resident[],
      timestamp: new Date().toISOString(),
    });

    const result = await residentApi.getResidents(undefined, 'TEMPORARY');
    expect(result.isFallback).toBe(true);
    expect(result.data.every((r) => r.residentStatus === 'TEMPORARY')).toBe(true);
  });

  it('filters fallback residents by search term (citizen ID, phone, or name)', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      success: false,
      data: null as unknown as Resident[],
      timestamp: new Date().toISOString(),
    });

    const result = await residentApi.getResidents('Pham Thi Lan');
    expect(result.isFallback).toBe(true);
    expect(result.data.length).toBe(1);
    expect(result.data[0].fullName).toBe('Pham Thi Lan');
  });

  it('returns live API data when backend responds successfully', async () => {
    const mockLiveResidents = [
      {
        id: 'res-live-1',
        fullName: 'Live Resident',
        citizenId: '001099999999',
        dateOfBirth: '01/01/1990',
        gender: 'Male' as const,
        phone: '0900000000',
        apartmentId: 'apt-live-1',
        roomNumber: 'A-0101',
        relationship: 'Head',
        residentStatus: 'PERMANENT' as const,
        isHead: true,
        moveInDate: '01/01/2026',
      },
    ];

    vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      success: true,
      data: mockLiveResidents,
      timestamp: new Date().toISOString(),
    });

    const result = await residentApi.getResidents();
    expect(result.isFallback).toBe(false);
    expect(result.data).toEqual(mockLiveResidents);
  });
});
