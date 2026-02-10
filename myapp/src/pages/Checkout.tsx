import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

type Step = 1 | 2;

export function Checkout() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.mobile.trim()) e.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ''))) e.mobile = 'Enter valid 10-digit number';
    if (!form.address.trim()) e.address = 'Delivery address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handlePlaceOrder = () => {
    clearCart();
    navigate('/');
  };

  if (items.length === 0 && step === 1) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <p className="mb-4 text-gray-600">Your cart is empty.</p>
        <Link to="/shop" className="text-[#E53935] font-semibold underline">Go to Shop</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl px-4 py-8 md:py-12"
    >
      <div className="mb-8 flex gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-[#E53935]' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                placeholder="10-digit mobile number"
              />
              {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Delivery Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                placeholder="Full address for delivery"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
            <button
              onClick={handleNext}
              className="w-full rounded-xl bg-[#E53935] py-3.5 font-semibold text-white"
            >
              Continue to Payment
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            <div className="rounded-2xl bg-white p-5 shadow-lg">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between py-2">
                  <span className="text-gray-700">{product.name} × {quantity}</span>
                  <span>₹{product.price * quantity}</span>
                </div>
              ))}
              <div className="mt-4 border-t border-gray-200 pt-4 font-semibold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-[#E53935]">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900">Payment</h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-4 rounded-xl border-2 border-[#E53935] bg-[#FFF8E1] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow">
                  <span className="text-lg font-bold">UPI</span>
                </div>
                <div>
                  <p className="font-medium">UPI</p>
                  <p className="text-sm text-gray-500">GPay, PhonePe, Paytm</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Card</p>
                  <p className="text-sm text-gray-500">Credit / Debit Card</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-gray-300 py-3 font-medium text-gray-700"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 rounded-xl bg-[#E53935] py-3.5 font-semibold text-white"
              >
                Place Order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
