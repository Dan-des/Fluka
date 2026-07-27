import React, { useRef } from 'react';
import {
  Printer,
  FileText,
  Receipt,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Eye,
  Edit3,
} from 'lucide-react';
import type { InvoiceData } from '../types/invoice';
import { SAMPLE_PRESETS } from '../types/invoice';

interface NavbarProps {
  data: InvoiceData;
  onChange: (newData: InvoiceData) => void;
  activeTab: 'edit' | 'preview';
  setActiveTab: (tab: 'edit' | 'preview') => void;
  onPrint: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  data,
  onChange,
  activeTab,
  setActiveTab,
  onPrint,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModeToggle = (mode: 'invoice' | 'receipt') => {
    const isReceipt = mode === 'receipt';
    onChange({
      ...data,
      mode,
      watermark: isReceipt ? 'PAID' : data.watermark,
      number: isReceipt
        ? data.number.replace('INV-', 'REC-')
        : data.number.replace('REC-', 'INV-'),
    });
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.mode}-${data.number || 'document'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (importedData && typeof importedData === 'object' && importedData.items) {
          onChange(importedData);
        } else {
          alert('Invalid invoice JSON format.');
        }
      } catch {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleLoadPreset = (key: string) => {
    const preset = SAMPLE_PRESETS[key];
    if (preset && preset.data) {
      onChange({
        ...data,
        ...preset.data,
      } as InvoiceData);
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Mode Switcher */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
                Fluka <span className="text-indigo-400 font-normal text-sm">Generator</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Professional Invoice & Receipt Studio
              </p>
            </div>
          </div>

          {/* Mode Selector (Invoice vs Receipt Toggle) */}
          <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 flex items-center shadow-inner">
            <button
              onClick={() => handleModeToggle('invoice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                data.mode === 'invoice'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              type="button"
            >
              <FileText className="w-3.5 h-3.5" />
              Invoice
            </button>
            <button
              onClick={() => handleModeToggle('receipt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                data.mode === 'receipt'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              type="button"
            >
              <Receipt className="w-3.5 h-3.5" />
              Receipt
            </button>
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          {/* Preset Selector */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Presets
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 p-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Load Sample Template
              </div>
              {Object.entries(SAMPLE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handleLoadPreset(key)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 rounded-lg transition"
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Import / Export JSON */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import invoice JSON"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition text-xs flex items-center gap-1"
            type="button"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            onClick={handleExportJSON}
            title="Export invoice JSON"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition text-xs flex items-center gap-1"
            type="button"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            title="Reset to blank template"
            className="p-2 text-slate-400 hover:text-rose-300 bg-slate-800/80 hover:bg-rose-900/30 border border-slate-700/60 rounded-lg transition text-xs"
            type="button"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Mobile View Toggle */}
          <div className="flex md:hidden bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab('edit')}
              className={`p-1.5 rounded text-xs ${
                activeTab === 'edit' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
              type="button"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`p-1.5 rounded text-xs ${
                activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
              type="button"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Print / Save PDF Primary Action */}
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer active:scale-95"
            type="button"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
