import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';


type Step = 1 | 2;

export function Checkout() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, openAuthModal, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      openAuthModal('/checkout');
    }
  }, [isAuthenticated, isLoading, openAuthModal]);

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
    if (step === 1) {
      if (validateStep1()) setStep(2);
    }
  };

  const handlePlaceOrder = () => {
    clearCart();
    navigate('/');
  };

  const handleUPIPayment = () => {
    // Generate UPI payment URL with amount
    const upiUrl = `upi://pay?pa=shakthithattuvada@ybl&pn=Shakthi Thattuvada Set&am=${totalPrice}&cu=INR&tn=Order Payment`;
    
    // Try to open specific UPI apps in order of preference
    const upiApps = [
      { name: 'GPay', url: `gpay://upi/pay?pa=shakthithattuvada@ybl&pn=Shakthi Thattuvada Set&am=${totalPrice}&cu=INR&tn=Order Payment` },
      { name: 'PhonePe', url: `phonepe://upi/pay?pa=shakthithattuvada@ybl&pn=Shakthi Thattuvada Set&am=${totalPrice}&cu=INR&tn=Order Payment` },
      { name: 'Paytm', url: `paytmmp://upi/pay?pa=shakthithattuvada@ybl&pn=Shakthi Thattuvada Set&am=${totalPrice}&cu=INR&tn=Order Payment` },
      { name: 'Generic UPI', url: upiUrl }
    ];
    
    // Try each UPI app
    let appOpened = false;
    for (const app of upiApps) {
      try {
        window.location.href = app.url;
        appOpened = true;
        break;
      } catch (error) {
        console.log(`Failed to open ${app.name}:`, error);
        continue;
      }
    }
    
    // Fallback: show QR code scanner if no app opened
    if (!appOpened) {
      setTimeout(() => {
        setShowQRScanner(true);
      }, 1000);
    } else {
      // Also show QR scanner as backup after a delay
      setTimeout(() => {
        setShowQRScanner(true);
      }, 3000);
    }
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
                placeholder="Enter your name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mobile</label>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                placeholder="Enter your delivery address"
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
              <button
                type="button"
                onClick={handleUPIPayment}
                className="flex items-center gap-4 rounded-xl border-2 border-[#E53935] bg-[#FFF8E1] p-4 hover:bg-[#FFF8E1]/80 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow">
                  <span className="text-lg font-bold">UPI</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">UPI Payment</p>
                  <p className="text-sm text-gray-500">GPay, PhonePe, Paytm - Click to scan QR</p>
                </div>
              </button>
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

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Scan QR Code</h3>
              <button
                onClick={() => setShowQRScanner(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 h-48 w-48 rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-sm text-gray-600">QR Code Scanner</p>
                  <p className="text-xs text-gray-500 mt-1">Open GPay/PhonePe to scan</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-900">Payment Amount:</p>
                <p className="text-xl font-bold text-[#E53935]">₹{totalPrice}</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Open GPay or PhonePe and scan QR</p>
                <div className="flex justify-center gap-2 mb-2">
                  <div className="rounded-lg bg-green-50 px-3 py-1">
                    <span className="text-xs font-medium text-green-700">GPay</span>
                  </div>
                  <div className="rounded-lg bg-purple-50 px-3 py-1">
                    <span className="text-xs font-medium text-purple-700">PhonePe</span>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-100 p-2">
                  <p className="text-xs font-mono text-gray-700">shakthithattuvada@ybl</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setShowQRScanner(false);
                  handlePlaceOrder();
                }}
                className="w-full rounded-xl bg-[#E53935] py-3 font-semibold text-white"
              >
                I've Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
