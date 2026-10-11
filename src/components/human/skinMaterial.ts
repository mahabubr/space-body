import * as THREE from "three";

export type SkinToneId = "natural" | "fair" | "olive" | "tan" | "deep";

export interface SkinTonePreset {
  id: SkinToneId;
  name: string;
  color: string;
  sheenColor: string;
  subsurfaceColor: string;
}

export const SKIN_TONES: Record<SkinToneId, SkinTonePreset> = {
  natural: {
    id: "natural",
    name: "Warm Natural",
    color: "#e2ad8b",
    sheenColor: "#ffd6c0",
    subsurfaceColor: "#e66e54",
  },
  fair: {
    id: "fair",
    name: "Fair Peach",
    color: "#f3ccb7",
    sheenColor: "#ffe7db",
    subsurfaceColor: "#f79e91",
  },
  olive: {
    id: "olive",
    name: "Golden Olive",
    color: "#cca078",
    sheenColor: "#f1dfd1",
    subsurfaceColor: "#c8674d",
  },
  tan: {
    id: "tan",
    name: "Warm Bronze",
    color: "#ab754f",
    sheenColor: "#e0c09a",
    subsurfaceColor: "#9e432b",
  },
  deep: {
    id: "deep",
    name: "Rich Umber",
    color: "#5c3926",
    sheenColor: "#85583b",
    subsurfaceColor: "#59251d",
  },
};

/**
 * Generate a procedural micro-pore / dermal cellular noise bump texture
 * completely in code without requiring any external image assets.
 */
export function createProceduralSkinBumpTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    // Multi-frequency cellular dermatoglyphic grain
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;

        const n1 = Math.sin(x * 0.45) * Math.cos(y * 0.45);
        const n2 = Math.sin(x * 0.95 + 1.2) * Math.sin(y * 0.95 + 2.1);
        const n3 = Math.cos((x + y) * 1.8);
        const grain = (Math.random() - 0.5) * 0.22;

        const val = Math.floor(
          128 + (n1 * 0.35 + n2 * 0.25 + n3 * 0.15 + grain) * 40
        );
        const clamped = Math.max(0, Math.min(255, val));

        data[idx] = clamped;
        data[idx + 1] = clamped;
        data[idx + 2] = clamped;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 32);
  texture.needsUpdate = true;
  return texture;
}

let cachedBumpTexture: THREE.CanvasTexture | null = null;

export function getSkinBumpTexture(): THREE.CanvasTexture {
  if (!cachedBumpTexture && typeof document !== "undefined") {
    cachedBumpTexture = createProceduralSkinBumpTexture();
  }
  return cachedBumpTexture!;
}

/**
 * Create a realistic Three.js MeshPhysicalMaterial for natural human skin
 */
export function createSkinMaterial(
  toneId: SkinToneId = "natural"
): THREE.MeshPhysicalMaterial {
  const preset = SKIN_TONES[toneId] || SKIN_TONES.natural;
  const bump = getSkinBumpTexture();

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(preset.color),
    roughness: 0.50,
    metalness: 0.0,
    clearcoat: 0.14,
    clearcoatRoughness: 0.38,
    sheen: 0.45,
    sheenColor: new THREE.Color(preset.sheenColor),
    reflectivity: 0.45,
    ior: 1.45,
    bumpMap: bump,
    bumpScale: 0.0008,
    side: THREE.DoubleSide,
  });
}

/**
 * High-End Futuristic Holographic Obsidian Base Material
 * Provides deep volumetric depth and occludes back-facing wireframe edges
 */
export function createWireBaseMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#050f1d"),
    roughness: 0.36,
    metalness: 0.15,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    reflectivity: 0.6,
    side: THREE.DoubleSide,
  });
}

/**
 * Luminous Electric Cyan Wireframe Vector Line Material
 */
export function createWireLineMaterial(): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color("#00f0ff"),
    transparent: true,
    opacity: 0.90,
  });
}
