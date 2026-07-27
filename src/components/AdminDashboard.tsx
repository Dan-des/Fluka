import React, { useState } from 'react';
import {
  ShieldAlert,
  Store,
  Boxes,
  CheckCircle2,
  Trash2,
  Flag,
  PlusCircle,
  Search,
  Check,
  Ban,
  X,
  Upload,
  LogOut,
  Sparkles,
  Percent,
  Radio,
  Flame,
} from 'lucide-react';
import type { Product, ProductCategory, ThemeMode, VendorStore, DiscountCampaign } from '../types/store';
import { CATEGORIES } from '../data/products';

interface AdminDashboardProps {
  vendors: VendorStore[];
  products: Product[];
  campaigns: DiscountCampaign[];
  onToggleVerifyVendor: (vendorId: string) => void;
  onToggleFlagVendor: (vendorId: string) => void;
  onRemoveVendor: (vendorId: string) => void;
  onToggleFlagProduct: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
  onAddProduct: (product: Product) => void;
  onAddCampaign: (campaign: DiscountCampaign) => void;
  onToggleActiveCampaign: (campaignId: string) => void;
  onSetBestOfferCampaign: (campaignId: string) => void;
  onRemoveCampaign: (campaignId: string) => void;
  onLogout: () => void;
  theme?: ThemeMode;
}

