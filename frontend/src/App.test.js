import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Mock the api module
jest.mock('./api/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
}));

test('renders navbar', () => {
  render(<App />);
  const homeLink = screen.getByText(/home/i);
  expect(homeLink).toBeInTheDocument();
});
