import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PaymentModal from '../PaymentModal';
import { Invoice } from '@/types';

const mockInvoice: Invoice = {
  id: 'inv-1205-09',
  invoiceCode: 'INV-202609-1205',
  apartmentId: 'apt-1205',
  roomNumber: 'A-1205',
  householdId: 'hh-1205',
  householdHead: 'Nguyen Van An',
  billingMonth: '09/2026',
  managementFee: 850000,
  waterFee: 240000,
  electricityFee: 650000,
  vehicleFee: 220000,
  totalAmount: 1960000,
  paidAmount: 500000,
  status: 'PARTIAL',
  dueDate: '2026-09-28',
};

describe('PaymentModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <PaymentModal
        invoice={mockInvoice}
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('does not render when invoice is null', () => {
    const { container } = render(
      <PaymentModal
        invoice={null}
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders invoice details correctly when open', () => {
    render(
      <PaymentModal
        invoice={mockInvoice}
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByText(/INV-202609-1205/)).toBeInTheDocument();
    expect(screen.getByText(/Nguyen Van An/)).toBeInTheDocument();
    expect(screen.getByText('Remaining Due:')).toBeInTheDocument();
    expect(screen.getByText(/1\.460\.000/)).toBeInTheDocument(); // 1,960,000 - 500,000 = 1,460,000
  });

  it('calls onClose when close button or Cancel is clicked', () => {
    const handleClose = vi.fn();
    render(
      <PaymentModal
        invoice={mockInvoice}
        isOpen={true}
        onClose={handleClose}
        onConfirm={vi.fn()}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('submits payment and triggers onConfirm with updated values', () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <PaymentModal
        invoice={mockInvoice}
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    );

    // Find payment amount input and change it
    const amountInput = screen.getByLabelText(/Settlement Amount/i);
    fireEvent.change(amountInput, { target: { value: '1000000' } });

    // Click confirm button
    const submitBtn = screen.getByRole('button', { name: /Confirm & Issue Receipt/i });
    fireEvent.click(submitBtn);

    expect(handleConfirm).toHaveBeenCalledWith(
      'inv-1205-09',
      1000000,
      expect.stringContaining('VietQR'),
      expect.stringContaining('TX-')
    );
    expect(handleClose).toHaveBeenCalled();
  });
});
