/**
 * Framework-agnostic Web Audio wrapper around an <audio> element. Exposes
 * three smoothed frequency bands as plain mutable numbers (not React state)
 * so the R3F render loop can read them every frame without triggering
 * re-renders or allocating — the same "ref, not state" pattern as the Lenis
 * scroll provider.
 *
 * AudioContext must be created/resumed from inside a user-gesture handler
 * (browser autoplay policy) — see resume().
 */

export interface FrequencyBands {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
}

const FFT_SIZE = 1024;
// Rough band edges for a 44.1kHz-ish source at fftSize=1024 (bin width ~43Hz).
const BASS_RANGE: [number, number] = [0, 8]; // ~0-345Hz
const MID_RANGE: [number, number] = [8, 64]; // ~345Hz-2.7kHz
const TREBLE_RANGE: [number, number] = [64, 200]; // ~2.7kHz-8.6kHz

export class TrackAnalyser {
  readonly bands: FrequencyBands = { bass: 0, mid: 0, treble: 0, energy: 0 };

  private context: AudioContext;
  private analyserNode: AnalyserNode;
  private sourceNode: MediaElementAudioSourceNode;
  private data: Uint8Array<ArrayBuffer>;

  constructor(audioEl: HTMLAudioElement) {
    this.context = new AudioContext();
    this.analyserNode = this.context.createAnalyser();
    this.analyserNode.fftSize = FFT_SIZE;
    this.analyserNode.smoothingTimeConstant = 0.82;

    this.sourceNode = this.context.createMediaElementSource(audioEl);
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.context.destination);

    this.data = new Uint8Array(
      new ArrayBuffer(this.analyserNode.frequencyBinCount),
    );
  }

  /** Must be called from within a user-gesture event handler. */
  async resume(): Promise<void> {
    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  /** Call once per animation frame; mutates `bands` in place. */
  update(): void {
    this.analyserNode.getByteFrequencyData(this.data);
    this.bands.bass = averageRange(this.data, BASS_RANGE);
    this.bands.mid = averageRange(this.data, MID_RANGE);
    this.bands.treble = averageRange(this.data, TREBLE_RANGE);
    this.bands.energy =
      (this.bands.bass + this.bands.mid + this.bands.treble) / 3;
  }

  dispose(): void {
    this.sourceNode.disconnect();
    this.analyserNode.disconnect();
    void this.context.close();
  }
}

function averageRange(data: Uint8Array, [lo, hi]: [number, number]): number {
  const end = Math.min(hi, data.length);
  if (end <= lo) return 0;
  let sum = 0;
  for (let i = lo; i < end; i++) sum += data[i];
  return sum / (end - lo) / 255;
}
