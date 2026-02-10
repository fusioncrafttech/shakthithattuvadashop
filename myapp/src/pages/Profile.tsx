import { useState } from 'react';
import { motion } from 'framer-motion';

type AuthMode = 'signin' | 'signup';
type AuthMethod = 'password' | 'otp';

export function Profile() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [method, setMethod] = useState<AuthMethod>('password');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!mobile.trim()) e.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(mobile.replace(/\s/g, ''))) e.mobile = 'Enter valid 10-digit number';
    if (method === 'password') {
      if (mode === 'signin' && !password) e.password = 'Password is required';
      if (mode === 'signup' && password.length < 6) e.password = 'Password must be at least 6 characters';
    } else {
      if (!otp.trim()) e.otp = 'OTP is required';
    }
    if (mode === 'signup' && !name.trim()) e.name = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Demo: could show success toast
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-md px-4 py-8 md:py-12"
    >
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Profile</h1>

      <div className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
        <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
              mode === 'signin' ? 'bg-white text-[#E53935] shadow' : 'text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
              mode === 'signup' ? 'bg-white text-[#E53935] shadow' : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
              placeholder="10-digit mobile number"
            />
            {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
          </div>

          <div className="flex rounded-xl bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setMethod('password')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                method === 'password' ? 'bg-white text-[#E53935] shadow' : 'text-gray-600'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setMethod('otp')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                method === 'otp' ? 'bg-white text-[#E53935] shadow' : 'text-gray-600'
              }`}
            >
              OTP
            </button>
          </div>

          {method === 'password' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {mode === 'signup' ? 'Create Password' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          )}

          {method === 'otp' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                placeholder="Enter OTP"
              />
              <button type="button" className="mt-2 text-sm font-medium text-[#E53935]">
                Send OTP
              </button>
              {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp}</p>}
            </div>
          )}

          <motion.button
            type="submit"
            className="w-full rounded-xl bg-[#E53935] py-3.5 font-semibold text-white"
            whileTap={{ scale: 0.98 }}
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
