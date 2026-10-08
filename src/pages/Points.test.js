import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Points from './Points';
import { supabase } from '../lib/supabaseClient';

jest.mock('../lib/supabaseClient', () => ({ supabase: { from: jest.fn(), rpc: jest.fn() } }));
jest.mock('../lib/semester', () => ({ currentSemester: () => 'fa26' }));
jest.mock('../components/points/PointsHero', () => () => null);
jest.mock('../components/points/HowToEarnSection', () => () => null);
jest.mock('../components/points/RewardsSection', () => () => null);
jest.mock('../components/points/ViewYourPointsSection', () => ({ topMembers, onLookup }) => (
  <div>
    {topMembers.map(m => <span key={m.netid}>{m.name}</span>)}
    <button onClick={() => onLookup(' AB123 ')}>Lookup</button>
  </div>
));

test('ranks public semester totals while excluding eboard by the public directory', async () => {
  const eq = jest.fn().mockResolvedValue({ data: [
    { netid: 'eb123', first_name: 'Eboard', total_points: 100 },
    { netid: 'ab123', first_name: 'Member', total_points: 10 },
  ], error: null });
  const contains = jest.fn().mockResolvedValue({ data: [{ netid: 'eb123' }], error: null });
  supabase.from.mockImplementation(table => ({ select: () => {
    if (table === 'member_leaderboard') return { eq };
    if (table === 'member_directory') return { contains };
    throw new Error(`Unexpected private-table query: ${table}`);
  } }));
  supabase.rpc.mockReturnValue({ maybeSingle: jest.fn().mockResolvedValue({ data: { total_points: 10 }, error: null }) });
  render(<Points />);
  await screen.findByText('Member');
  expect(screen.queryByText('Eboard')).toBeNull();
  expect(eq).toHaveBeenCalledWith('semester', 'fa26');
  expect(contains).toHaveBeenCalledWith('role', ['eboard']);
  fireEvent.click(screen.getByText('Lookup'));
  await waitFor(() => expect(supabase.rpc).toHaveBeenCalledWith('get_public_member_points', {
    p_netid: 'ab123', p_semester: 'fa26',
  }));
});
