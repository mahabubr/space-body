import * as THREE from "three";

const textureCache = new Map<string, THREE.CanvasTexture>();

export function getBrainTexture(): THREE.CanvasTexture {
  if (textureCache.has("brain")) return textureCache.get("brain")!;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Anatomical cerebral cortex base color
  const baseGrad = ctx.createLinearGradient(0, 0, 512, 512);
  baseGrad.addColorStop(0, "#e89ea5");
  baseGrad.addColorStop(0.5, "#d9868e");
  baseGrad.addColorStop(1, "#c57078");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 512, 512);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Primary deep sulci (sulcal fissures)
  ctx.strokeStyle = "#5c132b";
  ctx.lineWidth = 6;
  for (let i = 0; i < 65; i++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    const cx1 = sx + (Math.random() - 0.5) * 90;
    const cy1 = sy + (Math.random() - 0.5) * 90;
    const cx2 = cx1 + (Math.random() - 0.5) * 90;
    const cy2 = cy1 + (Math.random() - 0.5) * 90;
    const ex = cx2 + (Math.random() - 0.5) * 70;
    const ey = cy2 + (Math.random() - 0.5) * 70;
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, ex, ey);
    ctx.stroke();
  }

  // Secondary cortical gyri (convoluted fold ridges)
  ctx.strokeStyle = "#8b2641";
  ctx.lineWidth = 3.5;
  for (let i = 0; i < 90; i++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    const cx1 = sx + (Math.random() - 0.5) * 60;
    const cy1 = sy + (Math.random() - 0.5) * 60;
    const ex = cx1 + (Math.random() - 0.5) * 60;
    const ey = cy1 + (Math.random() - 0.5) * 60;
    ctx.quadraticCurveTo(cx1, cy1, ex, ey);
    ctx.stroke();
  }

  // Cortical highlights on gyral crests
  ctx.strokeStyle = "rgba(255, 218, 222, 0.45)";
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 75; i++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(
      sx + (Math.random() - 0.5) * 45,
      sy + (Math.random() - 0.5) * 45,
      sx + (Math.random() - 0.5) * 65,
      sy + (Math.random() - 0.5) * 65
    );
    ctx.stroke();
  }

  // Microvascular network (pial arterioles and cerebral venules that dilate with fluid shift)
  ctx.strokeStyle = "rgba(180, 20, 45, 0.55)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 45; i++) {
    let px = Math.random() * 512;
    let py = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(px, py);
    for (let step = 0; step < 4; step++) {
      px += (Math.random() - 0.45) * 28;
      py += (Math.random() - 0.5) * 28;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set("brain", texture);
  return texture;
}

/**
 * Photorealistic Anatomical Iris Texture
 * Features multilayered stroma fibers, pupillary collarette, crypts of Fuchs,
 * dark limbal boundary ring, and deep velvet-black pupil.
 * Note: Specular reflection is omitted from the 2D texture so the 3D cornea provides
 * physically accurate dynamic reflections matching scene lighting.
 */
