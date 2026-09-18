import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResidentTable from '../ResidentTable';
import { Resident } from '@/types';

const mockResidents: Resident[] = [
  {
    id: 'res-1',
    fullName: 'Nguyen Van An',
    citizenId: '001090001111',
    dateOfBirth: '15/05/1980',
    gender: 'Male',
    phone: '0912 345 678',
    apartmentId: 'apt-a1205',
    roomNumber: 'A-1205',
    relationship: 'Head of Household',
    residentStatus: 'PERMANENT',
    isHead: true,
    moveInDate: '10/01/2023',
  },
  {
    id: 'res-2',
    fullName: 'Tran Thi Mai',
    citizenId: '001185002222',
    dateOfBirth: '20/08/1985',
    gender: 'Female',
    phone: '0988 765 432',
    apartmentId: 'apt-a1205',
    roomNumber: 'A-1205',
    relationship: 'Wife',
    residentStatus: 'PERMANENT',
    isHead: false,
    moveInDate: '10/01/2023',
  },
  {
    id: 'res-3',
    fullName: 'Le Quoc Bao',
    citizenId: '001099003333',
    dateOfBirth: '05/11/1995',
    gender: 'Male',
    phone: '0977 111 222',
    apartmentId: 'apt-b0402',
    roomNumber: 'B-0402',
    relationship: 'Tenant',
    residentStatus: 'TEMPORARY',
    isHead: false,
    moveInDate: '01/06/2024',
  },
];

describe('ResidentTable Component', () => {
  it('renders empty message when no residents are provided', () => {
    render(<ResidentTable residents={[]} />);
    expect(
      screen.getByText('No residents match the current search or filter criteria.')
    ).toBeInTheDocument();
  });

  it('renders table headers and resident rows properly', () => {
    render(<ResidentTable residents={mockResidents} />);

    // Check table headers
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Citizen ID (CCCD)')).toBeInTheDocument();
    expect(screen.getByText('Residency Status')).toBeInTheDocument();

    // Check resident names
    expect(screen.getByText('Nguyen Van An')).toBeInTheDocument();
    expect(screen.getByText('Tran Thi Mai')).toBeInTheDocument();
    expect(screen.getByText('Le Quoc Bao')).toBeInTheDocument();
  });

  it('renders Head badge only for household heads', () => {
    render(<ResidentTable residents={mockResidents} />);

    // Head badge should exist for Nguyen Van An
    const headBadges = screen.getAllByText('Head');
    expect(headBadges.length).toBe(1);
  });

  it('renders correct 12-digit Citizen IDs (CCCD)', () => {
    render(<ResidentTable residents={mockResidents} />);

    expect(screen.getByText('001090001111')).toBeInTheDocument();
    expect(screen.getByText('001185002222')).toBeInTheDocument();
    expect(screen.getByText('001099003333')).toBeInTheDocument();
  });

  it('renders links to apartment units', () => {
    render(<ResidentTable residents={mockResidents} />);

    const unitLinks = screen.getAllByRole('link');
    const unitTexts = unitLinks.map((l) => l.textContent);
    expect(unitTexts).toContain('A-1205');
    expect(unitTexts).toContain('B-0402');
  });
});
