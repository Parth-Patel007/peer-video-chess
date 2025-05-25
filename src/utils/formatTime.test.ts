// src/utils/formatTime.test.ts
import { formatTime } from './formatTime';

describe('formatTime()', () => {
  it('formats zero seconds as "0:00"', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('pads single-digit seconds', () => {
    expect(formatTime(5)).toBe('0:05');
  });

  it('handles exactly one minute', () => {
    expect(formatTime(60)).toBe('1:00');
  });

  it('handles two-digit minutes and seconds', () => {
    expect(formatTime(125)).toBe('2:05'); // 2 minutes, 5 seconds
    expect(formatTime(3599)).toBe('59:59');
  });
});
