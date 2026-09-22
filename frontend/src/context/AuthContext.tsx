'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, AuthUser } from '@/services/api/authApi';

export interface DemoProfile {
  username: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'RESIDENT';
  label: string;
  badgeClass: string;
  description: string;
  initials: string;
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    username: 'admin',
    role: 'ADMIN',
    label: 'Quản Trị Viên Hệ Thống',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    description: 'Toàn quyền cấu hình, di chuyển dữ liệu và phân quyền bảo mật',
    initials: 'AD',
  },
  {
    username: 'manager1',
    role: 'MANAGER',
    label: 'Trần Văn Bình (Trưởng BQL)',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    description: 'Chuyển nhượng sổ căn hộ, chạy Saga chốt phí tháng, quyết toán thu',
    initials: 'TB',
  },
  {
    username: 'tech1',
    role: 'TECHNICIAN',
    label: 'Nguyễn Kỹ Thuật (Kỹ sư BQL)',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    description: 'Khảo sát slot đỗ xe tầng hầm B1/B2, kiểm tra chỉ số đồng hồ điện nước',
    initials: 'KT',
  },
  {
    username: 'resident1205',
    role: 'RESIDENT',
    label: 'Trần Hoàng Nam (Căn A-1205)',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    description: 'Cư dân tra cứu hoá đơn sinh hoạt, thanh toán VietQR Napas 247',
    initials: 'HN',
  },
];

interface AuthContextType {
  user: AuthUser | null;
  role: string;
  token: string | null;
  currentProfile: DemoProfile;
  switchDemoRole: (username: string) => Promise<void>;
  hasRole: (...allowedRoles: string[]) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<DemoProfile>(DEMO_PROFILES[0]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from localStorage or fallback to default ADMIN profile
  useEffect(() => {
    let activeToken = typeof window !== 'undefined' ? localStorage.getItem('residenthub_token') : null;
    let savedUserRaw = typeof window !== 'undefined' ? localStorage.getItem('residenthub_user') : null;

    if (savedUserRaw) {
      try {
        const parsedUser: AuthUser = JSON.parse(savedUserRaw);
        setUser(parsedUser);
        const match = DEMO_PROFILES.find((p) => p.username === parsedUser.username);
        if (match) {
          setCurrentProfile(match);
        }
      } catch {
        // Ignore parse error
      }
    }

    if (activeToken) {
      setToken(activeToken);
      setIsLoading(false);
    } else {
      // First boot: Auto-authenticate default demo admin profile
      switchDemoRole('admin');
    }
  }, []);

  const switchDemoRole = async (username: string) => {
    setIsLoading(true);
    const targetProfile = DEMO_PROFILES.find((p) => p.username === username) || DEMO_PROFILES[0];
    setCurrentProfile(targetProfile);

    // Attempt live API authentication
    const result = await authApi.login({ username, password: 'Admin@123' });

    if (result.success && result.data) {
      setUser(result.data.user);
      setToken(result.data.accessToken);
    } else {
      // Resilient fallback: Create mock claims token for offline demo (ADR-0008)
      const mockToken = `demo-token-${username}-${Date.now()}`;
      const mockUser: AuthUser = {
        id: `usr-demo-${username}`,
        username: targetProfile.username,
        role: targetProfile.role,
        fullName: targetProfile.label,
        email: `${username}@residenthub.vn`,
        isActive: true,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('residenthub_token', mockToken);
        localStorage.setItem('residenthub_user', JSON.stringify(mockUser));
      }
      setUser(mockUser);
      setToken(mockToken);
    }

    setIsLoading(false);
  };

  const hasRole = (...allowedRoles: string[]): boolean => {
    const activeRole = user?.role || currentProfile.role;
    return allowedRoles.map((r) => r.toUpperCase()).includes(activeRole.toUpperCase());
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || currentProfile.role,
        token,
        currentProfile,
        switchDemoRole,
        hasRole,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
