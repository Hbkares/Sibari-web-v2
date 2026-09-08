// Generates a synthetic looping WAV with distinct bass/mid/treble activity
// so the audio-reactive listening room (SIB-10) can be verified without a
// real SIBARI track asset. Dev-only — replace with real CMS track audio
// once available. Run: node scripts/gen-dev-test-tone.mjs
import { writeFileSync } from "node:fs";

const SAMPLE_RATE = 44100;
const DURATION_S = 8;
const numSamples = SAMPLE_RATE * DURATION_S;
const samples = new Float32Array(numSamples);

for (let i = 0; i < numSamples; i++) {
  const t = i / SAMPLE_RATE;

  // Bass: a four-on-the-floor thump every 0.6s.
  const beatPhase = (t % 0.6) / 0.6;
  const bassEnv = Math.exp(-beatPhase * 18);
  const bass = Math.sin(2 * Math.PI * 55 * t) * bassEnv * 0.9;

  // Mid: a slow arpeggio stepping through a few tones.
  const arpNotes = [220, 277.18, 329.63, 392];
  const noteIdx = Math.floor(t / 0.3) % arpNotes.length;
  const arpEnv = Math.exp(-((t % 0.3) * 10));
  const mid = Math.sin(2 * Math.PI * arpNotes[noteIdx] * t) * arpEnv * 0.5;

  // Treble: a hi-hat-like noise burst on the offbeat.
  const hatPhase = ((t + 0.3) % 0.6) / 0.6;
  const hatEnv = Math.exp(-hatPhase * 40);
  const treble = (Math.random() * 2 - 1) * hatEnv * 0.35;

  samples[i] = Math.max(-1, Math.min(1, bass + mid + treble));
}

const bytesPerSample = 2;
const blockAlign = bytesPerSample;
const byteRate = SAMPLE_RATE * blockAlign;
const dataSize = numSamples * bytesPerSample;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16); // fmt chunk size
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(1, 22); // mono
buffer.writeUInt32LE(SAMPLE_RATE, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34); // bits per sample
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);

for (let i = 0; i < numSamples; i++) {
  const s = Math.round(samples[i] * 32767);
  buffer.writeInt16LE(s, 44 + i * 2);
}

writeFileSync(new URL("../public/dev/test-tone.wav", import.meta.url), buffer);
console.log(`Wrote public/dev/test-tone.wav (${DURATION_S}s, ${SAMPLE_RATE}Hz mono)`);
