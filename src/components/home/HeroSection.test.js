import { render, screen } from '@testing-library/react';
import HeroSection from './HeroSection';

test('renders main heading', () => {
  render(<HeroSection />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Underrepresented Minorities in Computing');
});

test('renders highlighted community words', () => {
  render(<HeroSection />);
  expect(screen.getByText('Black')).toBeInTheDocument();
  expect(screen.getByText('Latinx')).toBeInTheDocument();
  expect(screen.getByText('Indigenous')).toBeInTheDocument();
});

test('Get Involved links to /getting-involved', () => {
  render(<HeroSection />);
  const link = screen.getByRole('link', { name: /Get Involved/i });
  expect(link).toHaveAttribute('href', '/getting-involved');
});

test('Who We Are links to /leadership', () => {
  render(<HeroSection />);
  const link = screen.getByRole('link', { name: /Who We Are/i });
  expect(link).toHaveAttribute('href', '/leadership');
});

test('renders hero photo', () => {
  render(<HeroSection />);
  expect(screen.getByAltText('URMC students')).toBeInTheDocument();
});
