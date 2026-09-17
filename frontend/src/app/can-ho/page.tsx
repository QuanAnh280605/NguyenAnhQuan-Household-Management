'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Apartment } from '@/types';
import { apartmentApi } from '@/services/api/apartmentApi';
import AddApartmentModal from '@/components/forms/AddApartmentModal';

export default function CanHoPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    apartmentApi
      .getApartments({
        building: filterBuilding,
        status: filterStatus,
        search: searchTerm,
      })
      .then((res) => {
        if (!ignore) {
          setApartments(res.data);
          setIsLiveApi(!res.isFallback);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [filterBuilding, filterStatus, searchTerm]);

  const handleCreateApartment = async (data: {
    building: string;
    roomNumber: string;
    floor: number;
    area: number;
    ownerName: string;
    ownerPhone: string;
  }) => {
    const newApt: Apartment = {
      id: `apt-${data.roomNumber.toLowerCase().replace('-', '')}`,
      building: data.building,
      roomNumber: data.roomNumber,
      floor: data.floor,
      area: data.area,
      status: 'OWNER_OCCUPIED',
      roomType: `${data.area > 80 ? '3BR' : '2BR'} Standard`,
      direction: 'Southeast',
      ownerName: data.ownerName,
      ownerPhone: data.ownerPhone,
      ownerCitizenId: '001090000000',
      handoverDate: new Date().toLocaleDateString('en-US'),
      feeStatus: 'PAID',
      residents: [],
      vehicles: [],
      invoices: [],
    };

    // Optimistic / local update & API call
    setApartments([newApt, ...apartments]);
    await apartmentApi.createApartment({
      buildingId: data.building.includes('A') ? 'b0000000-0000-0000-0000-000000000001' : 'b0000000-0000-0000-0000-000000000002',
      roomNumber: data.roomNumber,
      floor: data.floor,
      area: data.area,
      owner: {
        fullName: data.ownerName,
        citizenId: '001090000000',
        phone: data.ownerPhone,
      },
    });

    setToastMessage(`Apartment unit ${data.roomNumber} successfully registered!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getStatusBadge = (status: Apartment['status']) => {
    switch (status) {
      case 'OWNER_OCCUPIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
            Owner Occupied
          </span>
        );
      case 'RENTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
            Rented
          </span>
        );
      case 'EMPTY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Vacant
          </span>
        );
      case 'REPAIRING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Renovating
          </span>
        );
    }
  };

  const getFeeBadge = (status: Apartment['feeStatus']) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
            Paid
          </span>
        );
      case 'UNPAID':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-700"></span>
            Unpaid
          </span>
        );
      case 'EXEMPT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Exempt
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
            {status}
          </span>
        );
    }
  };

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
              Apartment Units Directory
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
              {apartments.length} Units
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
            Monitor room specifications, usable floor area, legal ownership tenure, and occupancy statuses
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => {
              setToastMessage('Exporting apartment roster to Excel file...');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-600">file_download</span>
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-700 text-white shadow-sm hover:bg-blue-800 text-xs font-semibold transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>Add New Apartment</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[17px]">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by room number, owner, phone..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 text-slate-800"
            />
          </div>

          {/* Building Select */}
          <select
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 font-medium cursor-pointer"
          >
            <option value="ALL">All Towers</option>
            <option value="A">Tower Parkview A</option>
            <option value="B">Tower Parkview B</option>
          </select>

          {/* Status Select */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-300 text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-700 font-medium cursor-pointer"
          >
            <option value="ALL">All Occupancy Statuses</option>
            <option value="OWNER_OCCUPIED">Owner Occupied</option>
            <option value="RENTED">Rented</option>
            <option value="EMPTY">Vacant</option>
            <option value="REPAIRING">Renovating</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{apartments.length}</strong> units
        </div>
      </div>

      {/* Apartments Grid */}
      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400 text-xs">
          Loading apartment directory from server...
        </div>
      ) : apartments.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400 text-xs">
          No apartments match the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {apartments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/can-ho/${apt.roomNumber}`}
                        className="text-base font-bold text-slate-900 hover:text-blue-700 transition-colors font-mono"
                      >
                        {apt.roomNumber}
                      </Link>
                      <span className="text-xs text-slate-500 font-medium">
                        • {apt.building}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Floor {apt.floor} • {apt.roomType}
                    </div>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>

                <div className="py-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">square_foot</span>
                      Usable Floor Area:
                    </span>
                    <span className="font-semibold text-slate-800">{apt.area} m²</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">person</span>
                      Registered Owner:
                    </span>
                    <span className="font-semibold text-slate-900">{apt.ownerName}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">call</span>
                      Phone Number:
                    </span>
                    <span className="font-mono text-slate-800">{apt.ownerPhone}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">receipt_long</span>
                      Utility Fee Status:
                    </span>
                    <div>{getFeeBadge(apt.feeStatus)}</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  {apt.residents.length} Inhabitants
                </span>
                <Link
                  href={`/can-ho/${apt.roomNumber}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50/70 hover:bg-blue-100/70 px-2.5 py-1 rounded transition-colors"
                >
                  <span>Unit Dossier</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extracted Form Modal */}
      <AddApartmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateApartment}
      />
    </div>
  );
}
