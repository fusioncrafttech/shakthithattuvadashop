import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'signin' | 'signup';

const cardClass =
  'rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] md:p-6';

const menuItemClass =
  'flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors active:bg-accent-soft focus:bg-accent-soft focus:outline-none';

export function Profile() {
  const { user, isAuthenticated, login, signUp, logout, updateProfile, refreshProfile, uploadAvatar, resetPasswordForEmail, updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) refreshProfile();
  }, [isAuthenticated, refreshProfile]);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [setPasswordErrors, setSetPasswordErrors] = useState<Record<string, string>>({});
  const [setPasswordMessage, setSetPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [setPasswordLoading, setSetPasswordLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.includes('type=recovery')) setShowSetPasswordModal(true);
  }, []);

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const editAvatarInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (mode === 'signin') {
      if (!password) e.password = 'Password is required';
    } else {
      if (!name.trim()) e.name = 'Name is required';
      if (!mobile.trim()) e.mobile = 'Mobile number is required';
      else if (!/^\d{10}$/.test(mobile.replace(/\s/g, ''))) e.mobile = 'Enter a valid 10-digit number';
      if (!address.trim()) e.address = 'Address is required';
      if (!password) e.password = 'Password is required';
      else if (password.length < 6) e.password = 'Password must be at least 6 characters';
      if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setMessage(null);
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'signin') {
        const result = await login(email, password);
        if (result.success) {
          setMessage({ type: 'success', text: 'Signed in. Loading your profile...' });
        } else {
          setMessage({ type: 'error', text: result.error ?? 'Sign in failed' });
        }
      } else {
        const result = await signUp({
          email,
          password,
          name: name.trim(),
          phone: mobile.trim(),
          address: address.trim(),
        });
        if (result.success) {
          setMessage({ type: 'success', text: 'Account created. Your profile is saved.' });
        } else {
          setMessage({ type: 'error', text: result.error ?? 'Sign up failed' });
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openForgotModal = () => {
    setForgotEmail(email);
    setForgotMessage(null);
    setShowForgotModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotMessage(null);
  };

  const handleForgotSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setForgotMessage(null);
    if (!forgotEmail.trim()) {
      setForgotMessage({ type: 'error', text: 'Enter your email address' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotMessage({ type: 'error', text: 'Enter a valid email' });
      return;
    }
    setForgotLoading(true);
    try {
      const result = await resetPasswordForEmail(forgotEmail.trim());
      if (result.success) {
        setForgotMessage({ type: 'success', text: 'Check your email for a link to reset your password.' });
        setTimeout(closeForgotModal, 3000);
      } else {
        setForgotMessage({ type: 'error', text: result.error ?? 'Failed to send reset link' });
      }
    } catch {
      setForgotMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setForgotLoading(false);
    }
  };

  const closeSetPasswordModal = () => {
    setShowSetPasswordModal(false);
    setNewPassword('');
    setConfirmNewPassword('');
    setSetPasswordErrors({});
    setSetPasswordMessage(null);
    if (typeof window !== 'undefined') window.history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  const handleSetPasswordSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSetPasswordMessage(null);
    const errs: Record<string, string> = {};
    if (!newPassword || newPassword.length < 6) errs.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmNewPassword) errs.confirmNewPassword = 'Passwords do not match';
    setSetPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSetPasswordLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        setSetPasswordMessage({ type: 'success', text: 'Password updated. You can now sign in with your new password.' });
        setTimeout(closeSetPasswordModal, 2000);
      } else {
        setSetPasswordMessage({ type: 'error', text: result.error ?? 'Failed to update password' });
      }
    } catch {
      setSetPasswordMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setSetPasswordLoading(false);
    }
  };

  const openEditProfile = () => {
    if (!user) return;
    setEditName(user.name?.trim() ?? '');
    setEditMobile(user.phone?.trim() ?? '');
    setEditAddress(user.address?.trim() ?? '');
    setEditAvatarFile(null);
    setEditAvatarPreview(null);
    setEditErrors({});
    setEditMessage(null);
    setEditOpen(true);
  };

  const handleEditAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setEditMessage({ type: 'error', text: 'Please choose an image file (JPEG, PNG, GIF, WebP)' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setEditMessage({ type: 'error', text: 'Image must be under 2MB' });
      return;
    }
    setEditAvatarFile(file);
    setEditMessage(null);
    const reader = new FileReader();
    reader.onload = () => setEditAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const closeEditProfile = () => {
    setEditOpen(false);
    setEditAvatarFile(null);
    setEditAvatarPreview(null);
    setEditErrors({});
    setEditMessage(null);
    if (editAvatarInputRef.current) editAvatarInputRef.current.value = '';
  };

  const handleEditSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!user) return;
    setEditMessage(null);
    const errs: Record<string, string> = {};
    if (!editName.trim()) errs.name = 'Name is required';
    if (editMobile.trim() && !/^\d{10}$/.test(editMobile.replace(/\s/g, ''))) errs.mobile = 'Enter a valid 10-digit number';
    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setEditSaving(true);
    try {
      if (editAvatarFile) {
        const uploadResult = await uploadAvatar(editAvatarFile);
        if (!uploadResult.success) {
          setEditMessage({ type: 'error', text: uploadResult.error ?? 'Failed to upload photo' });
          setEditSaving(false);
          return;
        }
      }
      const result = await updateProfile({
        name: editName.trim(),
        phone: editMobile.trim(),
        address: editAddress.trim(),
      });
      if (result.success) {
        setEditMessage({ type: 'success', text: 'Profile updated.' });
        setTimeout(() => closeEditProfile(), 800);
      } else {
        setEditMessage({ type: 'error', text: result.error ?? 'Update failed' });
      }
    } catch {
      setEditMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setEditSaving(false);
    }
  };

  if (isAuthenticated && user) {
    const displayName = user.name?.trim() || user.email?.split('@')[0] || 'User';
    const initial = (displayName[0] ?? '?').toUpperCase();
    const displayEmail = user.email?.trim() || '';
    const displayMobile = user.phone?.trim() || 'Add mobile number';
    const displayAddress = user.address?.trim() || 'Add address';

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-lg px-4 pb-10 pt-6 md:pb-12 md:pt-8"
      >
        {/* Edit Profile modal */}
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={closeEditProfile} aria-hidden />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-sm rounded-[20px] bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-4 text-lg font-bold text-gray-900">Edit profile</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="flex flex-col items-center">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Profile photo</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => editAvatarInputRef.current?.click()}
                      className="flex h-20 w-20 overflow-hidden rounded-full border-2 border-dashed border-gray-200 bg-gray-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {editAvatarPreview ? (
                        <img src={editAvatarPreview} alt="" className="h-full w-full object-cover" />
                      ) : user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400">
                          {(user.name?.[0] ?? user.email?.[0] ?? '?').toUpperCase()}
                        </span>
                      )}
                    </button>
                    <input
                      ref={editAvatarInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={handleEditAvatarChange}
                    />
                    <span className="mt-1 block text-center text-xs text-gray-500">Click to change (max 2MB)</span>
                  </div>
                </div>
                {user.email && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                    <p className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-gray-600">{user.email}</p>
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                )}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Your name"
                    autoFocus
                  />
                  {editErrors.name && <p className="mt-1 text-sm text-red-600">{editErrors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Mobile number</label>
                  <input
                    type="tel"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="10-digit number"
                    maxLength={14}
                  />
                  {editErrors.mobile && <p className="mt-1 text-sm text-red-600">{editErrors.mobile}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Delivery address"
                    rows={2}
                  />
                </div>
                {editMessage && (
                  <p className={`text-sm ${editMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {editMessage.text}
                  </p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeEditProfile}
                    className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={editSaving}
                    className="flex-1 rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-70"
                    whileTap={{ scale: 0.98 }}
                  >
                    {editSaving ? 'Saving...' : 'Save'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Set new password modal (after clicking reset link in email) */}
        {showSetPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => {}} aria-hidden />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-sm rounded-[20px] bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-4 text-lg font-bold text-gray-900">Set new password</h2>
              <p className="mb-4 text-sm text-gray-600">Enter your new password below.</p>
              <form onSubmit={handleSetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Min 6 characters"
                    minLength={6}
                    autoFocus
                  />
                  {setPasswordErrors.newPassword && <p className="mt-1 text-sm text-red-600">{setPasswordErrors.newPassword}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Re-enter password"
                    minLength={6}
                  />
                  {setPasswordErrors.confirmNewPassword && <p className="mt-1 text-sm text-red-600">{setPasswordErrors.confirmNewPassword}</p>}
                </div>
                {setPasswordMessage && (
                  <p className={`text-sm ${setPasswordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {setPasswordMessage.text}
                  </p>
                )}
                <motion.button
                  type="submit"
                  disabled={setPasswordLoading}
                  className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-70"
                  whileTap={{ scale: 0.98 }}
                >
                  {setPasswordLoading ? 'Updating...' : 'Update password'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Profile header card */}
        <div className={`${cardClass} mb-5`}>
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
            <div className="relative mb-4 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-3xl font-bold text-white shadow-md sm:mb-0 sm:mr-5">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
              {displayEmail && <p className="mt-0.5 text-sm text-gray-600">{displayEmail}</p>}
              <p className="mt-0.5 text-gray-500">{displayMobile}</p>
              <p className="mt-0.5 text-sm text-gray-500">{displayAddress}</p>
              <motion.button
                type="button"
                onClick={openEditProfile}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
                whileTap={{ scale: 0.98 }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit profile
              </motion.button>
            </div>
          </div>
        </div>

        {/* Menu sections card */}
        <div className={cardClass}>
          <nav className="space-y-1">
            <Link to="/history" className={menuItemClass}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-primary">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </span>
              <span className="font-medium text-gray-800">My Orders</span>
              <svg className="ml-auto h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <button type="button" className={`${menuItemClass} w-full`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-primary">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="font-medium text-gray-800">Delivery Address</span>
              <span className="ml-auto text-sm text-gray-500"></span>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Link to="/contact" className={menuItemClass}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-primary">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <span className="font-medium text-gray-800">Help & Support</span>
              <svg className="ml-auto h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link to="/about" className={menuItemClass}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-primary">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <span className="font-medium text-gray-800">Privacy Policy</span>
              <svg className="ml-auto h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <motion.button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-[20px] border-2 border-red-500 bg-red-500 py-3.5 font-semibold text-white shadow-sm active:bg-red-600 active:border-red-600"
              whileTap={{ scale: 0.98 }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-md px-4 py-8 md:py-12"
    >
      <h1 className="mb-6 text-2xl font-bold text-gray-900 md:mb-8">Profile</h1>

      {/* Forgot password modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeForgotModal} aria-hidden />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-sm rounded-[20px] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-bold text-gray-900">Reset password</h2>
            <p className="mb-4 text-sm text-gray-600">Enter your email and we&apos;ll send you a link to set a new password.</p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>
              {forgotMessage && (
                <p className={`text-sm ${forgotMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {forgotMessage.text}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-70"
                  whileTap={{ scale: 0.98 }}
                >
                  {forgotLoading ? 'Sending...' : 'Send link'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className={`${cardClass} md:p-8`}>
        <div className="mb-6 flex rounded-2xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrors({}); setMessage(null); setMobile(''); setAddress(''); setConfirmPassword(''); }}
            className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all ${
              mode === 'signin' ? 'bg-white text-primary shadow-md' : 'text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrors({}); setMessage(null); }}
            className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all ${
              mode === 'signup' ? 'bg-white text-primary shadow-md' : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Mobile number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="10-digit number"
                  maxLength={14}
                />
                {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Delivery address"
                  rows={2}
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
            </>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {mode === 'signup' ? 'Password' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'}
              minLength={mode === 'signup' ? 6 : undefined}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            {mode === 'signin' && (
              <button
                type="button"
                onClick={openForgotModal}
                className="mt-2 text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            )}
          </div>

          {mode === 'signup' && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Re-enter password"
                minLength={6}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          )}

          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white shadow-sm disabled:opacity-70"
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
