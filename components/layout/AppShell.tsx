'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-[250px] min-w-0">
        {/* Persistent Top Header */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="w-full pt-16 min-h-screen p-space-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
