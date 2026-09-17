'use client';

import Link from 'next/link';
import { mockApartmentA1205 } from '@/lib/mock-data';

export default function PhuongTienPage() {
  const vehicles = [
    ...mockApartmentA1205.vehicles,
    {
      id: 'veh-3',
      apartmentId: 'apt-a1207',
      roomNumber: 'A-1207',
      residentName: 'Nguyen Tien Dung',
      licensePlate: '30E-123.45',
      vehicleType: 'CAR' as const,
      parkingSlot: 'B2-A02 (Car)',
      brand: 'Toyota Camry (Black)',
      registeredDate: '22/03/2023',
      status: 'ACTIVE' as const,
    },
    {
      id: 'veh-4',
      apartmentId: 'apt-b0802',
      roomNumber: 'B-0802',
      residentName: 'Vu Duc Thanh',
      licensePlate: '29K1-987.65',
      vehicleType: 'MOTORBIKE' as const,
      parkingSlot: 'B1-XM-110 (Motorbike)',
      brand: 'Honda Airblade (Grey)',
      registeredDate: '25/06/2023',
      status: 'ACTIVE' as const,
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Vehicles & Parking Facility Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">
              Basements B1 & B2
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            RFID access smart cards, license plate registry, and basement car/motorbike slot quotas.
          </p>
        </div>

        <button
          onClick={() => alert('Issue new RFID parking badge')}
          className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary transition-colors font-label-md text-label-md font-semibold self-start sm:self-auto"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add_card</span>
          <span>Issue Parking Badge</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-outline uppercase font-semibold">Registered Automobiles</span>
          <div className="font-metric-display text-2xl font-bold text-on-surface mt-1">186 cars</div>
          <p className="text-xs text-secondary font-semibold mt-1">24 slots available on Level B2</p>
        </div>
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-outline uppercase font-semibold">Motorbikes & E-Scooters</span>
          <div className="font-metric-display text-2xl font-bold text-on-surface mt-1">542 vehicles</div>
          <p className="text-xs text-secondary font-semibold mt-1">78% occupancy on Level B1</p>
        </div>
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-outline uppercase font-semibold">Expired / Suspended Badges</span>
          <div className="font-metric-display text-2xl font-bold text-error mt-1">8 badges</div>
          <p className="text-xs text-error font-semibold mt-1">Pending audit and renewal</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/20 text-xs font-semibold uppercase tracking-wider text-outline">
                <th className="py-3.5 px-4">License Plate</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Make & Model</th>
                <th className="py-3.5 px-4">Unit</th>
                <th className="py-3.5 px-4">Registered Owner</th>
                <th className="py-3.5 px-4">Allocated Slot</th>
                <th className="py-3.5 px-4">Registration Date</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{v.licensePlate}</td>
                  <td className="py-3.5 px-4 text-on-surface">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">
                        {v.vehicleType === 'CAR' ? 'directions_car' : 'two_wheeler'}
                      </span>
                      {v.vehicleType === 'CAR' ? 'Car' : 'Motorbike'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">{v.brand}</td>
                  <td className="py-3.5 px-4 font-bold">
                    <Link href={`/can-ho/${v.roomNumber}`} className="text-on-surface hover:text-primary">
                      {v.roomNumber}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface font-medium">{v.residentName}</td>
                  <td className="py-3.5 px-4 text-secondary font-medium font-mono text-xs">{v.parkingSlot}</td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant">{v.registeredDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary-fixed/40 text-tertiary">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
