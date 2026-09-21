/**
 * Estimates the fundamental frequency of a monophonic audio signal by
 * autocorrelation — sliding a copy of the waveform against itself and
 * finding the lag where they line up best, which is one period of the
 * fundamental. Standard technique for a real-time instrument tuner; it
 * works well on a single plucked string and poorly on a full chord or a
 * noisy room, which is exactly the tradeoff a tuner needs.
 *
 * Returns -1 when the signal is too quiet or no clear pitch is found.
 */
export function detectPitch(input: Float32Array, sampleRate: number): number {
  const size = input.length;

  // Skip near-silence — cuts out room noise between plucks rather than
  // reporting a "pitch" for it.
  let rms = 0;
  for (let i = 0; i < size; i++) rms += input[i] * input[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1;

  // Trim leading/trailing near-zero padding so a loud pluck surrounded by
  // quiet buffer edges doesn't dilute the correlation.
  const threshold = 0.2;
  let start = 0;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(input[i]) >= threshold) {
      start = i;
      break;
    }
  }
  let end = size - 1;
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(input[size - i]) >= threshold) {
      end = size - i;
      break;
    }
  }
  const buffer = input.slice(start, end);
  const n = buffer.length;
  if (n < 2) return -1;

  // Autocorrelation: for each lag, sum the products of the signal with a
  // copy of itself shifted by that lag.
  const correlations = new Array<number>(n).fill(0);
  for (let lag = 0; lag < n; lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) sum += buffer[i] * buffer[i + lag];
    correlations[lag] = sum;
  }

  // Lag 0 is always the strongest (trivial) match, so skip past its
  // initial downward slope before looking for the real peak.
  let lag = 0;
  while (lag < n - 1 && correlations[lag] > correlations[lag + 1]) lag++;

  let bestLag = -1;
  let bestValue = -Infinity;
  for (let i = lag; i < n; i++) {
    if (correlations[i] > bestValue) {
      bestValue = correlations[i];
      bestLag = i;
    }
  }
  if (bestLag <= 0) return -1;

  // Parabolic interpolation across the peak sharpens the estimate beyond
  // single-sample resolution — the difference between a tuner that's
  // merely close and one that's actually accurate to a couple of cents.
  let refinedLag = bestLag;
  if (bestLag > 0 && bestLag < n - 1) {
    const y0 = correlations[bestLag - 1];
    const y1 = correlations[bestLag];
    const y2 = correlations[bestLag + 1];
    const denominator = y0 - 2 * y1 + y2;
    if (denominator !== 0) {
      refinedLag = bestLag + 0.5 * (y0 - y2) / denominator;
    }
  }

  return sampleRate / refinedLag;
}
