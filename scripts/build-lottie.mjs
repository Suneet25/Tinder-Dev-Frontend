// Generates the Lottie animations in src/assets/lottie/.
//
//   npm run lottie
//
// The animations are small and geometric, so they are described here in code
// (shapes, colours, keyframes) instead of being exported from After Effects.
// Edit a definition below, re-run the script and commit the JSON it writes.
// Docs for the format: https://lottiefiles.github.io/lottie-docs/

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "../src/assets/lottie");
const FPS = 30;

// ---------- helpers ----------

const hex = (color, alpha = 1) => {
  const n = parseInt(color.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, alpha].map((v) => +v.toFixed(4));
};

const EASE = { o: { x: 0.33, y: 0 }, i: { x: 0.2, y: 1 } };
const LINEAR = { o: { x: 0, y: 0 }, i: { x: 1, y: 1 } };

// Marks an animated value: frames([0, 100], [15, 30], [30, 100]) means
// value 100 at frame 0, 30 at frame 15, back to 100 at frame 30.
const frames = (...keyframes) => ({ keyframes });

// A Lottie property: static unless given frames(...)
function prop(value, ease = EASE) {
  if (!value?.keyframes) return { a: 0, k: value };
  return {
    a: 1,
    k: value.keyframes.map(([t, v], i) => {
      const s = Array.isArray(v) ? v : [v];
      if (i === value.keyframes.length - 1) return { t, s };
      const dims = (n) => Array(s.length).fill(n);
      return { t, s, o: { x: dims(ease.o.x), y: dims(ease.o.y) }, i: { x: dims(ease.i.x), y: dims(ease.i.y) } };
    }),
  };
}

// Layer transform. Positions are [x, y, 0] and scales [x%, y%, 100] in Lottie.
const transform = ({ position = [0, 0, 0], scale = [100, 100, 100], opacity = 100, rotation = 0, ease } = {}) => ({
  o: prop(opacity, ease),
  r: prop(rotation, ease),
  p: prop(position, ease),
  a: prop([0, 0, 0]),
  s: prop(scale, ease),
});

const groupTransform = () => ({
  ty: "tr",
  p: prop([0, 0]),
  a: prop([0, 0]),
  s: prop([100, 100]),
  r: prop(0),
  o: prop(100),
  sk: prop(0),
  sa: prop(0),
});

const group = (name, items) => ({ ty: "gr", nm: name, it: [...items, groupTransform()] });
const ellipse = (diameter, position = [0, 0]) => ({ ty: "el", d: 1, p: prop(position), s: prop([diameter, diameter]) });
const rect = (w, h, radius, position = [0, 0]) => ({ ty: "rc", d: 1, p: prop(position), s: prop([w, h]), r: prop(radius) });
const fill = (color) => ({ ty: "fl", c: prop(hex(color)), o: prop(100), r: 1 });
const stroke = (color, width) => ({ ty: "st", c: prop(hex(color)), o: prop(100), w: prop(width), lc: 2, lj: 2 });
const trimEnd = (keyframes) => ({ ty: "tm", s: prop(0), e: prop(keyframes), o: prop(0), m: 1 });
const path = ({ v, i, o }) => ({ ty: "sh", ks: prop({ v, i, o, c: true }) });

const layer = (index, name, op, shapes, ks) => ({ ddd: 0, ind: index, ty: 4, nm: name, sr: 1, ks, ao: 0, shapes, ip: 0, op, st: 0, bm: 0 });

const animation = (name, w, h, op, layers) => ({ v: "5.7.4", fr: FPS, ip: 0, op, w, h, nm: name, ddd: 0, assets: [], layers });

// The app's heart icon (24x24 viewBox), as Lottie bezier points centred on 0,0
const HEART = (() => {
  const shift = ([x, y]) => [+(x - 12).toFixed(2), +(y - 12.75).toFixed(2)];
  return {
    v: [[12, 21], [2.5, 11.7], [7, 4.5], [12, 7.5], [17, 4.5], [21.5, 11.7]].map(shift),
    i: [[0, 0], [2, 4.7], [-3.7, 0], [-1.4, -1.8], [-2.1, 0], [1.3, -3.3]],
    o: [[0, 0], [-1.3, -3.3], [2.1, 0], [1.4, -1.8], [3.7, 0], [-2, 4.7]],
  };
})();

