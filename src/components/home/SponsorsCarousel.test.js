import { render, screen } from '@testing-library/react';
import SponsorsCarousel from './SponsorsCarousel';

jest.mock('react-slick', () => {
  return function MockSlider({ children }) {
    return <div data-testid="slider">{children}</div>;
  };
});

test('renders Our Sponsors heading', () => {
  render(<SponsorsCarousel />);
  expect(screen.getByText('Our Sponsors')).toBeInTheDocument();
});

test('renders all 11 sponsor logos', () => {
  render(<SponsorsCarousel />);
  const sponsors = [
    'Accenture', 'Bloomberg', 'Capital One', 'Datadog', 'EY',
    'Figma', 'HRT', 'Jane Street', 'LinkedIn', 'Roblox', 'Visa',
  ];
  sponsors.forEach(name => {
    expect(screen.getByAltText(name)).toBeInTheDocument();
  });
});

test('slider is rendered', () => {
  render(<SponsorsCarousel />);
  expect(screen.getByTestId('slider')).toBeInTheDocument();
});
