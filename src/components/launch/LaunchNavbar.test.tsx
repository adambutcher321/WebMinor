import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LaunchNavbar from './LaunchNavbar';

describe('LaunchNavbar', () => {
  it('renders the WebMinor logo link and a contact CTA', () => {
    render(<LaunchNavbar />);

    expect(screen.getByRole('link', { name: /webminor/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '/contact');
  });
});
