import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext.js';
import { supabase } from '../lib/supabaseClient.js';
jest.mock('../lib/supabaseClient.js', () => ({ supabase: { auth: { onAuthStateChange: jest.fn(), getSession: jest.fn() } } }));
function Consumer() {
  const { loading, user } = useAuth();
  return <p>{loading ? 'Loading' : user?.id || 'Signed out'}</p>;
}
test('auth events win over stale initial session results and subscriptions clean up', async () => {
  let event, resolve;
  const unsubscribe = jest.fn();
  supabase.auth.onAuthStateChange.mockImplementation(cb => { event = cb; return { data: { subscription: { unsubscribe } } }; });
  supabase.auth.getSession.mockReturnValue(new Promise(r => { resolve = r; }));
  const view = render(<AuthProvider><Consumer /></AuthProvider>);
  expect(screen.getByText('Loading')).toBeTruthy();
  act(() => event('SIGNED_IN', { user: { id: 'current-user' } }));
  await act(async () => resolve({ data: { session: null }, error: null }));
  expect(screen.getByText('current-user')).toBeTruthy();
  act(() => event('SIGNED_OUT', null));
  expect(screen.getByText('Signed out')).toBeTruthy();
  view.unmount();
  expect(unsubscribe).toHaveBeenCalledTimes(1);
});
