import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { AuthProvider, useAuth, DEMO_PROFILES } from '../AuthContext';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext & Quick Role Switcher', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default ADMIN profile', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => {
      expect(result.current.currentProfile.role).toBe('ADMIN');
      expect(result.current.hasRole('ADMIN')).toBe(true);
      expect(result.current.hasRole('RESIDENT')).toBe(false);
    });
  });


  it('switches to MANAGER role and updates profile', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.switchDemoRole('manager1');
    });

    expect(result.current.currentProfile.role).toBe('MANAGER');
    expect(result.current.role).toBe('MANAGER');
    expect(result.current.hasRole('MANAGER')).toBe(true);
    expect(result.current.hasRole('ADMIN')).toBe(false);
    expect(localStorage.getItem('residenthub_token')).toBeTruthy();
  });

  it('switches to RESIDENT role and updates claims', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.switchDemoRole('resident1205');
    });

    expect(result.current.currentProfile.role).toBe('RESIDENT');
    expect(result.current.hasRole('RESIDENT')).toBe(true);
    expect(result.current.hasRole('ADMIN', 'MANAGER')).toBe(false);
  });
});
