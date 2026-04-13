import { render, screen } from '@testing-library/react';
import MissionSection from './MissionSection';

test('renders mission statement', () => {
  render(<MissionSection />);
  expect(screen.getByText(/advance diversity in computing/i)).toBeInTheDocument();
});

test('renders full mission text starting with The purpose of URMC', () => {
  render(<MissionSection />);
  expect(screen.getByText(/The purpose of URMC/i)).toBeInTheDocument();
});
