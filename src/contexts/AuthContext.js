import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { signInWithGoogle, signOut } from '../lib/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ session: null, loading: true, error: null });
  useEffect(() => {
    let active = true;
    let receivedEvent = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      receivedEvent = true;
      if (active) setState({ session, loading: false, error: null });
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (active && !receivedEvent) setState({ session: data.session, loading: false, error });
    }).catch(error => {
      if (active && !receivedEvent) setState({ session: null, loading: false, error });
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={{ ...state, user: state.session?.user ?? null, signInWithGoogle, signOut }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
