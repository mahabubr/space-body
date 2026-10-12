import * as THREE from "three";

// Cache textures so they are only created once
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Procedural Realistic Bone Texture (Ivory / Calcite with osteon micro-detail)
 */
export function getBoneTexture(): THREE.CanvasTexture {
  if (textureCache.has("bone")) return textureCache.get("bone")!;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Base ivory bone gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, "#f9f6ee");
  grad.addColorStop(0.5, "#ede5d2");
  grad.addColorStop(1, "#dfd5be");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Micro-pores and osteon grain
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 18;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.95));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.85));
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle bone striations / haversian canals
  ctx.strokeStyle = "rgba(180, 165, 140, 0.15)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      170,
      y + (Math.random() - 0.5) * 20,
      340,
      y + (Math.random() - 0.5) * 20,
      512,
      y + (Math.random() - 0.5) * 10
    );
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set("bone", texture);
  return texture;
}

/**
 * Procedural Striated Muscle Texture (Deep crimson myofibrils with directional grain)
 */
export function getMuscleTexture(): THREE.CanvasTexture {
  if (textureCache.has("muscle")) return textureCache.get("muscle")!;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Deep rich crimson background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, "#a81d24");
  bgGrad.addColorStop(0.5, "#93131a");
  bgGrad.addColorStop(1, "#7f0f15");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Longitudinal striated myofibril fascicle lines
  for (let y = 0; y < 512; y += 2) {
    const isBright = Math.random() > 0.45;
    const isTendonWhite = Math.random() > 0.96;

    if (isTendonWhite) {
      ctx.strokeStyle = "rgba(240, 230, 230, 0.4)";
      ctx.lineWidth = 0.8;
    } else if (isBright) {
      ctx.strokeStyle = "rgba(239, 68, 68, 0.45)";
      ctx.lineWidth = 1.2;
    } else {
      ctx.strokeStyle = "rgba(100, 10, 15, 0.55)";
      ctx.lineWidth = 1.5;
    }

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      150,
      y + (Math.random() - 0.5) * 4,
      350,
      y + (Math.random() - 0.5) * 4,
      512,
      y
    );
    ctx.stroke();
  }

  // Cross-striations (Z-discs in skeletal muscle)
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  for (let x = 0; x < 512; x += 12) {
    ctx.fillRect(x, 0, 2, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  textureCache.set("muscle", texture);
  return texture;
}

/**
 * Procedural White Tendon & Fascia Texture (Fibrous pearlescent white)
 */
export function getTendonTexture(): THREE.CanvasTexture {
  if (textureCache.has("tendon")) return textureCache.get("tendon")!;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = "rgba(203, 213, 225, 0.4)";
  ctx.lineWidth = 1;
  for (let y = 0; y < 256; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y + (Math.random() - 0.5) * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set("tendon", texture);
  return texture;
}

/**
 * Procedural Brain Texture (Coral / pink gyri convolutions & shaded sulci)
 */
export function getBrainTexture(): THREE.CanvasTexture {
  if (textureCache.has("brain")) return textureCache.get("brain")!;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Pinkish-coral base
  ctx.fillStyle = "#f472b6";
  ctx.fillRect(0, 0, 512, 512);

  // Worm-like gyri convolutions
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Sulci deep grooves
  ctx.strokeStyle = "#9d174d";
  ctx.lineWidth = 7;
  for (let i = 0; i < 70; i++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    const cx1 = sx + (Math.random() - 0.5) * 80;
    const cy1 = sy + (Math.random() - 0.5) * 80;
    const cx2 = cx1 + (Math.random() - 0.5) * 80;
    const cy2 = cy1 + (Math.random() - 0.5) * 80;
    const ex = cx2 + (Math.random() - 0.5) * 60;
    const ey = cy2 + (Math.random() - 0.5) * 60;
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, ex, ey);
    ctx.stroke();
  }

  // Gyri top highlights
  ctx.strokeStyle = "#fbcfe8";
  ctx.lineWidth = 3.5;
  for (let i = 0; i < 50; i++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(
      sx + (Math.random() - 0.5) * 50,
      sy + (Math.random() - 0.5) * 50,
      sx + (Math.random() - 0.5) * 70,
      sy + (Math.random() - 0.5) * 70
    );
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set("brain", texture);
  return texture;
}

/**
 * Procedural Realistic Blue Human Iris Texture
 */
export function getIrisTexture(): THREE.CanvasTexture {
  if (textureCache.has("iris")) return textureCache.get("iris")!;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const cx = 256;
  const cy = 256;
  const radius = 240;

  // Outer Sclera / Limbal Ring (dark blue/charcoal border)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 512);

  const limbalGrad = ctx.createRadialGradient(cx, cy, 180, cx, cy, radius);
  limbalGrad.addColorStop(0, "#0284c7");
  limbalGrad.addColorStop(0.85, "#0369a1");
  limbalGrad.addColorStop(1, "#0f172a");
  ctx.fillStyle = limbalGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Radial Iris Stromal Fibers
  for (let a = 0; a < Math.PI * 2; a += 0.02) {
    const rOuter = radius * (0.88 + Math.random() * 0.12);
    const rInner = 60 + Math.random() * 20;
    const cos = Math.cos(a);
    const sin = Math.sin(a);

    ctx.strokeStyle =
      Math.random() > 0.4 ? "rgba(125, 211, 252, 0.85)" : "rgba(56, 189, 248, 0.7)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx + cos * rInner, cy + sin * rInner);
    ctx.lineTo(cx + cos * rOuter, cy + sin * rOuter);
    ctx.stroke();
  }

  // Inner Collarette Ring (subtle hazel/amber warmth)
  const collaretteGrad = ctx.createRadialGradient(cx, cy, 55, cx, cy, 100);
  collaretteGrad.addColorStop(0, "rgba(202, 138, 4, 0.45)");
  collaretteGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.3)");
  collaretteGrad.addColorStop(1, "rgba(2, 132, 199, 0)");
  ctx.fillStyle = collaretteGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fill();

  // Black Pupil
  ctx.fillStyle = "#09090b";
  ctx.beginPath();
  ctx.arc(cx, cy, 62, 0, Math.PI * 2);
  ctx.fill();

  // Specular gleam highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(cx - 30, cy - 35, 14, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set("iris", texture);
  return texture;
}

/**
 * Procedural Natural Human Skin Texture (warm tone with subtle pores)
 */
export function getSkinTexture(): THREE.CanvasTexture {
  if (textureCache.has("skin")) return textureCache.get("skin")!;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, "#fed7aa");
  grad.addColorStop(0.5, "#fdba74");
  grad.addColorStop(1, "#fca5a5");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set("skin", texture);
  return texture;
}
