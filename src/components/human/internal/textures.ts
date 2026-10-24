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

export function getIrisTexture(): THREE.CanvasTexture {
  if (textureCache.has("iris")) return textureCache.get("iris")!;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const cx = 256;
  const cy = 256;
  const radius = 240;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 512);

  // Outer limbal ring with deep blue-slate gradient
  const limbalGrad = ctx.createRadialGradient(cx, cy, 175, cx, cy, radius);
  limbalGrad.addColorStop(0, "#0284c7");
  limbalGrad.addColorStop(0.75, "#0369a1");
  limbalGrad.addColorStop(1, "#091728");
  ctx.fillStyle = limbalGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Radial stroma fibers
  for (let a = 0; a < Math.PI * 2; a += 0.015) {
    const rOuter = radius * (0.86 + Math.random() * 0.14);
    const rInner = 56 + Math.random() * 20;
    const cos = Math.cos(a);
    const sin = Math.sin(a);

    ctx.strokeStyle =
      Math.random() > 0.35
        ? "rgba(186, 230, 253, 0.85)"
        : "rgba(56, 189, 248, 0.75)";
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(cx + cos * rInner, cy + sin * rInner);
    ctx.lineTo(cx + cos * rOuter, cy + sin * rOuter);
    ctx.stroke();
  }

  // Pupillary collarette ring
  const collaretteGrad = ctx.createRadialGradient(cx, cy, 52, cx, cy, 105);
  collaretteGrad.addColorStop(0, "rgba(217, 119, 6, 0.4)");
  collaretteGrad.addColorStop(0.65, "rgba(56, 189, 248, 0.35)");
  collaretteGrad.addColorStop(1, "rgba(2, 132, 199, 0)");
  ctx.fillStyle = collaretteGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fill();

  // Pupil aperture
  ctx.fillStyle = "#030712";
  ctx.beginPath();
  ctx.arc(cx, cy, 58, 0, Math.PI * 2);
  ctx.fill();

  // Corneal specular reflection
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.beginPath();
  ctx.arc(cx - 28, cy - 32, 13, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set("iris", texture);
  return texture;
}
