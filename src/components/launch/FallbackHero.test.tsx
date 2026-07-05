import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FallbackHero from './FallbackHero';

describe('FallbackHero', () => {
  it('renders the hero section with a decorative background image', () => {
    render(<FallbackHero imageSrc="/images/launch-fallback.jpg" />);

    const section = screen.getByTestId('fallback-hero');
    expect(section).toBeInTheDocument();

    const img = section.querySelector('img');
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute('alt', '');
  });

  it('renders the CopyOverlay headline on top of the image', () => {
    render(<FallbackHero imageSrc="/images/launch-fallback.jpg" />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
