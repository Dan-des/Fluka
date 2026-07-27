import type { LineItem } from '../types/invoice';
import { CURRENCIES } from '../types/invoice';

export const calculateSubtotal = (items: LineItem[]): number => {
  return items.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return acc + qty * price;
  }, 0);
};

export const calculateDiscount = (
  subtotal: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number => {
  const val = Number(discountValue) || 0;
  if (val <= 0) return 0;

  if (discountType === 'percentage') {
    return (subtotal * Math.min(val, 100)) / 100;
  }
  return Math.min(val, subtotal);
};

export const calculateTax = (subtotalAfterDiscount: number, taxRate: number): number => {
  const rate = Number(taxRate) || 0;
  if (rate <= 0) return 0;
  return (subtotalAfterDiscount * rate) / 100;
};

export const calculateTotals = (
  items: LineItem[],
  taxRate: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  shipping: number,
  amountPaid: number = 0
) => {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, discountType, discountValue);
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const tax = calculateTax(subtotalAfterDiscount, taxRate);
  const ship = Math.max(0, Number(shipping) || 0);
  const total = subtotalAfterDiscount + tax + ship;
  const paid = Math.max(0, Number(amountPaid) || 0);
  const balanceDue = Math.max(0, total - paid);

  return {
    subtotal,
    discount,
    subtotalAfterDiscount,
    tax,
    shipping: ship,
    total,
    amountPaid: paid,
    balanceDue,
  };
};

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return curr.position === 'before'
    ? `${curr.symbol}${formatted}`
    : `${formatted} ${curr.symbol}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};
