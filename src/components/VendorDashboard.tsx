import React, { useState, useEffect } from 'react';
import {
  Store,
  PlusCircle,
  Package,
  Star,
  CheckCircle2,
  Trash2,
  Tag,
  Boxes,
  Edit3,
  FileEdit,
  Send,
  AlertCircle,
  X,
  Eye,
  Sparkles,
  LogOut,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import type { Product, ProductCategory, ThemeMode, VendorStore } from '../types/store';
import { CATEGORIES } from '../data/products';
import { ProductQuickView } from './ProductQuickView';

interface VendorDashboardProps {
  products: Product[];
  registeredVendors: VendorStore[];
  onRegisterVendorStore: (store: VendorStore) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  theme?: ThemeMode;
}

const PRESET_SAMPLE_IMAGES = [
  { label: 'Headphones / Audio', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Smartwatch / Wearable', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mechanical Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Smart Ambient Lamp', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Studio Speakers', url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Power Bank Charger', url: 'https://images.unsplash.com/photo-1609592424074-275eb1432f83?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ergonomic Mouse', url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80' },
];

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  products,
  registeredVendors,
  onRegisterVendorStore,
  onAddProduct,
  onUpdateProduct,
  onRemoveProduct,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  // Active Logged-in Vendor Session
  const [activeVendorId, setActiveVendorId] = useState<string | null>(() => {
    return localStorage.getItem('fluka_active_vendor_id');
  });

  const activeVendor = registeredVendors.find((v) => v.id === activeVendorId) || null;

  const [regForm, setRegForm] = useState({
    storeName: '',
    email: '',
    phone: '',
    category: 'Electronics & Audio',
    description: '',
  });

  // Isolated Drafts Queue per Vendor Account
  const [draftProducts, setDraftProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (activeVendorId) {
      const saved = localStorage.getItem(`fluka_drafts_${activeVendorId}`);
      setDraftProducts(saved ? JSON.parse(saved) : []);
    } else {
      setDraftProducts([]);
    }
  }, [activeVendorId]);

  useEffect(() => {
    if (activeVendorId) {
      localStorage.setItem(`fluka_drafts_${activeVendorId}`, JSON.stringify(draftProducts));
    }
  }, [draftProducts, activeVendorId]);

  // Product Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingPublished, setIsEditingPublished] = useState(false);

  // Buyer Preview Product State
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    tagline: '',
    category: 'Audio' as ProductCategory,
    price: '',
    originalPrice: '',
    stockQuantity: '25',
    image: PRESET_SAMPLE_IMAGES[0].url,
    description: '',
    specKey: 'Warranty',
    specValue: '2 Years Direct Manufacturer',
  });

  const [notificationMsg, setNotificationMsg] = useState('');
  const [publishConfirmModal, setPublishConfirmModal] = useState<{
    isOpen: boolean;
    type: 'single' | 'all';
    product?: Product;
  }>({ isOpen: false, type: 'all' });

  // Vendor registration handler
  const handleRegisterVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.storeName || !regForm.email) return;

    const newStore: VendorStore = {
      id: `vnd-${Date.now()}`,
      storeName: regForm.storeName,
      email: regForm.email,
      phone: regForm.phone || '+234 800 000 0000',
      category: regForm.category,
      description: regForm.description || 'Verified seller on Fluka Marketplace.',
      rating: 0.0,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      totalSales: 0,
      completedOrders: 0,
      isVerified: false,
    };

    onRegisterVendorStore(newStore);
    setActiveVendorId(newStore.id);
    localStorage.setItem('fluka_active_vendor_id', newStore.id);

    setRegForm({
      storeName: '',
      email: '',
      phone: '',
      category: 'Electronics & Audio',
      description: '',
    });
  };

  // Vendor Log Out
  const handleLogOut = () => {
    setActiveVendorId(null);
    localStorage.removeItem('fluka_active_vendor_id');
  };

  // Switch to an existing registered vendor store
  const handleSwitchStore = (vendorId: string) => {
    setActiveVendorId(vendorId);
    localStorage.setItem('fluka_active_vendor_id', vendorId);
  };

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 3500);
  };

  // 1. Save to Draft Queue
  const handleSaveToDraftQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name || !uploadForm.price || !activeVendor) {
      alert('Please enter product name and price.');
      return;
    }

    const priceNum = parseFloat(uploadForm.price) || 0;
    const origPriceNum = uploadForm.originalPrice ? parseFloat(uploadForm.originalPrice) : undefined;
    const stockNum = parseInt(uploadForm.stockQuantity, 10) || 10;

    if (editingId && !isEditingPublished) {
      // Update existing draft in queue
      setDraftProducts((prev) =>
        prev.map((d) =>
          d.id === editingId
            ? {
                ...d,
                name: uploadForm.name,
                tagline: uploadForm.tagline || d.tagline,
                category: uploadForm.category,
                price: priceNum,
                originalPrice: origPriceNum && origPriceNum > priceNum ? origPriceNum : undefined,
                stockQuantity: stockNum,
                image: uploadForm.image || d.image,
                description: uploadForm.description || d.description,
                specs: {
                  ...d.specs,
                  [uploadForm.specKey || 'Warranty']: uploadForm.specValue || '1 Year Vendor Guarantee',
                },
              }
            : d
        )
      );
      showNotification('Draft updated successfully in your queue.');
    } else if (editingId && isEditingPublished) {
      // Update existing published product directly
      const updatedProd: Product = {
        id: editingId,
        name: uploadForm.name,
        tagline: uploadForm.tagline || 'High quality tech accessory',
        category: uploadForm.category,
        price: priceNum,
        originalPrice: origPriceNum && origPriceNum > priceNum ? origPriceNum : undefined,
        rating: 0.0,
        reviewCount: 0,
        image: uploadForm.image || PRESET_SAMPLE_IMAGES[0].url,
        description: uploadForm.description || 'Verified product listed by vendor merchant.',
        specs: {
          [uploadForm.specKey || 'Warranty']: uploadForm.specValue || '1 Year Vendor Guarantee',
          Seller: activeVendor.storeName,
        },
        inStock: stockNum > 0,
        stockQuantity: stockNum,
        vendorName: activeVendor.storeName,
      };
      onUpdateProduct(updatedProd);
      showNotification('Published product updated successfully on Marketplace!');
    } else {
      // Save new product draft
      const newDraft: Product = {
        id: `flk-draft-${Date.now()}`,
        name: uploadForm.name,
        tagline: uploadForm.tagline || 'High quality tech accessory',
        category: uploadForm.category,
        price: priceNum,
        originalPrice: origPriceNum && origPriceNum > priceNum ? origPriceNum : undefined,
        rating: 0.0,
        reviewCount: 0,
        image: uploadForm.image || PRESET_SAMPLE_IMAGES[0].url,
        description: uploadForm.description || 'Draft product saved in vendor queue.',
        specs: {
          [uploadForm.specKey || 'Warranty']: uploadForm.specValue || '1 Year Vendor Guarantee',
          Seller: activeVendor.storeName,
        },
        inStock: stockNum > 0,
        stockQuantity: stockNum,
        vendorName: activeVendor.storeName,
        isNew: true,
      };

      setDraftProducts((prev) => [newDraft, ...prev]);
      showNotification('Product saved to Draft Queue! Review or edit before pushing live.');
    }

    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setIsEditingPublished(false);
    setUploadForm({
      name: '',
      tagline: '',
      category: 'Audio',
      price: '',
      originalPrice: '',
      stockQuantity: '25',
      image: PRESET_SAMPLE_IMAGES[0].url,
      description: '',
      specKey: 'Warranty',
      specValue: '2 Years Direct Manufacturer',
    });
  };

  const handleStartEdit = (product: Product, isPublished: boolean) => {
    setEditingId(product.id);
    setIsEditingPublished(isPublished);
    setUploadForm({
      name: product.name,
      tagline: product.tagline || '',
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      stockQuantity: (product.stockQuantity || 25).toString(),
      image: product.image,
      description: product.description,
      specKey: Object.keys(product.specs)[0] || 'Warranty',
      specValue: Object.values(product.specs)[0] || '2 Years Direct Manufacturer',
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handlePreviewCurrentForm = () => {
    const priceNum = parseFloat(uploadForm.price) || 85000;
    const origPriceNum = uploadForm.originalPrice ? parseFloat(uploadForm.originalPrice) : undefined;
    const tempProduct: Product = {
      id: 'temp-preview',
      name: uploadForm.name || 'Untitled Vendor Product',
      tagline: uploadForm.tagline || 'Sample product tagline',
      category: uploadForm.category,
      price: priceNum,
      originalPrice: origPriceNum && origPriceNum > priceNum ? origPriceNum : undefined,
      rating: 0.0,
      reviewCount: 0,
      image: uploadForm.image || PRESET_SAMPLE_IMAGES[0].url,
      description: uploadForm.description || 'Sample product description for buyer preview.',
      specs: {
        [uploadForm.specKey || 'Warranty']: uploadForm.specValue || '2 Years Direct Manufacturer',
        Seller: activeVendor?.storeName || 'Merchant Vendor',
      },
      inStock: true,
      stockQuantity: parseInt(uploadForm.stockQuantity, 10) || 25,
      vendorName: activeVendor?.storeName || 'Merchant Vendor',
      isNew: true,
    };
    setPreviewProduct(tempProduct);
  };

  const handleDeleteDraft = (draftId: string) => {
    setDraftProducts((prev) => prev.filter((d) => d.id !== draftId));
    showNotification('Draft deleted from queue.');
  };

  const handleExecutePublish = () => {
    if (publishConfirmModal.type === 'single' && publishConfirmModal.product) {
      onAddProduct(publishConfirmModal.product);
      setDraftProducts((prev) => prev.filter((d) => d.id !== publishConfirmModal.product?.id));
      showNotification(`"${publishConfirmModal.product.name}" published live to Marketplace!`);
    } else if (publishConfirmModal.type === 'all') {
      draftProducts.forEach((d) => onAddProduct(d));
      setDraftProducts([]);
      showNotification(`All ${draftProducts.length} drafts published live to Fluka Marketplace!`);
    }
    setPublishConfirmModal({ isOpen: false, type: 'all' });
  };

  // Filter active vendor's published products
  const vendorPublishedProducts = products.filter(
    (p) => p.vendorName?.toLowerCase() === activeVendor?.storeName.toLowerCase()
  );

  const priceVal = parseFloat(uploadForm.price) || 0;
  const origPriceVal = parseFloat(uploadForm.originalPrice) || 0;
  const discountPreview = origPriceVal > priceVal && priceVal > 0
    ? Math.round(((origPriceVal - priceVal) / origPriceVal) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Notification Banner */}
      {notificationMsg && (
        <div className="p-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold text-xs rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-200" />
            <span>{notificationMsg}</span>
          </div>
          <button type="button" onClick={() => setNotificationMsg('')}>
            <X className="w-4 h-4 opacity-80 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* 1. VENDOR REGISTRATION / ACCOUNT SWITCHER SCREEN (IF LOGGED OUT) */}
      {!activeVendor ? (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Quick Account Switcher (if registered stores exist) */}
          {registeredVendors.length > 0 && (
            <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Log In to an Existing Merchant Account</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {registeredVendors.map((vendor) => (
                  <button
                    key={vendor.id}
                    type="button"
                    onClick={() => handleSwitchStore(vendor.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
                      isDark ? 'bg-slate-950/80 border-slate-800 hover:border-cyan-500' : 'bg-slate-50 border-slate-200 hover:border-cyan-600'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-white text-xs">{vendor.storeName}</h4>
                      <p className="text-[10px] text-slate-400">{vendor.email}</p>
                    </div>
                    <span className="px-2 py-1 bg-cyan-600 text-white font-bold rounded-lg text-[10px]">
                      Log In
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* New Vendor Registration Form */}
          <div
            className={`border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 ${
              isDark ? 'bg-slate-900/90 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <div className={`h-full w-full rounded-[14px] flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                  <Store className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <h2 className="text-2xl font-black tracking-tight">Register New Vendor Storefront</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Join hundreds of tech brands selling direct to customers on Fluka Marketplace.
              </p>
            </div>

            <form onSubmit={handleRegisterVendor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Store / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.storeName}
                    onChange={(e) => setRegForm({ ...regForm, storeName: e.target.value })}
                    placeholder="e.g. Apex Electronics"
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Vendor Email *</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="merchant@store.com"
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="+234 800 000 0000"
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Primary Store Category</label>
                  <input
                    type="text"
                    value={regForm.category}
                    onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Store Description</label>
                <textarea
                  rows={3}
                  value={regForm.description}
                  onChange={(e) => setRegForm({ ...regForm, description: e.target.value })}
                  placeholder="Tell customers about your products and brand..."
                  className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition resize-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Register & Open Storefront</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* 2. ACTIVE LOGGED-IN VENDOR DASHBOARD */
        <div className="space-y-8">
          {/* Header Store Banner with Log Out / Account Switcher */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden ${
              isDark ? 'bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-cyan-500/20">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight">{activeVendor.storeName}</h1>
                  {activeVendor.isVerified ? (
                    <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" /> VERIFIED MERCHANT
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md text-[10px] font-bold">
                      PENDING VERIFICATION
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{activeVendor.description}</p>
              </div>
            </div>

            {/* Quick Metrics & Logout Button */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full md:w-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto text-xs">
                <div className={`p-3 rounded-2xl border text-center ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <Package className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="font-mono font-bold text-sm block">{vendorPublishedProducts.length}</span>
                  <span className="text-[10px] text-slate-500">Live Products</span>
                </div>
                <div className={`p-3 rounded-2xl border text-center ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <FileEdit className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span className="font-mono font-bold text-sm text-amber-400 block">{draftProducts.length}</span>
                  <span className="text-[10px] text-slate-500">Draft Queue</span>
                </div>
                <div className={`p-3 rounded-2xl border text-center ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="w-4 h-4 text-emerald-400 font-black block mx-auto mb-1">₦</span>
                  <span className="font-mono font-bold text-sm text-emerald-400 block">₦{(activeVendor.totalSales || 0).toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500">Total Revenue</span>
                </div>
                <div className={`p-3 rounded-2xl border text-center ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto mb-1" />
                  <span className="font-mono font-bold text-sm text-amber-400 block">
                    {activeVendor.rating > 0 ? `${activeVendor.rating} ★` : '0.0 ★'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {activeVendor.rating > 0 ? 'Seller Rating' : 'No Ratings Yet'}
                  </span>
                </div>
              </div>

              {/* Log Out & Switch Account Button */}
              <button
                type="button"
                onClick={handleLogOut}
                className="px-3.5 py-2 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap"
                title="Log out of current store session"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Form + Draft Queue & Published Products */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Product Form */}
            <div className="lg:col-span-6 space-y-4">
              <div
                className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-800">
                  <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                    {editingId ? (
                      <Edit3 className="w-5 h-5 text-amber-400" />
                    ) : (
                      <PlusCircle className="w-5 h-5 text-cyan-400" />
                    )}
                    <span>
                      {editingId
                        ? isEditingPublished
                          ? 'Edit Published Product'
                          : 'Edit Draft Product'
                        : 'Create Product Draft'}
                    </span>
                  </h3>

                  <div className="flex items-center gap-2">
                    {/* Live Buyer View Preview Trigger Button */}
                    <button
                      type="button"
                      onClick={handlePreviewCurrentForm}
                      className="flex items-center gap-1 px-3 py-1 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded-lg text-xs font-semibold transition"
                      title="Preview how this product looks to buyers"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Preview as Buyer</span>
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSaveToDraftQueue} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                      placeholder="e.g. CyberDesk Ergonomic Mechanical Keyboard"
                      className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Category</label>
                      <select
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as ProductCategory })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      >
                        {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={uploadForm.stockQuantity}
                        onChange={(e) => setUploadForm({ ...uploadForm, stockQuantity: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Pricing Breakdown with Naira (₦) & Discount Calculator */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Discounted Selling Price (₦) *</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={uploadForm.price}
                        onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                        placeholder="85000"
                        className={`w-full px-3.5 py-2.5 border rounded-xl font-mono font-bold outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Original Price (Strikethrough ₦)</label>
                      <input
                        type="number"
                        step="any"
                        value={uploadForm.originalPrice}
                        onChange={(e) => setUploadForm({ ...uploadForm, originalPrice: e.target.value })}
                        placeholder="110000"
                        className={`w-full px-3.5 py-2.5 border rounded-xl font-mono font-bold outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                  </div>

                  {discountPreview > 0 && (
                    <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-400 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4" /> Live Discount Badge Preview:
                      </span>
                      <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-xs font-mono">
                        -{discountPreview}% OFF
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold mb-1">Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={uploadForm.tagline}
                      onChange={(e) => setUploadForm({ ...uploadForm, tagline: e.target.value })}
                      placeholder="e.g. Ultra-responsive 8,000 DPI sensor"
                      className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      }`}
                    />
                  </div>

                  {/* Preset Image Picker */}
                  <div>
                    <label className="block font-semibold mb-1">Product Image URL / Preset</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={uploadForm.image}
                        onChange={(e) => setUploadForm({ ...uploadForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className={`w-full px-3.5 py-2.5 border rounded-xl font-mono text-[11px] outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />

                      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                        <span className="text-slate-500 whitespace-nowrap">Presets:</span>
                        {PRESET_SAMPLE_IMAGES.map((img) => (
                          <button
                            key={img.label}
                            type="button"
                            onClick={() => setUploadForm({ ...uploadForm, image: img.url })}
                            className={`px-2 py-1 rounded-lg border whitespace-nowrap transition ${
                              uploadForm.image === img.url
                                ? 'bg-cyan-600 text-white border-cyan-500'
                                : isDark ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Product Description</label>
                    <textarea
                      rows={3}
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      placeholder="Detailed product highlights..."
                      className={`w-full px-3.5 py-2.5 border rounded-xl font-medium outline-none transition resize-none ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      }`}
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 px-4 bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-600 hover:from-amber-400 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FileEdit className="w-4 h-4" />
                      <span>
                        {editingId
                          ? isEditingPublished
                            ? 'Update Published Product Listing'
                            : 'Update Saved Draft'
                          : 'Save Product to Draft Queue'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Draft Queue & Published Products */}
            <div className="lg:col-span-6 space-y-6">
              {/* UNPUBLISHED DRAFTS QUEUE */}
              <div
                className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileEdit className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold tracking-tight">Drafts Queue ({draftProducts.length})</h3>
                  </div>

                  {draftProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPublishConfirmModal({ isOpen: true, type: 'all' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish All Live ({draftProducts.length})</span>
                    </button>
                  )}
                </div>

                {draftProducts.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 space-y-1">
                    <p className="font-semibold text-xs text-slate-400">No unpublished drafts in queue</p>
                    <p className="text-[11px]">Save products to your queue to inspect, edit, or batch publish later.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {draftProducts.map((draft) => (
                      <div
                        key={draft.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <img
                          src={draft.image}
                          alt={draft.name}
                          className="w-12 h-12 object-cover rounded-xl bg-slate-900 border border-slate-800"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-white truncate">{draft.name}</h4>
                            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px] font-bold">
                              DRAFT
                            </span>
                          </div>
                          <p className="text-xs font-mono font-bold text-cyan-400 mt-0.5">₦{draft.price.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Buyer Preview Button */}
                          <button
                            type="button"
                            onClick={() => setPreviewProduct(draft)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs"
                            title="Buyer Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartEdit(draft, false)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                            title="Edit Draft"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setPublishConfirmModal({ isOpen: true, type: 'single', product: draft })}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs"
                            title="Publish Live"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg text-xs"
                            title="Delete Draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PUBLISHED LIVE PRODUCTS TABLE (SHOWS ADMIN FLAGGED ALERTS) */}
              <div
                className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-800">
                  <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-indigo-400" />
                    <span>Live Marketplace Listings ({vendorPublishedProducts.length})</span>
                  </h3>
                </div>

                {vendorPublishedProducts.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 space-y-2">
                    <Package className="w-10 h-10 mx-auto text-slate-600" />
                    <p className="font-semibold text-xs text-slate-300">No live published products</p>
                    <p className="text-[11px]">Publish your drafted products to display them on Fluka Marketplace.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {vendorPublishedProducts.map((product) => {
                      const discount = product.originalPrice
                        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                        : 0;

                      return (
                        <div
                          key={product.id}
                          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                            product.isFlagged
                              ? 'bg-rose-950/30 border-rose-600/80'
                              : isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-xl bg-slate-900 border border-slate-800"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-xs text-white truncate">{product.name}</h4>
                                {product.isFlagged && (
                                  <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[9px] font-extrabold flex items-center gap-1 shrink-0">
                                    <AlertTriangle className="w-3 h-3" /> FLAGGED BY ADMIN
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-cyan-400 font-semibold">{product.category}</p>
                              <div className="flex items-baseline gap-1.5 mt-0.5 font-mono text-xs">
                                <span className="font-bold text-white">₦{product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                  <span className="text-[10px] text-slate-500 line-through">
                                    ₦{product.originalPrice.toLocaleString()}
                                  </span>
                                )}
                                {discount > 0 && (
                                  <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold">
                                    -{discount}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            {/* Buyer Preview Button */}
                            <button
                              type="button"
                              onClick={() => setPreviewProduct(product)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs"
                              title="Buyer Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEdit(product, true)}
                              className="p-1.5 bg-slate-800 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs"
                              title="Edit Live Listing"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onRemoveProduct(product.id)}
                              className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg text-xs"
                              title="Delete Live Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUYER VIEW PREVIEW MODAL */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-3xl space-y-2">
            <div className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-2xl flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
                <span>BUYER PREVIEW MODE: Exact View as Customers See It</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="px-2.5 py-0.5 bg-slate-950/60 hover:bg-slate-950 text-white rounded-lg text-xs"
              >
                Close Preview
              </button>
            </div>

            <ProductQuickView
              product={previewProduct}
              onClose={() => setPreviewProduct(null)}
              onAddToCart={() => {}}
              isWishlisted={false}
              onToggleWishlist={() => {}}
              theme={theme}
            />
          </div>
        </div>
      )}

      {/* DOUBLE VERIFICATION PUBLISH MODAL */}
      {publishConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-center text-slate-200 space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
              <AlertCircle className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">Confirm Marketplace Push</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {publishConfirmModal.type === 'single'
                  ? `Are you sure you want to push "${publishConfirmModal.product?.name}" live to Fluka Marketplace?`
                  : `Are you sure you want to push all ${draftProducts.length} drafted products live to Fluka Marketplace?`}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPublishConfirmModal({ isOpen: false, type: 'all' })}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecutePublish}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Confirm & Push Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
