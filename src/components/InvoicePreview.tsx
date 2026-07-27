import React from 'react';
import type { InvoiceData } from '../types/invoice';
import { calculateTotals, formatCurrency, formatDate } from '../utils/calculations';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const totals = calculateTotals(
    data.items,
    data.taxRate,
    data.discountType,
    data.discountValue,
    data.shipping,
    data.amountPaid
  );

  const isReceipt = data.mode === 'receipt';
  const docTitle = isReceipt ? 'RECEIPT' : 'INVOICE';
  const accentColor = data.accentColor || '#4f46e5';

  // Helper watermark color
  const getWatermarkColor = () => {
    switch (data.watermark) {
      case 'PAID':
        return '#059669'; // Emerald
      case 'DRAFT':
        return '#64748b'; // Slate
      case 'OVERDUE':
        return '#dc2626'; // Red
      case 'PENDING':
        return '#d97706'; // Amber
      case 'ORIGINAL':
        return '#0284c7'; // Sky
      default:
        return '#4f46e5';
    }
  };

  return (
    <div className="w-full flex justify-center py-2 lg:py-6 px-1">
      {/* Printable A4 Container */}
      <div
        id="invoice-paper"
        className="invoice-paper relative bg-white text-slate-900 shadow-2xl rounded-sm w-full max-w-[210mm] min-h-[297mm] p-8 md:p-12 flex flex-col justify-between overflow-hidden transition-all text-xs"
        style={{
          fontFamily:
            data.templateStyle === 'classic'
              ? 'Georgia, Cambria, "Times New Roman", Times, serif'
              : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Dynamic Watermark Stamp Overlay */}
        {data.watermark !== 'none' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 overflow-hidden">
            <div
              className="border-8 border-dashed rounded-3xl px-12 py-4 font-black tracking-widest text-4xl sm:text-6xl uppercase opacity-20 transform -rotate-25 select-none"
              style={{
                color: getWatermarkColor(),
                borderColor: getWatermarkColor(),
              }}
            >
              {data.watermark}
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="space-y-8 relative z-20">
          {/* ================= HEADER SECTION ================= */}
          {data.templateStyle === 'bold' ? (
            /* Bold Theme Header */
            <div
              className="-mx-8 md:-mx-12 -mt-8 md:-mt-12 p-8 md:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              <div className="flex items-center gap-4">
                {data.business.logoUrl && (
                  <img
                    src={data.business.logoUrl}
                    alt="Company Logo"
                    className="h-14 w-auto max-w-[150px] object-contain bg-white/90 p-1.5 rounded-lg shadow-sm"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-black tracking-tight leading-tight">
                    {data.business.name || 'Your Company Name'}
                  </h1>
                  {data.business.website && (
                    <p className="text-xs opacity-90">{data.business.website}</p>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-md text-xs font-bold tracking-widest uppercase">
                  {docTitle}
                </span>
                <p className="text-lg font-bold mt-1">#{data.number || 'INV-001'}</p>
                <p className="text-xs opacity-90">
                  {isReceipt ? 'Payment Date' : 'Issue Date'}:{' '}
                  {formatDate(isReceipt ? data.paymentDate || data.issueDate : data.issueDate)}
                </p>
              </div>
            </div>
          ) : data.templateStyle === 'minimal' ? (
            /* Minimalist Theme Header */
            <div className="border-b pb-6 flex flex-col sm:flex-row justify-between items-start gap-6 border-slate-200">
              <div>
                {data.business.logoUrl && (
                  <img
                    src={data.business.logoUrl}
                    alt="Company Logo"
                    className="h-12 w-auto max-w-[140px] object-contain mb-3"
                  />
                )}
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {data.business.name || 'Your Company Name'}
                </h1>
                <p className="text-xs text-slate-500 whitespace-pre-line mt-1">
                  {data.business.address}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <h2
                  className="text-2xl font-light tracking-widest uppercase mb-1"
                  style={{ color: accentColor }}
                >
                  {docTitle}
                </h2>
                <p className="text-sm font-semibold text-slate-800">#{data.number || '001'}</p>
                <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                  <p>
                    <span className="text-slate-400">Date: </span>
                    {formatDate(data.issueDate)}
                  </p>
                  {!isReceipt && data.dueDate && (
                    <p>
                      <span className="text-slate-400">Due: </span>
                      {formatDate(data.dueDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : data.templateStyle === 'classic' ? (
            /* Classic Corporate Theme Header */
            <div className="border-b-2 border-t-2 py-6 my-2 border-slate-800 flex flex-col sm:flex-row justify-between items-start gap-6">
              <div>
                {data.business.logoUrl && (
                  <img
                    src={data.business.logoUrl}
                    alt="Company Logo"
                    className="h-14 w-auto max-w-[160px] object-contain mb-3"
                  />
                )}
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wider">
                  {data.business.name || 'Your Company Name'}
                </h1>
                <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                  {data.business.email && <p>Email: {data.business.email}</p>}
                  {data.business.phone && <p>Phone: {data.business.phone}</p>}
                  {data.business.taxId && <p>Tax ID: {data.business.taxId}</p>}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <h2
                  className="text-3xl font-extrabold tracking-tight uppercase"
                  style={{ color: accentColor }}
                >
                  {docTitle}
                </h2>
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs space-y-1">
                  <p className="font-bold text-slate-800">No: #{data.number}</p>
                  <p>Date: {formatDate(data.issueDate)}</p>
                  {!isReceipt && data.dueDate && <p>Due Date: {formatDate(data.dueDate)}</p>}
                </div>
              </div>
            </div>
          ) : (
            /* Modern Sleek Header (Default) */
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b pb-6 border-slate-200">
              <div className="space-y-3">
                {data.business.logoUrl && (
                  <img
                    src={data.business.logoUrl}
                    alt="Company Logo"
                    className="h-12 w-auto max-w-[160px] object-contain"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {data.business.name || 'Your Company Name'}
                  </h1>
                  <p className="text-xs text-slate-500 whitespace-pre-line mt-1 leading-relaxed">
                    {data.business.address}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-2">
                <div
                  className="inline-block px-3.5 py-1.5 rounded-lg text-white font-bold text-sm tracking-wider uppercase shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {docTitle}
                </div>
                <p className="text-xl font-extrabold text-slate-900 tracking-tight">
                  #{data.number || 'INV-001'}
                </p>
                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p>
                    <span className="font-medium text-slate-400">Issue Date:</span>{' '}
                    {formatDate(data.issueDate)}
                  </p>
                  {!isReceipt && data.dueDate && (
                    <p>
                      <span className="font-medium text-slate-400">Due Date:</span>{' '}
                      <strong className="text-slate-800">{formatDate(data.dueDate)}</strong>
                    </p>
                  )}
                  {isReceipt && data.paymentDate && (
                    <p>
                      <span className="font-medium text-slate-400">Payment Date:</span>{' '}
                      {formatDate(data.paymentDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= SENDER & CLIENT DETAILS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            {/* Sender / Business details (if not in header) */}
            {data.templateStyle !== 'bold' && data.templateStyle !== 'minimal' && (
              <div className="space-y-1">
                <span
                  className="font-bold text-[10px] uppercase tracking-wider block mb-1"
                  style={{ color: accentColor }}
                >
                  From:
                </span>
                <p className="font-bold text-slate-900 text-sm">{data.business.name}</p>
                {data.business.email && <p className="text-slate-600">{data.business.email}</p>}
                {data.business.phone && <p className="text-slate-600">{data.business.phone}</p>}
                {data.business.website && (
                  <p className="text-slate-600">{data.business.website}</p>
                )}
                {data.business.taxId && (
                  <p className="text-slate-500">Tax ID: {data.business.taxId}</p>
                )}
              </div>
            )}

            {/* Client / Billed To details */}
            <div className="space-y-1">
              <span
                className="font-bold text-[10px] uppercase tracking-wider block mb-1"
                style={{ color: accentColor }}
              >
                {isReceipt ? 'Paid By / Received From:' : 'Billed To / Client:'}
              </span>
              <p className="font-bold text-slate-900 text-sm">{data.client.name || 'Client Name'}</p>
              {data.client.company && (
                <p className="font-medium text-slate-800">{data.client.company}</p>
              )}
              {data.client.address && (
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {data.client.address}
                </p>
              )}
              {data.client.email && <p className="text-slate-600">{data.client.email}</p>}
              {data.client.phone && <p className="text-slate-600">{data.client.phone}</p>}
              {data.client.taxId && (
                <p className="text-slate-500">VAT / Tax ID: {data.client.taxId}</p>
              )}
            </div>

            {/* Payment Info Callout for Receipt */}
            {isReceipt && (
              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <span
                  className="font-bold text-[10px] uppercase tracking-wider block mb-1"
                  style={{ color: accentColor }}
                >
                  Payment Method Details:
                </span>
                <p className="text-slate-800">
                  <strong>Method:</strong> {data.paymentMethod || 'Credit Card / Electronic'}
                </p>
                {data.transactionId && (
                  <p className="text-slate-700 font-mono text-[11px]">
                    <strong>Ref / Txn ID:</strong> {data.transactionId}
                  </p>
                )}
                <p className="text-emerald-700 font-bold text-xs pt-1">
                  ✓ Status: PAID IN FULL
                </p>
              </div>
            )}
          </div>

          {/* ================= LINE ITEMS TABLE ================= */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="border-b text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: data.templateStyle === 'bold' ? `${accentColor}15` : 'transparent',
                    borderColor: accentColor,
                    color: accentColor,
                  }}
                >
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center w-16">Qty</th>
                  <th className="py-2.5 px-3 text-right w-24">Unit Price</th>
                  <th className="py-2.5 px-3 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {data.items.map((item, index) => {
                  const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-3 text-center text-slate-400 font-mono">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {item.description || 'Item description...'}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 font-mono">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600 font-mono">
                        {formatCurrency(item.unitPrice, data.currency)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-900 font-mono">
                        {formatCurrency(itemTotal, data.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ================= TOTALS BREAKDOWN & NOTES ================= */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-slate-200">
            {/* Left side: Notes & Terms */}
            <div className="w-full sm:w-7/12 space-y-4 text-xs">
              {/* Payment / Bank instructions */}
              {(data.paymentDetails.bankName || data.paymentDetails.accountNumber) && (
                <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/80 space-y-1">
                  <span
                    className="font-bold text-[10px] uppercase tracking-wider block"
                    style={{ color: accentColor }}
                  >
                    Payment / Bank Wire Transfer Details:
                  </span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-700 pt-1">
                    {data.paymentDetails.bankName && (
                      <p>
                        <span className="text-slate-400">Bank:</span> {data.paymentDetails.bankName}
                      </p>
                    )}
                    {data.paymentDetails.accountName && (
                      <p>
                        <span className="text-slate-400">Account:</span> {data.paymentDetails.accountName}
                      </p>
                    )}
                    {data.paymentDetails.accountNumber && (
                      <p>
                        <span className="text-slate-400">Account #:</span> {data.paymentDetails.accountNumber}
                      </p>
                    )}
                    {data.paymentDetails.routingNumber && (
                      <p>
                        <span className="text-slate-400">Routing / Sort:</span> {data.paymentDetails.routingNumber}
                      </p>
                    )}
                    {data.paymentDetails.swiftBic && (
                      <p>
                        <span className="text-slate-400">SWIFT / BIC:</span> {data.paymentDetails.swiftBic}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment terms */}
              {data.paymentDetails.paymentTerms && (
                <div>
                  <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    Terms & Conditions:
                  </span>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[11px]">
                    {data.paymentDetails.paymentTerms}
                  </p>
                </div>
              )}

              {/* Notes */}
              {data.paymentDetails.notes && (
                <div>
                  <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    Notes:
                  </span>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[11px]">
                    {data.paymentDetails.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Right side: Calculated Summary Card */}
            <div className="w-full sm:w-5/12 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">{formatCurrency(totals.subtotal, data.currency)}</span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>
                    Discount ({data.discountType === 'percentage' ? `${data.discountValue}%` : 'Fixed'}):
                  </span>
                  <span className="font-mono font-medium">-{formatCurrency(totals.discount, data.currency)}</span>
                </div>
              )}

              {totals.tax > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({data.taxRate}%):</span>
                  <span className="font-mono font-medium">+{formatCurrency(totals.tax, data.currency)}</span>
                </div>
              )}

              {totals.shipping > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Handling:</span>
                  <span className="font-mono font-medium">+{formatCurrency(totals.shipping, data.currency)}</span>
                </div>
              )}

              <div
                className="border-t pt-2.5 flex justify-between items-center text-sm font-bold text-slate-900 mt-2"
                style={{ borderColor: accentColor }}
              >
                <span>Total Amount:</span>
                <span className="text-base font-mono" style={{ color: accentColor }}>
                  {formatCurrency(totals.total, data.currency)}
                </span>
              </div>

              {/* Amount Paid & Balance Due */}
              {(isReceipt || data.amountPaid > 0) && (
                <div className="border-t border-slate-200/80 pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Amount Paid:</span>
                    <span className="font-mono font-medium text-emerald-600">
                      {formatCurrency(totals.amountPaid, data.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between font-bold text-slate-900 pt-1">
                    <span>Balance Due:</span>
                    <span
                      className={`font-mono ${
                        totals.balanceDue > 0 ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {formatCurrency(totals.balanceDue, data.currency)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= FOOTER SIGNATURE & THANK YOU ================= */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end text-[11px] text-slate-400 gap-4 mt-auto">
          <div>
            <p className="font-medium text-slate-600">Thank you for your business!</p>
            <p className="text-[10px]">Computer generated {docTitle.toLowerCase()}. Authorized document.</p>
          </div>

          <div className="text-right space-y-1">
            <div className="w-36 border-b border-slate-300 pb-1 text-center font-mono text-[10px] text-slate-400">
              Authorized Signature
            </div>
            <p className="text-[10px] text-slate-400">{data.business.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
