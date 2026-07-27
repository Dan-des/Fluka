import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Palette,
  Building2,
  User,
  ListOrdered,
  DollarSign,
  FileCheck,
  ChevronDown,
  ChevronUp,
  X,
  ArrowUp,
  ArrowDown,
  Tag,
} from 'lucide-react';
import type {
  InvoiceData,
  LineItem,
  TemplateStyle,
  WatermarkType,
} from '../types/invoice';
import {
  CURRENCIES,
  COLOR_PRESETS,
} from '../types/invoice';
import { calculateTotals, formatCurrency } from '../utils/calculations';

interface FormEditorProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ data, onChange }) => {
  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    business: true,
    client: true,
    items: true,
    totals: true,
    payment: false,
  });

  const logoInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper field updater
  const updateField = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const updateBusiness = (key: keyof InvoiceData['business'], value: string) => {
    onChange({
      ...data,
      business: { ...data.business, [key]: value },
    });
  };

  const updateClient = (key: keyof InvoiceData['client'], value: string) => {
    onChange({
      ...data,
      client: { ...data.client, [key]: value },
    });
  };

  const updatePayment = (key: keyof InvoiceData['paymentDetails'], value: string) => {
    onChange({
      ...data,
      paymentDetails: { ...data.paymentDetails, [key]: value },
    });
  };

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size should be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateBusiness('logoUrl', event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    updateBusiness('logoUrl', '');
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  // Line item handlers
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const handleUpdateItem = (id: string, field: keyof LineItem, value: string | number) => {
    const updatedItems = data.items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange({ ...data, items: updatedItems });
  };

  const handleRemoveItem = (id: string) => {
    if (data.items.length <= 1) {
      alert('Invoice must have at least one line item.');
      return;
    }
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    });
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...data.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onChange({ ...data, items: newItems });
  };

  const handleAddPresetItem = (desc: string, price: number) => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: desc,
      quantity: 1,
      unitPrice: price,
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const totals = calculateTotals(
    data.items,
    data.taxRate,
    data.discountType,
    data.discountValue,
    data.shipping,
    data.amountPaid
  );

  return (
    <div className="space-y-4 text-slate-200">
      {/* 1. General & Branding Settings */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <button
          onClick={() => toggleSection('general')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 text-left transition"
          type="button"
        >
          <div className="flex items-center gap-2.5 font-semibold text-slate-100 text-sm">
            <Palette className="w-4 h-4 text-indigo-400" />
            <span>Document Settings & Theme</span>
          </div>
          {openSections.general ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.general && (
          <div className="p-5 space-y-4">
            {/* Number & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  {data.mode === 'invoice' ? 'Invoice Number' : 'Receipt Number'}
                </label>
                <input
                  type="text"
                  value={data.number}
                  onChange={(e) => updateField('number', e.target.value)}
                  placeholder="e.g. INV-2026-001"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={data.issueDate}
                  onChange={(e) => updateField('issueDate', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  {data.mode === 'invoice' ? 'Due Date' : 'Payment Date'}
                </label>
                <input
                  type="date"
                  value={data.mode === 'invoice' ? data.dueDate : data.paymentDate || data.issueDate}
                  onChange={(e) =>
                    data.mode === 'invoice'
                      ? updateField('dueDate', e.target.value)
                      : updateField('paymentDate', e.target.value)
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* If Receipt Mode: Payment Method & Txn ID */}
            {data.mode === 'receipt' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    value={data.paymentMethod || ''}
                    onChange={(e) => updateField('paymentMethod', e.target.value)}
                    placeholder="e.g. Visa ending in 4242, Bank Transfer, PayPal"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Transaction ID / Reference
                  </label>
                  <input
                    type="text"
                    value={data.transactionId || ''}
                    onChange={(e) => updateField('transactionId', e.target.value)}
                    placeholder="e.g. TXN-991823901"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Currency & Template Style & Watermark */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Currency
                </label>
                <select
                  value={data.currency}
                  onChange={(e) => updateField('currency', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Template Style
                </label>
                <select
                  value={data.templateStyle}
                  onChange={(e) => updateField('templateStyle', e.target.value as TemplateStyle)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="modern">Modern Sleek</option>
                  <option value="classic">Classic Executive</option>
                  <option value="minimal">Minimalist Clean</option>
                  <option value="bold">Bold Impact</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Watermark Stamp
                </label>
                <select
                  value={data.watermark}
                  onChange={(e) => updateField('watermark', e.target.value as WatermarkType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="none">None</option>
                  <option value="PAID">PAID</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="PENDING">PENDING</option>
                  <option value="OVERDUE">OVERDUE</option>
                  <option value="ORIGINAL">ORIGINAL</option>
                </select>
              </div>
            </div>

            {/* Accent Color Picker & Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Primary Brand Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => updateField('accentColor', preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`w-7 h-7 rounded-lg transition-transform ${
                      data.accentColor === preset.hex
                        ? 'ring-2 ring-white scale-110 shadow-lg'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    title={preset.name}
                  />
                ))}

                {/* Custom Color Input */}
                <div className="relative flex items-center ml-2 border border-slate-800 rounded-lg p-1 bg-slate-950">
                  <input
                    type="color"
                    value={data.accentColor}
                    onChange={(e) => updateField('accentColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-mono ml-2 text-slate-400 uppercase">
                    {data.accentColor}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Business Details (Your Company) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <button
          onClick={() => toggleSection('business')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 text-left transition"
          type="button"
        >
          <div className="flex items-center gap-2.5 font-semibold text-slate-100 text-sm">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Business / Sender Info</span>
          </div>
          {openSections.business ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.business && (
          <div className="p-5 space-y-4">
            {/* Logo Upload Box */}
            <div className="border border-dashed border-slate-700/80 rounded-xl p-3 bg-slate-950/60">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {data.business.logoUrl ? (
                    <div className="relative group">
                      <img
                        src={data.business.logoUrl}
                        alt="Logo"
                        className="h-12 w-auto max-w-[120px] object-contain rounded bg-white p-1"
                      />
                      <button
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow"
                        title="Remove Logo"
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-slate-200">Company Logo</p>
                    <p className="text-[11px] text-slate-400">PNG, JPG, SVG (Max 2MB)</p>
                  </div>
                </div>

                <div>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
                    type="button"
                  >
                    {data.business.logoUrl ? 'Change Logo' : 'Upload Logo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={data.business.name}
                  onChange={(e) => updateBusiness('name', e.target.value)}
                  placeholder="Apex Design Co."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={data.business.email}
                  onChange={(e) => updateBusiness('email', e.target.value)}
                  placeholder="billing@apexdesign.io"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={data.business.phone}
                  onChange={(e) => updateBusiness('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={data.business.website}
                  onChange={(e) => updateBusiness('website', e.target.value)}
                  placeholder="https://apexdesign.io"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Tax ID / VAT #
                </label>
                <input
                  type="text"
                  value={data.business.taxId}
                  onChange={(e) => updateBusiness('taxId', e.target.value)}
                  placeholder="US-987654321"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Business Address
              </label>
              <textarea
                rows={2}
                value={data.business.address}
                onChange={(e) => updateBusiness('address', e.target.value)}
                placeholder="742 Evergreen Terrace, Suite 400&#10;San Francisco, CA 94107"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Client Information */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <button
          onClick={() => toggleSection('client')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 text-left transition"
          type="button"
        >
          <div className="flex items-center gap-2.5 font-semibold text-slate-100 text-sm">
            <User className="w-4 h-4 text-sky-400" />
            <span>Client / Billed To</span>
          </div>
          {openSections.client ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.client && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Client Name / Contact *
                </label>
                <input
                  type="text"
                  value={data.client.name}
                  onChange={(e) => updateClient('name', e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={data.client.company}
                  onChange={(e) => updateClient('company', e.target.value)}
                  placeholder="CloudScale Technologies"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  value={data.client.email}
                  onChange={(e) => updateClient('email', e.target.value)}
                  placeholder="s.jenkins@cloudscale.app"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={data.client.phone}
                  onChange={(e) => updateClient('phone', e.target.value)}
                  placeholder="+1 (555) 987-6543"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Tax ID / VAT (Optional)
                </label>
                <input
                  type="text"
                  value={data.client.taxId || ''}
                  onChange={(e) => updateClient('taxId', e.target.value)}
                  placeholder="US-123456789"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Client Billing Address
              </label>
              <textarea
                rows={2}
                value={data.client.address}
                onChange={(e) => updateClient('address', e.target.value)}
                placeholder="100 Innovation Way, Floor 12&#10;Austin, TX 78701"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Line Items Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <button
          onClick={() => toggleSection('items')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 text-left transition"
          type="button"
        >
          <div className="flex items-center gap-2.5 font-semibold text-slate-100 text-sm">
            <ListOrdered className="w-4 h-4 text-violet-400" />
            <span>Line Items ({data.items.length})</span>
          </div>
          {openSections.items ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.items && (
          <div className="p-5 space-y-4">
            {/* Quick preset item chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Quick Add:
              </span>
              <button
                type="button"
                onClick={() => handleAddPresetItem('Web Design & Prototyping', 1500)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition whitespace-nowrap"
              >
                + Web Design ($1,500)
              </button>
              <button
                type="button"
                onClick={() => handleAddPresetItem('Development Hourly Work', 95)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition whitespace-nowrap"
              >
                + Hourly Work ($95/hr)
              </button>
              <button
                type="button"
                onClick={() => handleAddPresetItem('Consulting & Advisory Session', 250)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition whitespace-nowrap"
              >
                + Consulting ($250)
              </button>
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              {data.items.map((item, index) => {
                const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2 relative group hover:border-slate-700 transition"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col gap-1 pt-2">
                        <button
                          type="button"
                          onClick={() => handleMoveItem(index, 'up')}
                          disabled={index === 0}
                          className="text-slate-500 hover:text-slate-300 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveItem(index, 'down')}
                          disabled={index === data.items.length - 1}
                          className="text-slate-500 hover:text-slate-300 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                        {/* Description */}
                        <div className="sm:col-span-6">
                          <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleUpdateItem(item.id, 'description', e.target.value)
                            }
                            placeholder="Item description or service details..."
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItem(
                                item.id,
                                'quantity',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Unit Price
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleUpdateItem(
                                item.id,
                                'unitPrice',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>

                        {/* Total Line Amount */}
                        <div className="sm:col-span-2 flex flex-col justify-between">
                          <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Amount
                          </label>
                          <div className="h-8 flex items-center justify-end font-semibold text-xs text-slate-200 bg-slate-900/40 px-2 rounded-lg border border-slate-800/40">
                            {formatCurrency(itemTotal, data.currency)}
                          </div>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="mt-6 text-slate-500 hover:text-rose-400 p-1.5 hover:bg-rose-950/40 rounded-lg transition"
                        title="Delete row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Line Item Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-xl text-xs font-medium transition shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Item Row
              </button>

              <span className="text-xs text-slate-400">
                Subtotal: <strong className="text-white font-semibold">{formatCurrency(totals.subtotal, data.currency)}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Totals, Tax, & Discounts */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <button
          onClick={() => toggleSection('totals')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 text-left transition"
          type="button"
        >
          <div className="flex items-center gap-2.5 font-semibold text-slate-100 text-sm">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Tax, Discount & Summary</span>
          </div>
          {openSections.totals ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.totals && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tax Rate */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Tax Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={data.taxRate}
                    onChange={(e) =>
                      updateField('taxRate', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition pr-8"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-500">%</span>
                </div>
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Discount Type
                </label>
                <select
                  value={data.discountType}
                  onChange={(e) =>
                    updateField('discountType', e.target.value as 'percentage' | 'fixed')
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Discount Value
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={data.discountValue}
                  onChange={(e) =>
                    updateField('discountValue', Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Shipping */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Shipping / Handling Fee
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={data.shipping}
                  onChange={(e) =>
                    updateField('shipping', Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Amount Paid (Receipt / Partial Payment) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Amount Paid
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={data.amountPaid}
                  onChange={(e) =>
                    updateField('amountPaid', Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Calculations Breakdown Card */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal:</span>
                <span>{formatCurrency(totals.subtotal, data.currency)}</span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({data.discountType === 'percentage' ? `${data.discountValue}%` : 'Fixed'}):</span>
                  <span>-{formatCurrency(totals.discount, data.currency)}</span>
                </div>
              )}

              {totals.tax > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Tax ({data.taxRate}%):</span>
                  <span>+{formatCurrency(totals.tax, data.currency)}</span>
                </div>
              )}

              {totals.shipping > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Shipping:</span>
                  <span>+{formatCurrency(totals.shipping, data.currency)}</span>
                </div>
              )}

              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm text-white">
                <span>Total Amount:</span>
                <span className="text-indigo-400">{formatCurrency(totals.total, data.currency)}</span>
              </div>

              {data.amountPaid > 0 && (
                <div className="flex justify-between text-xs pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Balance Due:</span>
                  <span className={totals.balanceDue > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                    {formatCurrency(totals.balanceDue, data.currency)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 6. Payment Terms & Bank Details */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <button
          onClick={() => toggleSection('payment')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 text-left transition"
          type="button"
        >
          <div className="flex items-center gap-2.5 font-semibold text-slate-100 text-sm">
            <FileCheck className="w-4 h-4 text-purple-400" />
            <span>Bank Details, Terms & Notes</span>
          </div>
          {openSections.payment ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.payment && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={data.paymentDetails.bankName}
                  onChange={(e) => updatePayment('bankName', e.target.value)}
                  placeholder="Silicon Valley Bank"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  value={data.paymentDetails.accountName}
                  onChange={(e) => updatePayment('accountName', e.target.value)}
                  placeholder="Apex Design Co. LLC"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Account / IBAN Number
                </label>
                <input
                  type="text"
                  value={data.paymentDetails.accountNumber}
                  onChange={(e) => updatePayment('accountNumber', e.target.value)}
                  placeholder="XXXX-XXXX-4829"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Routing / Sort Code
                </label>
                <input
                  type="text"
                  value={data.paymentDetails.routingNumber}
                  onChange={(e) => updatePayment('routingNumber', e.target.value)}
                  placeholder="121000358"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  SWIFT / BIC Code
                </label>
                <input
                  type="text"
                  value={data.paymentDetails.swiftBic}
                  onChange={(e) => updatePayment('swiftBic', e.target.value)}
                  placeholder="SVBKUS6S"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Payment Terms & Conditions
              </label>
              <textarea
                rows={2}
                value={data.paymentDetails.paymentTerms}
                onChange={(e) => updatePayment('paymentTerms', e.target.value)}
                placeholder="Payment due within 15 days of invoice date."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Additional Notes / Footnote
              </label>
              <textarea
                rows={2}
                value={data.paymentDetails.notes}
                onChange={(e) => updatePayment('notes', e.target.value)}
                placeholder="Thank you for your business!"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
