import { render, screen } from '@testing-library/react';
import Profile from './Profile.js';
import { useAuth } from '../contexts/AuthContext.js';
import { loadMyProfile } from '../lib/profile.js';
jest.mock('../contexts/AuthContext.js', () => ({ useAuth: jest.fn() }));
jest.mock('../lib/supabaseClient.js', () => ({ supabase: {} }));
jest.mock('../lib/profile.js', () => ({ loadMyProfile: jest.fn() }));

const realLocation = window.location;
beforeEach(() => {
  delete window.location;
  window.location = { replace: jest.fn() };
});
afterEach(() => { window.location = realLocation; });

test('accounts with no member record are told to attend an event', async () => {
  useAuth.mockReturnValue({ user: { id: 'u1' }, loading: false });
  loadMyProfile.mockResolvedValue({ member: null, points: 0 });
  render(<Profile />);
  await screen.findByText(/Attend a URMC event to access the member portal/);
  expect(screen.getByRole('link', { name: /upcoming events/i }).getAttribute('href')).toBe('/events');
  expect(window.location.replace).not.toHaveBeenCalled();
});

test('Event Attendance shows attended over hosted this semester', async () => {
  useAuth.mockReturnValue({ user: { id: 'u1' }, loading: false });
  loadMyProfile.mockResolvedValue({
    member: { id: 'm1', first_name: 'Alex', last_name: 'Rivera', netid: 'ar123' },
    points: 3,
    attendance: { attended: 1, hosted: 1 },
  });
  const { container } = render(<Profile />);
  await screen.findByText('Event Attendance');
  expect(container.querySelector('.profile-page-attendance').textContent).toBe('1/1');
});

test('signed-out visitors are sent home without a sign-in page', () => {
  useAuth.mockReturnValue({ user: null, loading: false });
  render(<Profile />);
  expect(window.location.replace).toHaveBeenCalledWith('/');
  expect(screen.queryByRole('button', { name: /continue with google/i })).toBeNull();
});

test('waits for the session before deciding', () => {
  useAuth.mockReturnValue({ user: null, loading: true });
  render(<Profile />);
  expect(window.location.replace).not.toHaveBeenCalled();
});
