import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CopyOverlay from './CopyOverlay';

describe('CopyOverlay', () => {
  it('renders a real h1 headline', () => {
    render(<CopyOverlay />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/we don't build websites/i);
    expect(heading).toHaveTextContent(/we launch businesses/i);
  });

  it('renders two keyboard-focusable CTA links', () => {
    render(<CopyOverlay />);
    const primary = screen.getByRole('link', { name: /launch your project/i });
    const secondary = screen.getByRole('link', { name: /view our work/i });

    expect(primary.tagName).toBe('A');
    expect(secondary.tagName).toBe('A');
    expect(primary).toHaveAttribute('href', '/contact');
  });

  it('forwards extra props (e.g. data attributes) to the root element', () => {
    render(<CopyOverlay data-launch-copy="" />);
    expect(document.querySelector('[data-launch-copy]')).not.toBeNull();
  });
});
