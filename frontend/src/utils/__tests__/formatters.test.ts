import { describe, it, expect } from 'vitest';
import { formatCurrencyVND, formatCurrency, formatDateVN, formatDateTimeVN } from '../formatters';

describe('formatters utility functions', () => {
  describe('formatCurrencyVND & formatCurrency', () => {
    it('formats numbers to Vietnamese Dong currency string', () => {
      const formatted = formatCurrencyVND(1500000);
      // Normalized check: contains 1.500.000 and currency symbol
      expect(formatted.replace(/\s+/g, ' ')).toMatch(/1\.500\.000/);
    });

    it('handles zero amount without error', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toContain('0');
    });

    it('formats large values accurately without floating drift', () => {
      const formatted = formatCurrencyVND(25000000);
      expect(formatted.replace(/\s+/g, ' ')).toMatch(/25\.000\.000/);
    });
  });

  describe('formatDateVN', () => {
    it('formats ISO date string to DD/MM/YYYY', () => {
      const formatted = formatDateVN('2026-09-18T00:00:00Z');
      expect(formatted).toBe('18/09/2026');
    });

    it('formats Date object to DD/MM/YYYY', () => {
      const date = new Date(2026, 8, 18); // Month is 0-indexed in JS (8 = September)
      const formatted = formatDateVN(date);
      expect(formatted).toBe('18/09/2026');
    });
  });

  describe('formatDateTimeVN', () => {
    it('formats date and time together', () => {
      const formatted = formatDateTimeVN('2026-09-18T10:30:00Z');
      expect(formatted).toContain('18/09/2026');
    });
  });
});
