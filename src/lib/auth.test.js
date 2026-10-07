import { supabase } from './supabaseClient.js';
import { signInWithGoogle, signOut, completeGoogleSignIn } from './auth.js';

jest.mock('./supabaseClient.js', () => ({ supabase: {
  auth: { signInWithOAuth: jest.fn(), signOut: jest.fn(), exchangeCodeForSession: jest.fn() },
  rpc: jest.fn(),
} }));
beforeEach(() => jest.clearAllMocks());

test('starts Google login with the current origin callback', async () => {
  supabase.auth.signInWithOAuth.mockResolvedValue({ error: null });
  await signInWithGoogle();
  expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } });
});
test('deduplicates callback exchange and links only after establishing a session', async () => {
  supabase.auth.exchangeCodeForSession.mockResolvedValue({ data: { session: { user: { id: 'user' } } }, error: null });
  supabase.rpc.mockResolvedValue({ data: 'member', error: null });
  const first = completeGoogleSignIn('?code=once');
  expect(completeGoogleSignIn('?code=once')).toBe(first);
  expect(supabase.rpc).not.toHaveBeenCalled();
  await expect(first).resolves.toEqual({ memberId: 'member' });
  expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
  expect(supabase.rpc).toHaveBeenCalledWith('link_my_member');
});
test('unmatched accounts are distinct from linking errors', async () => {
  supabase.auth.exchangeCodeForSession.mockResolvedValue({ data: { session: {} }, error: null });
  supabase.rpc.mockResolvedValue({ data: null, error: null });
  await expect(completeGoogleSignIn('?code=unmatched')).resolves.toEqual({ memberId: null });
  supabase.rpc.mockResolvedValue({ data: null, error: new Error('permission denied') });
  await expect(completeGoogleSignIn('?code=link-error')).rejects.toThrow('could not be linked');
});
test('rejects invalid callbacks and never links after a failed exchange', async () => {
  await expect(completeGoogleSignIn('')).rejects.toThrow('No sign-in code');
  await expect(completeGoogleSignIn('?error=access_denied&code=ignored')).rejects.toThrow('cancelled');
  expect(supabase.auth.exchangeCodeForSession).not.toHaveBeenCalled();
  supabase.auth.exchangeCodeForSession.mockResolvedValue({ data: { session: null }, error: new Error('Expired code') });
  await expect(completeGoogleSignIn('?code=expired')).rejects.toThrow('Expired code');
  expect(supabase.rpc).not.toHaveBeenCalled();
});
test('surfaces sign-in and sign-out failures', async () => {
  supabase.auth.signInWithOAuth.mockResolvedValue({ error: new Error('Provider unavailable') });
  await expect(signInWithGoogle()).rejects.toThrow('Provider unavailable');
  supabase.auth.signOut.mockResolvedValue({ error: new Error('Sign-out failed') });
  await expect(signOut()).rejects.toThrow('Sign-out failed');
});
