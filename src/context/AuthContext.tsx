import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { UserRole } from '../types';
import { supabase, isSupabaseConfigured, STORAGE_BUCKET_AVATARS } from '../lib/supabase';

const AUTH_STORAGE_KEY = 'thattuvadaiset_user';
const ROLE_STORAGE_KEY = 'thattuvadaiset_role';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  authModalOpen: boolean;
  authModalRedirectPath: string | null;
  openAuthModal: (redirectPath?: string) => void;
  closeAuthModal: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (params: { name?: string; phone?: string; address?: string; avatar_url?: string | null }) => Promise<{ success: boolean; error?: string }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  resetPasswordForEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as AuthUser;
    return data?.email ? data : null;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(ROLE_STORAGE_KEY);
  }
}

function getStoredRole(): UserRole {
  try {
    const r = localStorage.getItem(ROLE_STORAGE_KEY);
    if (r === 'admin' || r === 'user') return r;
  } catch {}
  return 'user';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRedirectPath, setAuthModalRedirectPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    if (!isSupabaseConfigured()) return false;
    return !loadStoredUser();
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const openAuthModal = useCallback((redirectPath?: string) => {
    setAuthModalRedirectPath(redirectPath ?? null);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthModalRedirectPath(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const client = supabase;
    if (!client) return;
    const { data: { user: sbUser } } = await client.auth.getUser();
    if (!sbUser) return;
    type ProfileRow = { id: string; email: string | null; name: string | null; role: string; phone?: string | null; address?: string | null; avatar_url?: string | null };
    let profile: ProfileRow | null = null;
    const { data: profileData, error: profileError } = await client
      .from('profiles')
      .select('id, email, name, role, phone, address, avatar_url')
      .eq('id', sbUser.id)
      .single();
    if (profileError && (profileError.code === 'PGRST204' || profileError.message?.includes('column'))) {
      const fallback = await client
        .from('profiles')
        .select('id, email, name, role')
        .eq('id', sbUser.id)
        .single();
      profile = fallback.data as ProfileRow | null;
    } else {
      profile = profileData as ProfileRow | null;
    }
    if (!profile) {
      await client.from('profiles').upsert(
        {
          id: sbUser.id,
          email: sbUser.email ?? '',
          name: sbUser.user_metadata?.name ?? sbUser.email?.split('@')[0] ?? '',
          role: 'user',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
      const result = await client
        .from('profiles')
        .select('id, email, name, role, phone, address, avatar_url')
        .eq('id', sbUser.id)
        .single();
      if (result.error && (result.error.code === 'PGRST204' || result.error.message?.includes('column'))) {
        const fallback2 = await client.from('profiles').select('id, email, name, role').eq('id', sbUser.id).single();
        profile = fallback2.data as ProfileRow | null;
      } else {
        profile = result.data as ProfileRow | null;
      }
    }
    if (profile) {
      const authUser: AuthUser = {
        id: profile.id,
        email: profile.email ?? sbUser.email ?? '',
        name: profile.name ?? sbUser.user_metadata?.name ?? '',
        role: (profile.role as UserRole) ?? 'user',
        phone: profile.phone ?? undefined,
        address: profile.address ?? undefined,
        avatar_url: profile.avatar_url ?? undefined,
      };
      setUser(authUser);
      saveUser(authUser);
    } else {
      const fallbackUser: AuthUser = {
        id: sbUser.id,
        email: sbUser.email ?? '',
        name: sbUser.user_metadata?.name ?? sbUser.email?.split('@')[0] ?? '',
        role: 'user',
      };
      setUser(fallbackUser);
      saveUser(fallbackUser);
    }
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured() || !client) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      const { data: { session } } = await client.auth.getSession();
      if (session?.user) {
        await refreshProfile();
      } else {
        setUser(null);
        saveUser(null);
      }
      setIsLoading(false);
    };
    init();

    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        saveUser(null);
        return;
      }
      if (session?.user) await refreshProfile();
    });
    return () => subscription.unsubscribe();
  }, [refreshProfile]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        if (data.user) await refreshProfile();
        return { success: true };
      }
      const authUser: AuthUser = {
        id: 'demo-' + Date.now(),
        email,
        name: email.split('@')[0],
        role: getStoredRole(),
      };
      setUser(authUser);
      saveUser(authUser);
      return { success: true };
    },
    [refreshProfile]
  );

  const signUp = useCallback(
    async (params: {
      email: string;
      password: string;
      name: string;
      phone?: string;
      address?: string;
    }): Promise<{ success: boolean; error?: string }> => {
      const { email, password, name, phone, address } = params;
      const client = supabase;
      if (client) {
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() } },
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const profileRow = {
            id: data.user.id,
            email: data.user.email ?? email,
            name: (data.user.user_metadata?.name as string) ?? (name.trim() || email.split('@')[0]),
            role: 'user',
            updated_at: new Date().toISOString(),
          };
          const { error: upsertError } = await client.from('profiles').upsert(profileRow, { onConflict: 'id' });
          if (upsertError) return { success: false, error: upsertError.message };
          if (phone?.trim() || address?.trim()) {
            const { error: updateError } = await client
              .from('profiles')
              .update({
                phone: phone?.trim() || null,
                address: address?.trim() || null,
                updated_at: new Date().toISOString(),
              })
              .eq('id', data.user.id);
            if (updateError) {
              // phone/address columns may not exist yet (migration 003 not run); ignore so signup still succeeds
            }
          }
          await refreshProfile();
        }
        return { success: true };
      }
      const authUser: AuthUser = {
        id: 'demo-' + Date.now(),
        email,
        name: name.trim() || email.split('@')[0],
        role: 'user',
        phone: phone?.trim(),
        address: address?.trim(),
      };
      setUser(authUser);
      saveUser(authUser);
      return { success: true };
    },
    [refreshProfile]
  );

  const logout = useCallback(() => {
    if (supabase != null) void supabase.auth.signOut();
    setUser(null);
    saveUser(null);
  }, []);

  const updateProfile = useCallback(
    async (params: { name?: string; phone?: string; address?: string; avatar_url?: string | null }): Promise<{ success: boolean; error?: string }> => {
      const client = supabase;
      if (!client || !user) return { success: false, error: 'Not signed in' };
      const updatedAt = new Date().toISOString();
      const fullUpdates: Record<string, string | null> = { updated_at: updatedAt };
      if (params.name !== undefined) fullUpdates.name = params.name.trim() || (user.email?.split('@')[0] ?? '');
      if (params.phone !== undefined) fullUpdates.phone = params.phone.trim() || null;
      if (params.address !== undefined) fullUpdates.address = params.address.trim() || null;
      if (params.avatar_url !== undefined) fullUpdates.avatar_url = params.avatar_url || null;
      const { error } = await client.from('profiles').update(fullUpdates).eq('id', user.id);
      if (error) {
        if (error.message?.includes('column') || error.code === '42703') {
          const nameOnly = {
            name: (params.name !== undefined ? params.name.trim() : user.name) || (user.email?.split('@')[0] ?? ''),
            updated_at: updatedAt,
          };
          const { error: fallbackError } = await client.from('profiles').update(nameOnly).eq('id', user.id);
          if (fallbackError) return { success: false, error: fallbackError.message };
        } else {
          return { success: false, error: error.message };
        }
      }
      await refreshProfile();
      return { success: true };
    },
    [user, refreshProfile]
  );

  const uploadAvatar = useCallback(
    async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
      const client = supabase;
      if (!client || !user) return { success: false, error: 'Not signed in' };
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      if (!['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(ext)) return { success: false, error: 'Use JPEG, PNG, GIF or WebP' };
      if (file.size > 2 * 1024 * 1024) return { success: false, error: 'Image must be under 2MB' };
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await client.storage.from(STORAGE_BUCKET_AVATARS).upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (uploadError) return { success: false, error: uploadError.message };
      const { data: urlData } = client.storage.from(STORAGE_BUCKET_AVATARS).getPublicUrl(path);
      const publicUrl = urlData.publicUrl;
      const { error: updateError } = await client.from('profiles').update({ avatar_url: publicUrl, updated_at: new Date().toISOString() }).eq('id', user.id);
      if (updateError) return { success: false, error: updateError.message };
      await refreshProfile();
      return { success: true, url: publicUrl };
    },
    [user, refreshProfile]
  );

  const resetPasswordForEmail = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      const client = supabase;
      if (!client) return { success: false, error: 'Auth not configured' };
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/profile` : undefined;
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectTo ?? undefined,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    },
    []
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
      const client = supabase;
      if (!client) return { success: false, error: 'Auth not configured' };
      if (!newPassword || newPassword.length < 6) return { success: false, error: 'Password must be at least 6 characters' };
      const { error } = await client.auth.updateUser({ password: newPassword });
      if (error) return { success: false, error: error.message };
      return { success: true };
    },
    []
  );

  useEffect(() => {
    if (user) saveUser(user);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        signUp,
        logout,
        authModalOpen,
        authModalRedirectPath,
        openAuthModal,
        closeAuthModal,
        refreshProfile,
        updateProfile,
        uploadAvatar,
        resetPasswordForEmail,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
