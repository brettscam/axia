import { create } from 'zustand';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  signUp: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  },

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, loading: false });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, loading: false });
    });

    return () => {
      subscription.unsubscribe();
    };
  },
}));