const PRESET_SAMPLE_IMAGES = [
  { label: 'Headphones / Audio', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Smartwatch / Wearable', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mechanical Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Smart Ambient Lamp', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  vendors,
  products,
  campaigns,
  onToggleVerifyVendor,
  onToggleFlagVendor,
  onRemoveVendor,
  onToggleFlagProduct,
  onRemoveProduct,
  onAddProduct,
  onAddCampaign,
  onToggleActiveCampaign,
  onSetBestOfferCampaign,
  onRemoveCampaign,
  onLogout,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'vendors' | 'products' | 'campaigns'>('vendors');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory>('All');
  const [isAdminAddModalOpen, setIsAdminAddModalOpen] = useState(false);

  // New Campaign Form State (Unlimited Creation)
  const [campaignForm, setCampaignForm] = useState({
    code: '',
    discountPercent: '15',
    announcementText: '',
  });

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    tagline: '',
    category: 'Audio' as ProductCategory,
    price: '',
    originalPrice: '',
    stockQuantity: '50',
    vendorName: 'Fluka Official',
    image: PRESET_SAMPLE_IMAGES[0].url,
    description: '',
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vendorName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Vendors
  const filteredVendors = vendors.filter((v) =>
    v.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCampaignsCount = campaigns.filter((c) => c.isActive).length;

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.code || !campaignForm.announcementText) return;

    const discountNum = parseInt(campaignForm.discountPercent, 10) || 10;

    const created: DiscountCampaign = {
      id: `cmp-${Date.now()}`,
      code: campaignForm.code.trim().toUpperCase(),
      discountPercent: discountNum,
      announcementText: campaignForm.announcementText.trim(),
      isActive: activeCampaignsCount < 3,
      isBestOffer: campaigns.length === 0,
    };

    onAddCampaign(created);
    setCampaignForm({
      code: '',
      discountPercent: '15',
      announcementText: '',
    });
  };

  const handleAdminSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) return;

    const priceNum = parseFloat(newProductForm.price) || 0;
    const origPriceNum = newProductForm.originalPrice ? parseFloat(newProductForm.originalPrice) : undefined;
    const stockNum = parseInt(newProductForm.stockQuantity, 10) || 20;

    const created: Product = {
      id: `flk-adm-${Date.now()}`,
      name: newProductForm.name,
      tagline: newProductForm.tagline || 'Official Admin Listed Item',
      category: newProductForm.category,
      price: priceNum,
      originalPrice: origPriceNum && origPriceNum > priceNum ? origPriceNum : undefined,
      rating: 5.0,
      reviewCount: 1,
      image: newProductForm.image,
      description: newProductForm.description || 'Verified product published by Administrator.',
      specs: {
        Warranty: '2 Years Manufacturer',
        Seller: newProductForm.vendorName,
      },
      inStock: stockNum > 0,
      stockQuantity: stockNum,
      vendorName: newProductForm.vendorName,
      isNew: true,
    };

    onAddProduct(created);
    setIsAdminAddModalOpen(false);
    setNewProductForm({
      name: '',
      tagline: '',
      category: 'Audio',
      price: '',
      originalPrice: '',
      stockQuantity: '50',
      vendorName: 'Fluka Official',
      image: PRESET_SAMPLE_IMAGES[0].url,
      description: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Admin Title */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden ${
          isDark ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black shadow-lg shadow-rose-500/20">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">Fluka Marketplace Admin Portal</h1>
              <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md text-[10px] font-bold">
                ROOT CONTROL ACCESS
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Monitor registered vendors, verify store applications, flag suspicious activity, and manage marquee campaigns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsAdminAddModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Admin Add Product</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-xl text-xs font-bold transition cursor-pointer"
            title="Log out of Admin Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <Store className="w-5 h-5 text-cyan-400 mb-1" />
          <span className="font-mono font-black text-xl block text-white">{vendors.length}</span>
          <span className="text-slate-400 text-[11px]">Registered Vendors</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-1" />
          <span className="font-mono font-black text-xl block text-emerald-400">{vendors.filter(v => v.isVerified).length}</span>
          <span className="text-slate-400 text-[11px]">Verified Merchants</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <Boxes className="w-5 h-5 text-indigo-400 mb-1" />
          <span className="font-mono font-black text-xl block text-white">{products.length}</span>
          <span className="text-slate-400 text-[11px]">Live Products</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
          <span className="font-mono font-black text-xl block text-amber-400">{activeCampaignsCount}/3</span>
          <span className="text-slate-400 text-[11px]">Active Marquee Offers ({campaigns.length} Total)</span>
        </div>
      </div>

      {/* Main Tabs Navigation & Search Bar */}
      <div className="space-y-4">
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('vendors')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'vendors'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Vendor Stores ({vendors.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md'
                  : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>Marketplace Products ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'campaigns'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md'
                  : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Marquee Offers ({activeCampaignsCount}/3 Active)</span>
            </button>
          </div>

          {/* Search Bar */}
          {activeTab !== 'campaigns' && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'vendors' ? 'Search vendors...' : 'Search products...'}
                className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs outline-none transition ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-100 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          )}
        </div>

        {/* TAB 1: VENDORS MANAGEMENT TABLE */}
        {activeTab === 'vendors' && (
          <div className={`border rounded-3xl overflow-hidden shadow-xl ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b text-slate-400 font-semibold uppercase tracking-wider text-[10px] ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <tr>
                    <th className="p-4">Store Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-200 text-slate-800'}`}>
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No registered vendors found.
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className={vendor.isFlagged ? 'bg-rose-950/20' : ''}>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-cyan-400" />
                            <div>
                              <p className="font-bold text-white text-xs">{vendor.storeName}</p>
                              <p className="text-[10px] text-slate-500">ID: {vendor.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <p className="font-medium text-slate-300">{vendor.email}</p>
                          <p className="text-[10px] text-slate-500">{vendor.phone}</p>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            {vendor.category}
                          </span>
                        </td>

                        <td className="p-4">
                          {vendor.isVerified ? (
                            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-bold w-max block">
                              Unverified
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          {vendor.isFlagged ? (
                            <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 w-max">
                              <Flag className="w-3 h-3 text-rose-400" /> FLAGGED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">
                              Active
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onToggleVerifyVendor(vendor.id)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                vendor.isVerified
                                  ? 'bg-amber-950/60 hover:bg-amber-900 text-amber-300'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                              title={vendor.isVerified ? 'Deregister Verification' : 'Verify Vendor Store'}
                            >
                              {vendor.isVerified ? <Ban className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                              <span>{vendor.isVerified ? 'Unverify' : 'Verify'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onToggleFlagVendor(vendor.id)}
                              className={`p-1.5 rounded-lg text-xs transition ${
                                vendor.isFlagged
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300'
                              }`}
                              title={vendor.isFlagged ? 'Clear Flag' : 'Flag Vendor Store'}
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onRemoveVendor(vendor.id)}
                              className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg text-xs transition"
                              title="Deregister & Remove Vendor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT TABLE */}
        {activeTab === 'products' && (
          <div className={`border rounded-3xl overflow-hidden shadow-xl space-y-4 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-slate-500 font-medium">Filter Category:</span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-xl text-xs transition font-semibold ${
                      categoryFilter === cat
                        ? 'bg-cyan-600 text-white'
                        : isDark ? 'bg-slate-950 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b text-slate-400 font-semibold uppercase tracking-wider text-[10px] ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <tr>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Seller / Vendor</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-200 text-slate-800'}`}>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No products match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => (
                      <tr key={prod.id} className={prod.isFlagged ? 'bg-rose-950/20' : ''}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 object-cover rounded-xl bg-slate-950 border border-slate-800"
                            />
                            <div>
                              <p className="font-bold text-white text-xs">{prod.name}</p>
                              <p className="text-[10px] text-slate-500">ID: {prod.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-cyan-400">{prod.vendorName || 'Fluka Official'}</span>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            {prod.category}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-bold text-white">
                          ₦{prod.price.toLocaleString()}
                        </td>

                        <td className="p-4">
                          {prod.isFlagged ? (
                            <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 w-max">
                              <Flag className="w-3 h-3 text-rose-400" /> FLAGGED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-semibold">
                              Active Live
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onToggleFlagProduct(prod.id)}
                              className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                                prod.isFlagged
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300'
                              }`}
                              title={prod.isFlagged ? 'Clear Product Flag' : 'Flag Product'}
                            >
                              <Flag className="w-3.5 h-3.5" />
                              <span>{prod.isFlagged ? 'Unflag' : 'Flag'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onRemoveProduct(prod.id)}
                              className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg text-xs transition"
                              title="Delete Product from Marketplace"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PROMOTIONAL MARQUEE & DISCOUNTS MANAGER (UNLIMITED CREATION, MAX 3 ACTIVE) */}
        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Create Campaign Form */}
            <div className="lg:col-span-5">
              <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${isDark ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div className="border-b pb-3 border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold tracking-tight">Create Offer Campaign</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md text-[10px] font-bold font-mono">
                    UNLIMITED OFFERS
                  </span>
                </div>

                <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Discount Coupon Code *</label>
                    <input
                      type="text"
                      required
                      value={campaignForm.code}
                      onChange={(e) => setCampaignForm({ ...campaignForm, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. MEGA50"
                      className={`w-full px-3.5 py-2.5 border rounded-xl font-mono font-bold outline-none uppercase transition ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Discount Percentage (%) *</label>
                    <div className="relative">
                      <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="number"
                        min="1"
                        max="90"
                        required
                        value={campaignForm.discountPercent}
                        onChange={(e) => setCampaignForm({ ...campaignForm, discountPercent: e.target.value })}
                        placeholder="25"
                        className={`w-full pl-9 pr-3.5 py-2.5 border rounded-xl font-mono font-bold outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Marquee Scrolling Announcement Text *</label>
                    <textarea
                      rows={3}
                      required
                      value={campaignForm.announcementText}
                      onChange={(e) => setCampaignForm({ ...campaignForm, announcementText: e.target.value })}
                      placeholder="🔥 VIP Exclusive Deal: Get 25% OFF with coupon code MEGA50 on all smart home electronics!"
                      className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition resize-none ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create & Save New Offer</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Existing Campaigns Directory */}
            <div className="lg:col-span-7">
              <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${isDark ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div className="border-b pb-3 border-slate-800 flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                    <Radio className="w-5 h-5 text-cyan-400" />
                    <span>Campaigns Directory ({campaigns.length} Total)</span>
                  </h3>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-bold font-mono">
                    {activeCampaignsCount}/3 ACTIVE ON MARQUEE
                  </span>
                </div>

                {campaigns.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 space-y-2">
                    <Sparkles className="w-10 h-10 mx-auto text-slate-600" />
                    <p className="font-semibold text-xs text-slate-300">No campaigns created yet</p>
                    <p className="text-[11px]">Add campaigns to cycle scrolling announcement offers at the top of the site.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {campaigns.map((camp) => (
                      <div
                        key={camp.id}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                          camp.isBestOffer
                            ? 'bg-gradient-to-r from-amber-950/60 via-rose-950/60 to-slate-900 border-amber-500/80 ring-1 ring-amber-500/40'
                            : camp.isActive
                            ? 'bg-gradient-to-r from-cyan-950/60 via-indigo-950/60 to-slate-900 border-cyan-500/80'
                            : isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded font-mono font-black text-xs">
                              {camp.code} ({camp.discountPercent}% OFF)
                            </span>

                            {camp.isBestOffer && (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> STOREFRONT BEST OFFER TOAST
                              </span>
                            )}

                            {camp.isActive && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-bold flex items-center gap-1">
                                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> LIVE ON MARQUEE
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-white truncate">{camp.announcementText}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                          {/* Toggle Active (Max 3) */}
                          <button
                            type="button"
                            onClick={() => onToggleActiveCampaign(camp.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow transition flex items-center gap-1 ${
                              camp.isActive
                                ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            <span>{camp.isActive ? 'Deactivate' : 'Set Active'}</span>
                          </button>

                          {/* Set as Best Offer */}
                          <button
                            type="button"
                            onClick={() => onSetBestOfferCampaign(camp.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 ${
                              camp.isBestOffer
                                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                                : 'bg-slate-800 hover:bg-amber-950 text-slate-300 hover:text-amber-300 border border-slate-700'
                            }`}
                            title="Push as featured Best Offer toast on storefront"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>{camp.isBestOffer ? 'Best Offer' : 'Push Best Offer'}</span>
                          </button>

                          {/* Remove Campaign */}
                          <button
                            type="button"
                            onClick={() => onRemoveCampaign(camp.id)}
                            className="p-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-xl text-xs transition"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADMIN ADD PRODUCT MODAL */}
      {isAdminAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-cyan-400" />
                <span>Admin Direct Product Creation</span>
              </h3>
              <button type="button" onClick={() => setIsAdminAddModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleAdminSubmitProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="e.g. Fluka Pro Desk Charger"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Assigned Vendor / Seller</label>
                  <input
                    type="text"
                    value={newProductForm.vendorName}
                    onChange={(e) => setNewProductForm({ ...newProductForm, vendorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as ProductCategory })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Selling Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    placeholder="85000"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Original Price (Strikethrough ₦)</label>
                  <input
                    type="number"
                    value={newProductForm.originalPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: e.target.value })}
                    placeholder="110000"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Image Preset / URL</label>
                <input
                  type="text"
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px] outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <Upload className="w-4 h-4" />
                <span>Publish Directly to Marketplace</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
