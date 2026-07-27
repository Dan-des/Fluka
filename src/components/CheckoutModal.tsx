import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';
import type { CartItem, OrderState, ShippingDetails, PaymentDetails, ThemeMode } from '../types/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountAmount: number;
  onCompleteOrder: (order: OrderState) => void;
  theme?: ThemeMode;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountAmount,
  onCompleteOrder,
  theme = 'dark',
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: 'David Adebayo',
    email: 'david.adebayo@example.com',
    phone: '+234 803 999 1122',
    address: '15 Victoria Island Blvd, Suite 402',
    city: 'Lagos',
    zipCode: '101241',
    country: 'Nigeria',
    shippingMethod: 'express',
  });

  const [payment, setPayment] = useState<PaymentDetails>({
    cardHolder: 'DAVID ADEBAYO',
    cardNumber: '4532 •••• •••• 8892',
    expiryDate: '11/28',
    cvv: '921',
    paymentMethod: 'card',
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.075;
  const shippingCost = shipping.shippingMethod === 'overnight' ? 7500 : shipping.shippingMethod === 'express' ? 3500 : 0;
  const total = Math.max(0, subtotal + tax + shippingCost - discountAmount);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep((s) => (s + 1) as any);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: OrderState = {
      orderId: `FLK-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      items,
      shipping,
      subtotal,
      tax,
      discount: discountAmount,
      shippingCost,
      total,
    };
    onCompleteOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-4xl border rounded-3xl shadow-2xl overflow-hidden my-8 transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full border transition ${
            isDark
              ? 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div
          className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-500" />
              <span>Fluka Express Checkout</span>
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Encrypted 256-Bit SSL Payment Processing
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-3 py-1 rounded-full font-bold ${
              step === 1
                ? 'bg-cyan-500 text-slate-950'
                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
            }`}>
              1. Shipping
            </span>
            <span className={`px-3 py-1 rounded-full font-bold ${
              step === 2
                ? 'bg-cyan-500 text-slate-950'
                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
            }`}>
              2. Delivery
            </span>
            <span className={`px-3 py-1 rounded-full font-bold ${
              step === 3
                ? 'bg-cyan-500 text-slate-950'
                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
            }`}>
              3. Payment
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-6">
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4 text-xs">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-500" />
                  <span>Customer Shipping Information</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email Address</label>
                      <input
                        type="email"
                        required
                        value={shipping.email}
                        onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Phone Number</label>
                      <input
                        type="text"
                        required
                        value={shipping.phone}
                        onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>City</label>
                      <input
                        type="text"
                        required
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Postal Code</label>
                      <input
                        type="text"
                        required
                        value={shipping.zipCode}
                        onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Country</label>
                      <input
                        type="text"
                        required
                        value={shipping.country}
                        onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                  <span>Continue to Delivery Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-4 text-xs">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-500" />
                  <span>Select Delivery Speed</span>
                </h3>

                <div className="space-y-3">
                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      shipping.shippingMethod === 'express'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shipping.shippingMethod === 'express'}
                        onChange={() => setShipping({ ...shipping, shippingMethod: 'express' })}
                        className="text-cyan-500"
                      />
                      <div>
                        <p className="font-bold">Express Nationwide Dispatch (1-2 Days)</p>
                        <p className="text-[11px] text-slate-400">Tracked door-to-door courier delivery</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-cyan-500">₦3,500</span>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      shipping.shippingMethod === 'overnight'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shipping.shippingMethod === 'overnight'}
                        onChange={() => setShipping({ ...shipping, shippingMethod: 'overnight' })}
                        className="text-cyan-500"
                      />
                      <div>
                        <p className="font-bold">VIP Same-Day Delivery</p>
                        <p className="text-[11px] text-slate-400">Guaranteed delivery within 12 hours</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-cyan-500">₦7,500</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`px-4 py-3 border font-semibold rounded-xl flex items-center gap-1 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleFinish} className="space-y-4 text-xs">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-500" />
                  <span>Payment Gateway & Card Preview</span>
                </h3>

                {/* Virtual Card Preview */}
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 border border-slate-700 shadow-xl text-white space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-cyan-400 tracking-wider">FLUKA SECURE</span>
                    <CreditCard className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="font-mono text-base tracking-widest text-slate-200">
                    {payment.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[9px]">CARD HOLDER</span>
                      <span className="font-bold">{payment.cardHolder || 'VALUED CUSTOMER'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">EXPIRES</span>
                      <span className="font-bold">{payment.expiryDate || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={payment.cardHolder}
                      onChange={(e) => setPayment({ ...payment, cardHolder: e.target.value.toUpperCase() })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={payment.expiryDate}
                        onChange={(e) => setPayment({ ...payment, expiryDate: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition font-mono ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>CVV Security Code</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition font-mono ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={`px-4 py-3 border font-semibold rounded-xl flex items-center gap-1 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pay ₦{total.toLocaleString()} & Complete Order</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Summary Side */}
          <div className={`lg:col-span-5 border-l pl-0 lg:pl-6 space-y-4 text-xs ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <h3 className="font-bold">Order Summary ({items.length})</h3>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={`w-10 h-10 object-cover rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-xs">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono font-bold text-cyan-500">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className={`p-3.5 border rounded-2xl space-y-2 font-mono text-[11px] ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className={isDark ? 'text-white' : 'text-slate-900'}>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>VAT (7.5%)</span>
                <span className={isDark ? 'text-white' : 'text-slate-900'}>₦{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className={isDark ? 'text-white' : 'text-slate-900'}>₦{shippingCost.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount</span>
                  <span>-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className={`flex justify-between text-sm font-bold pt-2 border-t font-sans ${
                isDark ? 'border-slate-800 text-white' : 'border-slate-300 text-slate-900'
              }`}>
                <span>Total</span>
                <span className="text-cyan-500 font-mono">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-3 border rounded-xl text-[11px] ${
              isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full Buyer Protection with 14-day hassle-free return window.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
