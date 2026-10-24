import * as THREE from "three";

const textureCache = new Map<string, THREE.CanvasTexture>();

export function getBrainTexture(): THREE.CanvasTexture {
  if (textureCache.has("brain")) return textureCache.get("brain")!;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f472b6";
  ctx.fillRect(0, 0, 512, 512);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

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

  const limbalGrad = ctx.createRadialGradient(cx, cy, 180, cx, cy, radius);
  limbalGrad.addColorStop(0, "#0284c7");
  limbalGrad.addColorStop(0.85, "#0369a1");
  limbalGrad.addColorStop(1, "#0f172a");
  ctx.fillStyle = limbalGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

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

  const collaretteGrad = ctx.createRadialGradient(cx, cy, 55, cx, cy, 100);
  collaretteGrad.addColorStop(0, "rgba(202, 138, 4, 0.45)");
  collaretteGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.3)");
  collaretteGrad.addColorStop(1, "rgba(2, 132, 199, 0)");
  ctx.fillStyle = collaretteGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#09090b";
  ctx.beginPath();
  ctx.arc(cx, cy, 62, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(cx - 30, cy - 35, 14, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set("iris", texture);
  return texture;
}
