import { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductQuickView } from './components/ProductQuickView';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { InstallPwaModal } from './components/InstallPwaModal';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { BestOfferNotification } from './components/BestOfferNotification';
import { Footer } from './components/Footer';

import type { Product, CartItem, ProductCategory, OrderState, ThemeMode, VendorStore, DiscountCampaign } from './types/store';
import { PRODUCTS } from './data/products';
import { SlidersHorizontal, PackageX } from 'lucide-react';

const INITIAL_VENDORS: VendorStore[] = [
  {
    id: 'vnd-001',
    storeName: 'Fluka Official',
    email: 'official@fluka.tech',
    phone: '+234 800 358 5200',
    category: 'Flagship Hardware & Audio',
    description: 'Official flagship store for Fluka products.',
    rating: 4.9,
    joinedDate: 'Jan 2026',
    totalSales: 4500000,
    completedOrders: 320,
    isVerified: true,
  },
  {
    id: 'vnd-002',
    storeName: 'Apex Electronics',
    email: 'contact@apexelectronics.ng',
    phone: '+234 802 111 2233',
    category: 'Wearables & Smartwatches',
    description: 'Premium titanium smartwatches & sports accessories.',
    rating: 4.8,
    joinedDate: 'Feb 2026',
    totalSales: 2800000,
    completedOrders: 185,
    isVerified: true,
  },
  {
    id: 'vnd-003',
    storeName: 'CyberGear Store',
    email: 'sales@cybergear.ng',
    phone: '+234 805 444 5566',
    category: 'Ergonomic Keyboards & Mice',
    description: 'Custom mechanical keyboards and wireless mice.',
    rating: 4.9,
    joinedDate: 'Mar 2026',
    totalSales: 1950000,
    completedOrders: 140,
    isVerified: true,
  },
  {
    id: 'vnd-004',
    storeName: 'Nexus Home Direct',
    email: 'support@nexushome.io',
    phone: '+234 809 777 8899',
    category: 'Smart Home & Lighting',
    description: 'Smart ambient lamps and air purifiers.',
    rating: 4.7,
    joinedDate: 'Apr 2026',
    totalSales: 1200000,
    completedOrders: 92,
    isVerified: false,
  },
];

const INITIAL_CAMPAIGNS: DiscountCampaign[] = [
  {
    id: 'cmp-001',
    code: 'FLUKA10',
    discountPercent: 10,
    announcementText: '🔥 Summer Tech Flash Sale: Instant 10% OFF on all flagship headsets & smartwatch gear!',
    isActive: true,
    isBestOffer: true,
  },
  {
    id: 'cmp-002',
    code: 'MEGA25',
    discountPercent: 25,
    announcementText: '⚡ VIP Merchant Offer: Enjoy 25% OFF with coupon code MEGA25 on orders over ₦100,000!',
    isActive: true,
    isBestOffer: false,
  },
];

const getInitialPortalView = (): 'store' | 'vendor' | 'admin' => {
  const hostname = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();

  // Pure domain-based routing detection
  if (hostname.includes('vendor')) {
    return 'vendor';
  }
  if (hostname.includes('admin')) {
    return 'admin';
  }

  // Path-based routing fallback (/vendor, /admin)
  if (pathname.startsWith('/vendor')) return 'vendor';
  if (pathname.startsWith('/admin')) return 'admin';

  return 'store';
};

