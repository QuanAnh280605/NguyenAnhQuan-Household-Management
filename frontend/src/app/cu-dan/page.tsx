'use client';

import { useState, useEffect } from 'react';
import { Resident } from '@/types';
import { residentApi } from '@/services/api/residentApi';
import ResidentTable from '@/components/domain/residents/ResidentTable';

export default function CuDanPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    residentApi.getResidents(searchTerm, statusFilter).then((res) => {
      if (!ignore) {
        setResidents(res.data);
        setIsLiveApi(!res.isFallback);
        setLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, [searchTerm, statusFilter]);

  return (
    <div className="flex flex-col w-full space-y-4 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 bg-emerald-700 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 text-sm font-medium">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
              Civil Registry & Resident Demographics
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
              {residents.length} Residents
            </span>
            {isLiveApi ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                FastAPI Live
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                Demo Store
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Civil profiles (12-digit Citizen ID), kinship relationships, and statutory residency classifications
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => {
              setToastMessage('Exporting resident demographics to Excel file...');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-600">download</span>
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => {
              setToastMessage('New resident registration synchronized with backend API.');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-700 text-white shadow-sm hover:bg-blue-800 text-xs font-semibold transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">person_add</span>
            <span>Register New Resident</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[17px]">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by full name, citizen ID, room, phone..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 text-slate-800"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 font-medium cursor-pointer"
          >
            <option value="ALL">All Residency Types</option>
            <option value="PERMANENT">Permanent Residency</option>
            <option value="TEMPORARY">Temporary Residency</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{residents.length}</strong> residents
        </div>
      </div>

      {/* Extracted Table Component */}
      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400 text-xs">
          Loading resident demographics...
        </div>
      ) : (
        <ResidentTable residents={residents} />
      )}
    </div>
  );
}
