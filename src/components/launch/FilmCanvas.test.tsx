import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import FilmCanvas from './FilmCanvas';

describe('FilmCanvas', () => {
  it('renders a decorative full-bleed canvas', () => {
    const progressRef = { current: { value: 0 } };
    const { getByTestId } = render(<FilmCanvas progressRef={progressRef} />);

    const canvas = getByTestId('film-canvas');
    expect(canvas.tagName).toBe('CANVAS');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });
});
