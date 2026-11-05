import { render, screen } from '@testing-library/react';
import Navbar from './Navbar.js';
import { useAuth } from '../contexts/AuthContext.js';
jest.mock('../contexts/AuthContext.js', () => ({ useAuth: jest.fn() }));

function renderAt(path, auth) {
  window.history.replaceState(null, '', path);
  useAuth.mockReturnValue({ user: null, loading: false, signInWithGoogle: jest.fn(), signOut: jest.fn(), ...auth });
  render(<Navbar />);
}

const portalLink = () => screen.getAllByRole('link', { name: /member portal/i })[0];

test('Member Portal is gold on the home page', () => {
  renderAt('/');
  expect(portalLink().getAttribute('href')).toBe('/profile');
  expect(portalLink().className).toContain('nav-auth-btn--gold');
});

test('Member Portal is outlined on other pages, signed in or out', () => {
  renderAt('/events', { user: { id: 'u1' } });
  expect(portalLink().className).toContain('nav-auth-btn--outline');
  expect(screen.queryByRole('button', { name: /sign out/i })).toBeNull();
});

test('Member Portal starts Google sign-in when signed out', () => {
  const signInWithGoogle = jest.fn().mockResolvedValue();
  renderAt('/', { signInWithGoogle });
  portalLink().click();
  expect(signInWithGoogle).toHaveBeenCalledTimes(1);
  expect(window.location.pathname).toBe('/');
});

test('Member Portal does not start sign-in when already signed in', () => {
  const signInWithGoogle = jest.fn().mockResolvedValue();
  renderAt('/events', { user: { id: 'u1' }, signInWithGoogle });
  // Stop the link's navigation, which jsdom does not implement.
  document.addEventListener('click', e => e.preventDefault(), { once: true });
  portalLink().click();
  expect(signInWithGoogle).not.toHaveBeenCalled();
});

test('the portal never offers Sign In or Member Portal', () => {
  renderAt('/profile');
  expect(screen.queryByRole('button', { name: /sign in/i })).toBeNull();
  expect(screen.queryByRole('link', { name: /member portal/i })).toBeNull();
  expect(screen.getAllByRole('button', { name: /sign out/i })[0].className).toContain('nav-auth-btn--pending');
});

test('the portal shows Sign Out when signed in and signs out on click', () => {
  const signOut = jest.fn().mockResolvedValue();
  renderAt('/profile', { user: { id: 'u1' }, signOut });
  screen.getAllByRole('button', { name: /sign out/i })[0].click();
  expect(signOut).toHaveBeenCalledTimes(1);
});