export function getIrisTexture(): THREE.CanvasTexture {
  if (textureCache.has("iris")) return textureCache.get("iris")!;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const cx = 256;
  const cy = 256;
  const radius = 248;

  // Clear transparent canvas background
  ctx.clearRect(0, 0, 512, 512);

  // Outer dark limbal ring with deep blue-slate gradient
  const limbalGrad = ctx.createRadialGradient(cx, cy, 160, cx, cy, radius);
  limbalGrad.addColorStop(0, "#0284c7");
  limbalGrad.addColorStop(0.55, "#0369a1");
  limbalGrad.addColorStop(0.88, "#07203d");
  limbalGrad.addColorStop(1, "#020617");
  ctx.fillStyle = limbalGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Primary radiating stroma fibers (iridial trabeculae)
  for (let a = 0; a < Math.PI * 2; a += 0.012) {
    const rOuter = radius * (0.88 + Math.random() * 0.12);
    const rInner = 50 + Math.random() * 18;
    const cos = Math.cos(a);
    const sin = Math.sin(a);

    ctx.strokeStyle =
      Math.random() > 0.4
        ? "rgba(186, 230, 253, 0.90)"
        : "rgba(56, 189, 248, 0.80)";
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(cx + cos * rInner, cy + sin * rInner);
    ctx.lineTo(cx + cos * rOuter, cy + sin * rOuter);
    ctx.stroke();
  }

  // Intermediary finer fibers for high optical resolution
  for (let a = 0; a < Math.PI * 2; a += 0.008) {
    const rOuter = radius * (0.75 + Math.random() * 0.22);
    const rInner = 60 + Math.random() * 25;
    const cos = Math.cos(a);
    const sin = Math.sin(a);

    ctx.strokeStyle = "rgba(14, 165, 233, 0.65)";
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(cx + cos * rInner, cy + sin * rInner);
    ctx.lineTo(cx + cos * rOuter, cy + sin * rOuter);
    ctx.stroke();
  }

  // Pupillary collarette ring (zigzag autonomic border separating ciliary & pupillary zones)
  const collaretteGrad = ctx.createRadialGradient(cx, cy, 48, cx, cy, 115);
  collaretteGrad.addColorStop(0, "rgba(245, 158, 11, 0.55)");
  collaretteGrad.addColorStop(0.5, "rgba(217, 119, 6, 0.40)");
  collaretteGrad.addColorStop(0.85, "rgba(56, 189, 248, 0.35)");
  collaretteGrad.addColorStop(1, "rgba(2, 132, 199, 0)");
  ctx.fillStyle = collaretteGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 115, 0, Math.PI * 2);
  ctx.fill();

  // Pigment frill / pupillary ruff at pupil margin
  const ruffGrad = ctx.createRadialGradient(cx, cy, 52, cx, cy, 62);
  ruffGrad.addColorStop(0, "#050b14");
  ruffGrad.addColorStop(0.7, "#78350f");
  ruffGrad.addColorStop(1, "rgba(120, 53, 15, 0)");
  ctx.fillStyle = ruffGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 62, 0, Math.PI * 2);
  ctx.fill();

  // Pure velvet-black central pupil aperture
  ctx.fillStyle = "#020408";
  ctx.beginPath();
  ctx.arc(cx, cy, 54, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set("iris", texture);
  return texture;
}

/**
 * Anatomical Sclera Texture
 * Procedural episcleral micro-capillary branching network over ivory-white globe.
 * Provides living, photorealistic microvasculature with subtle ciliary flush near limbus.
 */
export function getScleraTexture(): THREE.CanvasTexture {
  if (textureCache.has("sclera")) return textureCache.get("sclera")!;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Smooth warm ivory-white scleral base
  const baseGrad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  baseGrad.addColorStop(0, "#ffffff");
  baseGrad.addColorStop(0.65, "#f8fafc");
  baseGrad.addColorStop(1, "#f1f5f9");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 512, 512);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Episcleral and conjunctival arterial micro-vessels
  const vesselCount = 38;
  for (let i = 0; i < vesselCount; i++) {
    const angle = (i / vesselCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
    // Start from equator/periphery and branch toward anterior pole
    let r = 240 + (Math.random() - 0.5) * 20;
    let x = 256 + Math.cos(angle) * r;
    let y = 256 + Math.sin(angle) * r;

    ctx.strokeStyle =
      Math.random() > 0.3
        ? "rgba(220, 38, 38, 0.42)"
        : "rgba(185, 28, 28, 0.28)";
    ctx.lineWidth = 1.25 + Math.random() * 0.8;

    ctx.beginPath();
    ctx.moveTo(x, y);

    const steps = 7 + Math.floor(Math.random() * 6);
    for (let s = 0; s < steps; s++) {
      r -= 18 + Math.random() * 10;
      if (r < 65) break; // Keep clear around anterior limbus
      const branchAngle = angle + (Math.random() - 0.5) * 0.35;
      x = 256 + Math.cos(branchAngle) * r;
      y = 256 + Math.sin(branchAngle) * r;
      ctx.lineTo(x, y);

      // Subtle lateral capillary bifurcations
      if (Math.random() > 0.65) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        const subAngle = branchAngle + (Math.random() > 0.5 ? 0.35 : -0.35);
        const subX = 256 + Math.cos(subAngle) * (r - 12);
        const subY = 256 + Math.sin(subAngle) * (r - 12);
        ctx.lineTo(subX, subY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
    ctx.stroke();
  }

  // Soft ciliary perilimbal flush (faint pinkish ring around anterior cornea junction)
  const limbalFlush = ctx.createRadialGradient(256, 256, 55, 256, 256, 85);
  limbalFlush.addColorStop(0, "rgba(239, 68, 68, 0)");
  limbalFlush.addColorStop(0.5, "rgba(244, 63, 94, 0.12)");
  limbalFlush.addColorStop(1, "rgba(239, 68, 68, 0)");
  ctx.fillStyle = limbalFlush;
  ctx.beginPath();
  ctx.arc(256, 256, 85, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set("sclera", texture);
  return texture;
}