// ---------- animations ----------

// Pulsing heart badge, loops every 1.8s (landing hero)
function heartbeat() {
  const op = 54;
  const pulse = frames(...[[0, 100], [14, 114], [27, 100], [40, 108], [54, 100]].map(([t, s]) => [t, [s, s, 100]]));
  // Shapes listed front to back: heart on top of the disc on top of the halo
  const shapes = [group("heart", [path(HEART), fill("#0E0F13")]), group("disc", [ellipse(44), fill("#FF6B4A")]), group("halo", [ellipse(60), fill("#2A1A16")])];
  return animation("heartbeat", 64, 64, op, [layer(1, "badge", op, shapes, transform({ position: [32, 32, 0], scale: pulse }))]);
}

// "Someone is typing" bubble with three fading dots, loops every second
function typing() {
  const op = 30;
  // Each dot fades 100 -> 30 -> 100 over the loop, the later ones offset by 6 frames
  const dot = (index, x, opacity) =>
    layer(index, `dot ${index}`, op, [group("dot", [ellipse(7), fill("#A0A6B4")])], transform({ position: [x, 15, 0], opacity, ease: LINEAR }));
  // Layers listed front to back: dots above the bubble
  return animation("typing", 56, 30, op, [
    dot(1, 16, frames([0, 100], [15, 30], [30, 100])),
    dot(2, 28, frames([0, 72], [6, 100], [21, 30], [30, 72])),
    dot(3, 40, frames([0, 44], [12, 100], [27, 30], [30, 44])),
    layer(4, "bubble", op, [group("bubble", [rect(56, 30, 15), fill("#262A34")])], transform({ position: [28, 15, 0] })),
  ]);
}

// Compatibility ring filling to 92%, then holding; loops every 3s
function matchRing() {
  const op = 90;
  return animation("match-ring", 88, 88, op, [
    layer(1, "progress", op, [group("progress", [ellipse(72), trimEnd(frames([0, 0], [45, 92], [90, 92])), stroke("#4FD1C5", 8)])], transform({ position: [44, 44, 0] })),
    layer(2, "track", op, [group("track", [ellipse(72), stroke("#2A2E39", 8)])], transform({ position: [44, 44, 0] })),
  ]);
}

// One-shot burst behind the membership tick on the payment success screen.
// Frame 0 is empty, so with reduced motion (no autoplay) nothing shows.
function successBurst() {
  const op = 45;
  const size = 200;
  const c = size / 2;
  const colors = ["#FF6B4A", "#4FD1C5", "#B79CFF", "#F5C451"];
  const particles = Array.from({ length: 8 }, (_, k) => {
    const angle = (k * Math.PI) / 4 + Math.PI / 8;
    const at = (r) => [+(c + Math.cos(angle) * r).toFixed(1), +(c + Math.sin(angle) * r).toFixed(1), 0];
    return layer(
      k + 2,
      `particle ${k + 1}`,
      op,
      [group("particle", [ellipse(k % 2 ? 8 : 11), fill(colors[k % colors.length])])],
      transform({ position: frames([0, at(44)], [30, at(92)]), opacity: frames([0, 0], [3, 100], [24, 100], [42, 0]) }),
    );
  });
  const ring = layer(
    1,
    "ring",
    op,
    [group("ring", [ellipse(100), stroke("#4FD1C5", 5)])],
    transform({ position: [c, c, 0], scale: frames([0, [60, 60, 100]], [32, [170, 170, 100]]), opacity: frames([0, 0], [3, 90], [32, 0]) }),
  );
  return animation("success-burst", size, size, op, [ring, ...particles]);
}

// ---------- write ----------

const ANIMATIONS = { heartbeat, typing, "match-ring": matchRing, "success-burst": successBurst };

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, build] of Object.entries(ANIMATIONS)) {
  const file = join(OUT_DIR, `${name}.json`);
  writeFileSync(file, JSON.stringify(build()) + "\n");
  console.log(`wrote ${file}`);
}
