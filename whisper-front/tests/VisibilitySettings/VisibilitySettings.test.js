import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TextMessage from '@/components/TextMessage/TextMessage';
import VisibilitySettings from '@/components/VisibiltySettings/VisibilitySettings';

describe('TextMessage Component', () => {
  it('renders the message correctly', () => {
    render(<VisibilitySettings/>);

    expect(screen.getByText("Visibility settings")).toBeInTheDocument();
  });

  
});
