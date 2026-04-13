import { render, screen, fireEvent } from '@testing-library/react';
import PillarsSection from './PillarsSection';

test('renders Our 3 Pillars heading', () => {
  render(<PillarsSection />);
  expect(screen.getByText('Our 3 Pillars')).toBeInTheDocument();
});

test('renders all 3 pillar titles', () => {
  render(<PillarsSection />);
  expect(screen.getAllByText('Academic Support').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Professional Development').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Community Building').length).toBeGreaterThan(0);
});

test('pillar description text is in the DOM', () => {
  render(<PillarsSection />);
  expect(screen.getByText(/collaborative resources and structured guidance/i)).toBeInTheDocument();
  expect(screen.getByText(/hands-on career support/i)).toBeInTheDocument();
  expect(screen.getByText(/strong, supportive community/i)).toBeInTheDocument();
});

test('hovering a pillar card adds active class', () => {
  render(<PillarsSection />);
  const cards = document.querySelectorAll('.pillar-card');
  fireEvent.mouseEnter(cards[0]);
  expect(cards[0].classList.contains('pillar-card--active')).toBe(true);
  fireEvent.mouseLeave(cards[0]);
  expect(cards[0].classList.contains('pillar-card--active')).toBe(false);
});
