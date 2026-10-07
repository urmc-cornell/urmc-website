import { supabase } from './supabaseClient.js';

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// React Strict Mode can mount the callback twice. Exchange each code only once
// per page load, including failures; restarting login supplies a new code.
const callbacks = new Map();
export function completeGoogleSignIn(search = window.location.search) {
  const params = new URLSearchParams(search);
  if (params.has('error')) {
    return Promise.reject(new Error('Google sign-in was cancelled or could not be completed. Please try again.'));
  }
  const code = params.get('code');
  if (!code) return Promise.reject(new Error('No sign-in code was received. Please start Google sign-in again.'));
  if (!callbacks.has(code)) {
    callbacks.set(code, (async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      if (!data.session) throw new Error('No session was created. Please start Google sign-in again.');
      window.history.replaceState(null, '', window.location.pathname);
      const { data: memberId, error: linkError } = await supabase.rpc('link_my_member');
      if (linkError) throw new Error('You are signed in, but your member account could not be linked. Please contact URMC.');
      return { memberId };
    })());
  }
  return callbacks.get(code);
}
