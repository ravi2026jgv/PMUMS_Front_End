import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portal selection screen', () => {
  render(<App />);
  expect(screen.getByText(/select your portal/i)).toBeInTheDocument();
  expect(screen.getByText(/portal 1/i)).toBeInTheDocument();
});
