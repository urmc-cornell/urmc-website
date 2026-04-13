import { render, screen } from '@testing-library/react';
import HappeningsSection from './HappeningsSection';

test('renders URMC Happenings heading', () => {
  render(<HappeningsSection />);
  expect(screen.getByText('URMC Happenings')).toBeInTheDocument();
});

test('renders View all events link to /events', () => {
  render(<HappeningsSection />);
  const link = screen.getByRole('link', { name: /View all events/i });
  expect(link).toHaveAttribute('href', '/events');
});

test('renders anniversary event title', () => {
  render(<HappeningsSection />);
  expect(screen.getByText(/10-Year Anniversary Celebration/i)).toBeInTheDocument();
});

test('renders event description', () => {
  render(<HappeningsSection />);
  expect(screen.getByText(/decade of impact in computing/i)).toBeInTheDocument();
});

test('See the Recap links to Instagram with target _blank', () => {
  render(<HappeningsSection />);
  const link = screen.getByRole('link', { name: /See the Recap/i });
  expect(link).toHaveAttribute('href', 'https://www.instagram.com/p/DW9YIMwkQWi/?img_index=2&igsh=MWkya2Z2c2l1ZWtuMw==');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});
