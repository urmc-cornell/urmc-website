import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import AuthCallback from './AuthCallback.js';
import { supabase } from '../lib/supabaseClient.js';
jest.mock('../lib/supabaseClient.js', () => ({ supabase: {
  auth: { exchangeCodeForSession: jest.fn() }, rpc: jest.fn(),
} }));
test('Strict Mode exchanges once and renders the unmatched-account state', async () => {
  window.history.replaceState(null, '', '/auth/callback?code=strict-test');
  supabase.auth.exchangeCodeForSession.mockResolvedValue({ data: { session: {} }, error: null });
  supabase.rpc.mockResolvedValue({ data: null, error: null });
  render(<StrictMode><AuthCallback /></StrictMode>);
  await screen.findByText(/could not find your URMC member record/);
  expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
  expect(supabase.rpc).toHaveBeenCalledTimes(1);
  expect(window.location.search).toBe('');
});
