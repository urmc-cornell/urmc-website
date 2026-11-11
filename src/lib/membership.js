import { supabase } from './supabaseClient.js';

// Identity and membership permissions come from the signed-in session.
export async function registerMyMembership({ first_name, last_name, major, graduation_year }) {
  const { data: memberId, error } = await supabase.rpc('register_my_membership', {
    p_profile: { first_name, last_name, major, graduation_year },
  });
  if (error) throw error;
  if (!memberId) throw new Error('No member profile was returned. Please try again.');
  return memberId;
}
