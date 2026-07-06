import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TelemetryHud from './TelemetryHud';

describe('TelemetryHud', () => {
  it('renders the mission readout at T-zero', () => {
    const progressRef = { current: { value: 0 } };
    render(<TelemetryHud progressRef={progressRef} />);

    const hud = screen.getByTestId('telemetry-hud');
    expect(hud).toHaveAttribute('aria-hidden', 'true');
    expect(hud).toHaveTextContent('T+ 00:00');
    expect(hud).toHaveTextContent('ALT 000 KM');
    expect(hud).toHaveTextContent('WEBMINOR — MISSION 001');
  });
});
