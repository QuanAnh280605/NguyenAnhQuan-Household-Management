'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Persistent Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col pl-[256px] min-w-0">
          {/* Persistent Top Header */}
          <Header />

          {/* Dynamic Page Content */}
          <main className="w-full min-h-screen pt-[80px] px-5 pb-8 lg:pt-[88px] lg:px-7 lg:pb-10">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

