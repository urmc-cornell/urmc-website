import { render, screen } from '@testing-library/react';
import Home from './Home';

jest.mock('../components/Navbar', () => () => <nav data-testid="navbar" />);
jest.mock('../components/home/HeroSection', () => () => <section data-testid="hero" />);
jest.mock('../components/home/MissionSection', () => () => <section data-testid="mission" />);
jest.mock('../components/home/SponsorsCarousel', () => () => <section data-testid="sponsors" />);
jest.mock('../components/home/PillarsSection', () => () => <section data-testid="pillars" />);
jest.mock('../components/home/HappeningsSection', () => () => <section data-testid="happenings" />);

test('renders navbar and all 5 sections', () => {
  render(<Home />);
  expect(screen.getByTestId('navbar')).toBeInTheDocument();
  expect(screen.getByTestId('hero')).toBeInTheDocument();
  expect(screen.getByTestId('mission')).toBeInTheDocument();
  expect(screen.getByTestId('sponsors')).toBeInTheDocument();
  expect(screen.getByTestId('pillars')).toBeInTheDocument();
  expect(screen.getByTestId('happenings')).toBeInTheDocument();
});
