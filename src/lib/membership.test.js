import { registerMyMembership } from './membership.js';
import { supabase } from './supabaseClient.js';

jest.mock('./supabaseClient.js', () => ({ supabase: { rpc: jest.fn() } }));

const profile = { first_name: 'Alex', last_name: 'Member', major: 'CS', graduation_year: 2028 };

test('sends only registration fields and returns the member ID', async () => {
  supabase.rpc.mockResolvedValueOnce({ data: 'member-id', error: null });
  await expect(registerMyMembership({ ...profile, auth_user_id: 'other', role: ['admin'] }))
    .resolves.toBe('member-id');
  expect(supabase.rpc).toHaveBeenCalledWith('register_my_membership', { p_profile: profile });
});

test('preserves database error codes for the caller', async () => {
  const error = { code: '23505', message: 'Account link conflict' };
  supabase.rpc.mockResolvedValueOnce({ data: null, error });
  await expect(registerMyMembership(profile)).rejects.toBe(error);
});

test('does not report success without a member ID', async () => {
  supabase.rpc.mockResolvedValueOnce({ data: null, error: null });
  await expect(registerMyMembership(profile)).rejects.toThrow('No member profile was returned');
});
