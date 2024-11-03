import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders learn react link', () => {
    render(<App />);
    const link = screen.getByText(/learn react/i);
    expect(link).toBeInTheDocument();
  });
});
