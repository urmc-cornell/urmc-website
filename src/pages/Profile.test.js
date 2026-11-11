import { render, screen } from '@testing-library/react';
import Profile, { isProfileComplete } from './Profile.js';
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

test('Points Tracker follows Action Items and shows semester points', async () => {
  useAuth.mockReturnValue({ user: { id: 'u1' }, loading: false });
  loadMyProfile.mockResolvedValue({
    member: { id: 'm1', first_name: 'Alex', last_name: 'Rivera', netid: 'ar123' },
    points: 3,
    attendance: { attended: 1, hosted: 1 },
  });
  render(<Profile />);
  await screen.findByRole('heading', { name: 'Points Tracker' });
  const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent);
  expect(headings.slice(-2)).toEqual(['Action Items', 'Points Tracker']);
  expect(screen.getByText('3')).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'Event Attendance' })).toBeNull();
});

const completeMember = {
  id: 'm1', netid: 'ar123', headshot_url: 'https://x/photo.png', first_name: 'Alex', last_name: 'Rivera',
  major: 'CS', graduation_year: 2028, ask_about: ['AI'], bio: 'Hi!',
};

test('profile is complete only when every General tab field is filled', () => {
  expect(isProfileComplete(completeMember)).toBe(true);
  for (const field of ['headshot_url', 'first_name', 'last_name', 'major', 'graduation_year', 'bio']) {
    expect(isProfileComplete({ ...completeMember, [field]: null })).toBe(false);
  }
  expect(isProfileComplete({ ...completeMember, bio: '   ' })).toBe(false);
  expect(isProfileComplete({ ...completeMember, ask_about: [] })).toBe(false);
});

test('Action Items is a single profile checkbox with instructions', async () => {
  useAuth.mockReturnValue({ user: { id: 'u1' }, loading: false });
  loadMyProfile.mockResolvedValue({ member: { ...completeMember, bio: null }, points: 0 });
  const { container } = render(<Profile />);
  await screen.findByText('Complete your member profile');
  expect(screen.getByText('0/1 done')).toBeTruthy();
  expect(screen.getByText(/fill out every field on the General tab/)).toBeTruthy();
  expect(container.querySelectorAll('.profile-page-check-item')).toHaveLength(1);
  expect(container.querySelector('.profile-page-checkbox-done')).toBeNull();
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
