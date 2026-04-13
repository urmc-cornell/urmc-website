import { render, screen } from '@testing-library/react';
import MissionSection from './MissionSection';

test('renders mission statement', () => {
  render(<MissionSection />);
  expect(screen.getByText(/advance diversity in computing/i)).toBeInTheDocument();
});

test('renders "purpose of URMC" highlight span', () => {
  render(<MissionSection />);
  expect(screen.getByText(/purpose of URMC/i)).toBeInTheDocument();
});