export function App() {
  // Domain & Subrouting Navigation View State ('store' | 'vendor' | 'admin')
  const [activeView, setActiveView] = useState<'store' | 'vendor' | 'admin'>(getInitialPortalView);

  // Admin Security Authentication Session Gate (Requires ADMIN / ADMIN)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('fluka_admin_auth') === 'true';
  });

  const handleAdminLoginSuccess = useCallback(() => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('fluka_admin_auth', 'true');
  }, []);

  const handleAdminLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('fluka_admin_auth');
  }, []);

  // Listen for browser back / forward navigation and domain subrouting
  useEffect(() => {
    const handlePopState = () => {
      setActiveView(getInitialPortalView());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Unlimited Promotional Campaigns State (Max 3 Active Offers, Admin Best Offer Selection)
  const [campaignsList, setCampaignsList] = useState<DiscountCampaign[]>(() => {
    const saved = localStorage.getItem('fluka_campaigns_list');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  useEffect(() => {
    localStorage.setItem('fluka_campaigns_list', JSON.stringify(campaignsList));
  }, [campaignsList]);

  // Active Marquee Campaigns (Up to 3 active)
  const activeCampaigns = useMemo(() => {
    return campaignsList.filter((c) => c.isActive).slice(0, 3);
  }, [campaignsList]);

  // Featured Storefront Best Offer Campaign
  const bestOfferCampaign = useMemo(() => {
    return campaignsList.find((c) => c.isBestOffer) || activeCampaigns[0] || campaignsList[0] || null;
  }, [campaignsList, activeCampaigns]);

  const handleAddCampaign = useCallback((newCampaign: DiscountCampaign) => {
    setCampaignsList((prev) => [newCampaign, ...prev]);
  }, []);

  const handleToggleActiveCampaign = useCallback((campaignId: string) => {
    setCampaignsList((prev) => {
      const target = prev.find((c) => c.id === campaignId);
      if (!target) return prev;
      if (!target.isActive) {
        const currentActiveCount = prev.filter((c) => c.isActive).length;
        if (currentActiveCount >= 3) {
          alert('Maximum 3 Active Offers Allowed on Marquee: Please deactivate an existing offer first.');
          return prev;
        }
      }
      return prev.map((c) => (c.id === campaignId ? { ...c, isActive: !c.isActive } : c));
    });
  }, []);

  const handleSetBestOfferCampaign = useCallback((campaignId: string) => {
    setCampaignsList((prev) =>
      prev.map((c) => ({
        ...c,
        isBestOffer: c.id === campaignId,
      }))
    );
  }, []);

  const handleRemoveCampaign = useCallback((campaignId: string) => {
    setCampaignsList((prev) => prev.filter((c) => c.id !== campaignId));
  }, []);

  // Registered Vendors State
  const [vendorsList, setVendorsList] = useState<VendorStore[]>(() => {
    const saved = localStorage.getItem('fluka_vendors_list');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  useEffect(() => {
    localStorage.setItem('fluka_vendors_list', JSON.stringify(vendorsList));
  }, [vendorsList]);

  const handleRegisterVendorStore = useCallback((newStore: VendorStore) => {
    setVendorsList((prev) => [newStore, ...prev]);
  }, []);

  // Dynamic Shared Product Catalog State
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fluka_products_catalog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return PRODUCTS;
      }
    }
    return PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('fluka_products_catalog', JSON.stringify(productsList));
  }, [productsList]);

  // Vendor Action Handlers (Admin Control)
  const handleToggleVerifyVendor = useCallback((vendorId: string) => {
    setVendorsList((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, isVerified: !v.isVerified } : v))
    );
  }, []);

  const handleToggleFlagVendor = useCallback((vendorId: string) => {
    setVendorsList((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, isFlagged: !v.isFlagged } : v))
    );
  }, []);

  const handleRemoveVendor = useCallback((vendorId: string) => {
    setVendorsList((prev) => {
      const vendorToRemove = prev.find((v) => v.id === vendorId);
      if (!vendorToRemove) return prev;
      if (confirm(`Deregister vendor "${vendorToRemove.storeName}" and remove all listed products?`)) {
        setProductsList((prods) =>
          prods.filter((p) => p.vendorName?.toLowerCase() !== vendorToRemove.storeName.toLowerCase())
        );
        return prev.filter((v) => v.id !== vendorId);
      }
      return prev;
    });
  }, []);

  // Product Action Handlers (Admin Control)
  const handleToggleFlagProduct = useCallback((productId: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isFlagged: !p.isFlagged } : p))
    );
  }, []);

  const handleAddVendorProduct = useCallback((newProduct: Product) => {
    setProductsList((prev) => [newProduct, ...prev]);
  }, []);

  const handleUpdateVendorProduct = useCallback((updatedProduct: Product) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  }, []);

  const handleRemoveVendorProduct = useCallback((productId: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('fluka_theme');
    return (saved as ThemeMode) || 'dark';
  });

  const isDark = theme === 'dark';

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('fluka_theme', nextTheme);
      return nextTheme;
    });
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // PWA Install State & Event Listener
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        }
        setDeferredPrompt(null);
        setIsInstallModalOpen(false);
      });
    } else {
      setIsInstallModalOpen(true);
    }
  }, [deferredPrompt]);

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  
  // Cart & Wishlist start clean from 0 for first-time visitors
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderState | null>(null);
  
  // Dynamic active coupon code initialized to best offer code
  const [couponCode, setCouponCode] = useState(() => bestOfferCampaign?.code || 'FLUKA10');

  useEffect(() => {
    if (bestOfferCampaign) {
      setCouponCode(bestOfferCampaign.code);
    }
  }, [bestOfferCampaign]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.vendorName && product.vendorName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [productsList, searchQuery, selectedCategory, sortBy]);

  // Wishlist Favorited Products List
  const wishlistProducts = useMemo(() => {
    return productsList.filter((p) => wishlistIds.includes(p.id));
  }, [productsList, wishlistIds]);

  // Cart Operations Memoized
  const handleAddToCart = useCallback((
    product: Product,
    quantity: number = 1,
    selectedColor?: string
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedColor }];
    });
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const handleRemoveCartItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  // Wishlist Operations Memoized
  const handleToggleWishlist = useCallback((product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  }, []);

  const handleRemoveWishlistItem = useCallback((product: Product) => {
    setWishlistIds((prev) => prev.filter((id) => id !== product.id));
  }, []);

  const handleMoveWishlistToCart = useCallback((product: Product) => {
    handleAddToCart(product, 1);
    setWishlistIds((prev) => prev.filter((id) => id !== product.id));
  }, [handleAddToCart]);

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  // Subtotal & Calculations with Dynamic Campaign Percentage
  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  const cartSubtotal = useMemo(() => cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  ), [cartItems]);

  const matchedCampaign = useMemo(() => campaignsList.find((c) => c.code.toUpperCase() === couponCode.toUpperCase()), [campaignsList, couponCode]);
  const activeDiscountRate = matchedCampaign ? matchedCampaign.discountPercent / 100 : 0.10;
  const discountAmount = cartSubtotal > 0 ? cartSubtotal * activeDiscountRate : 0;

  // Checkout trigger
  const handleProceedToCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);

  const handleCompleteOrder = useCallback((order: OrderState) => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    setCompletedOrder(order);
  }, []);

  const handleApplyBestOffer = useCallback((code: string) => {
    setCouponCode(code);
    setIsCartOpen(true);
  }, []);

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-[#070a12] text-slate-100 selection:bg-cyan-500 selection:text-slate-950' : 'bg-slate-50 text-slate-900 selection:bg-cyan-600 selection:text-white'
      }`}
    >
      {/* Top Header & Dynamic Animated Marquee Banner */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        cartSubtotal={cartSubtotal}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenInstallPwa={() => setIsInstallModalOpen(true)}
        activeView={activeView}
        onSwitchView={setActiveView}
        activeCampaigns={activeCampaigns}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* VIEW 1: CUSTOMER STOREFRONT (/) */}
        {activeView === 'store' ? (
          <>
            {/* Hero Section */}
            {!searchQuery && selectedCategory === 'All' && (
              <HeroBanner
                theme={theme}
                onShopClick={() => {
                  const catalogEl = document.getElementById('catalog-grid');
                  catalogEl?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            )}

            {/* Catalog Section Header & Sorting */}
            <div id="catalog-grid" className="scroll-mt-24 space-y-4">
              <div
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h2
                    className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <span>{selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Collection`}</span>
                    <span
                      className={`text-xs font-mono font-medium border px-2.5 py-0.5 rounded-full ${
                        isDark ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-slate-600 bg-slate-100 border-slate-200'
                      }`}
                    >
                      {filteredProducts.length} items
                    </span>
                  </h2>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Explore high-grade audio, ergonomics, and smart ecosystem gear from verified merchants.
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                  <SlidersHorizontal className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span className={`font-medium hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Sort By:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                    }`}
                  >
                    <option value="featured">Featured Presets</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div
                  className={`py-20 text-center space-y-3 rounded-3xl border ${
                    isDark ? 'bg-slate-900/40 border-slate-800/80 text-slate-300' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                    <PackageX className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold">No products found</h3>
                  <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No items matched your search query "{searchQuery}". Try clearing filters or searching for headphones, smartwatches, or keyboards.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl transition"
                  >
                    Reset Search Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => {
                    const cartQty = cartItems.find((item) => item.product.id === product.id)?.quantity || 0;
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onQuickView={handleQuickView}
                        isWishlisted={wishlistIds.includes(product.id)}
                        onToggleWishlist={handleToggleWishlist}
                        cartQuantity={cartQty}
                        onUpdateQuantity={handleUpdateCartQuantity}
                        theme={theme}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : activeView === 'vendor' ? (
          /* VIEW 2: VENDOR PORTAL & DASHBOARD (/vendor) */
          <VendorDashboard
            products={productsList}
            registeredVendors={vendorsList}
            onRegisterVendorStore={handleRegisterVendorStore}
            onAddProduct={handleAddVendorProduct}
            onUpdateProduct={handleUpdateVendorProduct}
            onRemoveProduct={handleRemoveVendorProduct}
            theme={theme}
          />
        ) : (
          /* VIEW 3: ADMIN PORTAL & MARKETPLACE CONTROL (/admin) - SECURED BY AUTH GATE */
          !isAdminAuthenticated ? (
            <AdminLoginScreen
              onLoginSuccess={handleAdminLoginSuccess}
              theme={theme}
            />
          ) : (
            <AdminDashboard
              vendors={vendorsList}
              products={productsList}
              campaigns={campaignsList}
              onToggleVerifyVendor={handleToggleVerifyVendor}
              onToggleFlagVendor={handleToggleFlagVendor}
              onRemoveVendor={handleRemoveVendor}
              onToggleFlagProduct={handleToggleFlagProduct}
              onRemoveProduct={handleRemoveVendorProduct}
              onAddProduct={handleAddVendorProduct}
              onAddCampaign={handleAddCampaign}
              onToggleActiveCampaign={handleToggleActiveCampaign}
              onSetBestOfferCampaign={handleSetBestOfferCampaign}
              onRemoveCampaign={handleRemoveCampaign}
              onLogout={handleAdminLogout}
              theme={theme}
            />
          )
        )}
      </main>

      {/* Floating Storefront Best Offer Notification Toast */}
      {activeView === 'store' && (
        <BestOfferNotification
          campaign={bestOfferCampaign}
          onApplyCoupon={handleApplyBestOffer}
          theme={theme}
        />
      )}

      {/* Footer */}
      <Footer theme={theme} />

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        theme={theme}
      />

      {/* Sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
        couponCode={couponCode}
        onApplyCoupon={setCouponCode}
        discountAmount={discountAmount}
        theme={theme}
      />

      {/* Interactive Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistProducts}
        onRemoveItem={handleRemoveWishlistItem}
        onMoveToCart={handleMoveWishlistToCart}
        theme={theme}
      />

      {/* Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discountAmount={discountAmount}
        onCompleteOrder={handleCompleteOrder}
        theme={theme}
      />

      {/* Order Confirmation Modal */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        theme={theme}
      />

      {/* PWA Install Modal */}
      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstall={handleInstallPwa}
        theme={theme}
      />
    </div>
  );
}

export default App;
