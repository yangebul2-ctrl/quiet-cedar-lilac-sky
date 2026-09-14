let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let muted = false;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC({ latencyHint: "interactive" });
  master = ctx.createGain();
  sfx = ctx.createGain();
  sfx.gain.value = 0.7;
  sfx.connect(master);
  master.connect(ctx.destination);
  master.gain.value = muted ? 0 : 0.85;
  return ctx;
}

export function unlockAudio() {
  const ac = ensure();
  if (ac.state === "suspended") void ac.resume();
}

export function setMuted(next: boolean) {
  muted = next;
  if (master && ctx) {
    master.gain.setTargetAtTime(next ? 0 : 0.85, ctx.currentTime, 0.02);
  }
}

function noiseBuffer(ac: AudioContext, seconds: number) {
  const n = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, n, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function beep(freq: number, dur: number, type: OscillatorType, gain = 0.12, slide = 0) {
  const ac = ensure();
  if (ac.state === "suspended") return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(sfx!);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfxPlay = {
  click() {
    beep(420, 0.06, "square", 0.05);
  },
  metal() {
    beep(180 + Math.random() * 40, 0.09, "sawtooth", 0.07, -80);
    beep(740, 0.05, "square", 0.03);
  },
  cap() {
    beep(220, 0.16, "triangle", 0.08, -90);
    beep(880, 0.08, "square", 0.04);
  },
  wrench() {
    beep(140, 0.05, "square", 0.06);
    beep(90, 0.08, "sawtooth", 0.05);
  },
  soap() {
    beep(920, 0.07, "sine", 0.05);
    beep(1240, 0.1, "sine", 0.03);
  },
  hiss(seconds = 0.8) {
    const ac = ensure();
    if (ac.state === "suspended") return;
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, seconds);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
    src.connect(bp);
    bp.connect(g);
    g.connect(sfx!);
    src.start(t);
    src.stop(t + seconds);
  },
  alarm() {
    beep(880, 0.18, "square", 0.09);
    beep(660, 0.22, "square", 0.08);
  },
  ok() {
    beep(523, 0.1, "sine", 0.08);
    beep(784, 0.16, "sine", 0.07);
  },
  win() {
    beep(523, 0.12, "sine", 0.08);
    beep(659, 0.14, "sine", 0.08);
    beep(784, 0.22, "sine", 0.09);
  },
  valve() {
    beep(160, 0.12, "triangle", 0.06, -40);
  },
};
