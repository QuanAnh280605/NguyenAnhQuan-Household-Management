'use client';

import React, { useState } from 'react';

interface AddApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    building: string;
    roomNumber: string;
    floor: number;
    area: number;
    ownerName: string;
    ownerPhone: string;
  }) => void;
}

export default function AddApartmentModal({ isOpen, onClose, onSubmit }: AddApartmentModalProps) {
  const [building, setBuilding] = useState('Tower Parkview A');
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [area, setArea] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      building,
      roomNumber,
      floor: Number(floor) || 1,
      area: Number(area) || 50,
      ownerName: ownerName.trim() || 'Unassigned',
      ownerPhone: ownerPhone.trim() || '—',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-in fade-in">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-700 text-[22px]">add_home</span>
            <h3 className="text-base font-bold text-slate-900">Register New Apartment Unit</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Building Tower *
              </label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700"
              >
                <option>Tower Parkview A</option>
                <option>Tower Parkview B</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Unit Number / Room Code *
              </label>
              <input
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
                placeholder="e.g. A-1208"
                className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Floor Level *
              </label>
              <input
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                required
                type="number"
                placeholder="e.g. 12"
                className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Usable Floor Area (m²) *
              </label>
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                type="number"
                placeholder="e.g. 86"
                className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Legal Owner Name
              </label>
              <input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Alex Smith"
                className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Phone Number
              </label>
              <input
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full px-3 py-2 rounded bg-white border border-slate-300 focus:outline-none focus:border-blue-700 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded bg-blue-700 text-white hover:bg-blue-800 font-semibold shadow-sm"
            >
              Save Apartment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
