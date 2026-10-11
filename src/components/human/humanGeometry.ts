import * as THREE from "three";

/**
 * High-End Procedural 3D Human Anatomy Geometry Generator
 * Constructs an anatomically accurate, organic full-body human figure from scratch
 * using basic 3D geometry, lofted cross-sections, and pure quad-contour wireframe topology.
 * Modeled for scientific, medical, and NASA-grade bio-astronautic visualization.
 */

export interface GeometryPair {
  mesh: THREE.BufferGeometry;
  wire: THREE.BufferGeometry;
}

/**
 * Creates both a solid triangulated mesh (for depth occlusion, lighting & skin)
 * and a clean quad wireframe line geometry (pure horizontal rings + vertical meridians,
 * with ZERO diagonal artifact lines).
 */
export function createLoftedGeometryPair(
  heightSteps: number,
  radialSteps: number,
  sampleRing: (
    t: number,
    u: number
  ) => { x: number; y: number; z: number }
): GeometryPair {
  const positions: number[] = [];
  const uvs: number[] = [];
  const triangleIndices: number[] = [];
  const lineIndices: number[] = [];

  // Generate vertices
  for (let i = 0; i <= heightSteps; i++) {
    const t = i / heightSteps;
    for (let j = 0; j <= radialSteps; j++) {
      const u = j / radialSteps;
      const pt = sampleRing(t, u);
      positions.push(pt.x, pt.y, pt.z);
      uvs.push(u, t);
    }
  }

  const ringStride = radialSteps + 1;

  // 1. Generate triangle faces for solid mesh
  for (let i = 0; i < heightSteps; i++) {
    for (let j = 0; j < radialSteps; j++) {
      const a = i * ringStride + j;
      const b = (i + 1) * ringStride + j;
      const c = (i + 1) * ringStride + (j + 1);
      const d = i * ringStride + (j + 1);

      triangleIndices.push(a, b, d);
      triangleIndices.push(b, c, d);
    }
  }

  // 2. Generate pure quad wireframe edges (horizontal rings + vertical flow lines, NO diagonals)
  // Horizontal cross-section ring loops
  for (let i = 0; i <= heightSteps; i++) {
    for (let j = 0; j < radialSteps; j++) {
      const a = i * ringStride + j;
      const b = i * ringStride + (j + 1);
      lineIndices.push(a, b);
    }
  }
  // Vertical meridian flow lines
  for (let i = 0; i < heightSteps; i++) {
    for (let j = 0; j <= radialSteps; j++) {
      const a = i * ringStride + j;
      const b = (i + 1) * ringStride + j;
      lineIndices.push(a, b);
    }
  }

  const posAttr = new THREE.Float32BufferAttribute(positions, 3);
  const uvAttr = new THREE.Float32BufferAttribute(uvs, 2);

  // Solid Mesh Geometry
  const mesh = new THREE.BufferGeometry();
  mesh.setAttribute("position", posAttr);
  mesh.setAttribute("uv", uvAttr);
  mesh.setIndex(triangleIndices);
  mesh.computeVertexNormals();

  // Clean Quad Wireframe Line Geometry
  const wire = new THREE.BufferGeometry();
  wire.setAttribute("position", posAttr);
  wire.setIndex(lineIndices);

  return { mesh, wire };
}

/**
 * Procedural Torso Geometry Pair:
 * Spans from pelvic floor (y ~ 0.86m) up to clavicles/neck base (y ~ 1.44m).
 * Sculpted with organic anatomical pectorals, clavicles, rectus abdominis,
 * linea alba, navel, costal margin, latissimus dorsi, lumbar lordosis, thoracic kyphosis,
 * spine groove, erector spinae, and dual rounded gluteus maximus buttocks.
 */
export function createTorsoGeometryPair(): GeometryPair {
  const heightSteps = 46;
  const radialSteps = 40;

  const yMin = 0.86;
  const yMax = 1.44;
  const totalHeight = yMax - yMin;

  return createLoftedGeometryPair(heightSteps, radialSteps, (t, u) => {
    const y = yMin + t * totalHeight;
    const angle = u * Math.PI * 2; // 0 = front (+Z), PI/2 = right (+X), PI = back (-Z), 3PI/2 = left (-X)
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    // Natural human spine curvature (Cervical, Thoracic kyphosis, Lumbar lordosis, Pelvic tilt)
    let centerZ = 0;
    if (t < 0.28) {
      // Pelvis slight posterior tilt
      centerZ = -0.014 * Math.sin((t / 0.28) * Math.PI);
    } else if (t < 0.68) {
      // Lumbar lordosis (curves gently forward into the abdominal cavity)
      const lt = (t - 0.28) / 0.40;
      centerZ = 0.017 * Math.sin(lt * Math.PI);
    } else {
      // Thoracic kyphosis (curves gracefully backward at the ribcage)
      const tt = (t - 0.68) / 0.32;
      centerZ = -0.013 * Math.sin(tt * Math.PI);
    }

    // Base widths: rx (half width lateral), rz (half depth anteroposterior)
    let rx = 0.145;
    let rz = 0.115;

    // Organic height-based silhouette
    if (t < 0.22) {
      // Pelvis / Hips & Gluteals (broad pelvic girdle)
      const pt = t / 0.22;
      rx = 0.168 - 0.012 * (1 - pt);
      rz = 0.138 - 0.010 * pt;
    } else if (t < 0.48) {
      // Natural waist narrowing (flanks and oblique taper)
      const wt = (t - 0.22) / 0.26;
      rx = 0.168 - 0.034 * Math.sin(wt * Math.PI);
      rz = 0.128 - 0.026 * Math.sin(wt * Math.PI);
    } else if (t < 0.82) {
      // Ribcage & Chest / Pectorals (athletic V-taper chest expansion)
      const ct = (t - 0.48) / 0.34;
      rx = 0.146 + 0.048 * Math.sin(ct * Math.PI * 0.9);
      rz = 0.112 + 0.024 * Math.sin(ct * Math.PI);
    } else {
      // Clavicular shelf, rounding smoothly to neck base
      const st = (t - 0.82) / 0.18;
      rx = 0.188 * (1 - st * 0.60);
      rz = 0.124 * (1 - st * 0.50);
    }

    // Radial anatomical modulations
    let radiusFactor = 1.0;
    let zOffset = 0;
    let xOffset = 0;

    // 1. Posterior Gluteal Cheeks & Intergluteal Cleft (Buttocks at t < 0.34, cosA < 0)
    if (t < 0.34 && cosA < 0) {
      const gluteHt = Math.sin((1 - t / 0.34) * (Math.PI / 2));
      const buttockCurve = Math.pow(Math.abs(sinA), 1.3) * Math.abs(cosA);
      zOffset -= 0.046 * gluteHt * buttockCurve;

      // Inferior gluteal crease at lower base (t < 0.12)
      if (t < 0.12 && cosA < -0.4) {
        zOffset += 0.008 * (1 - t / 0.12) * Math.abs(cosA);
      }
    }

    // 2. Spine groove & Erector Spinae muscles
    if (cosA < -0.65) {
      const spineDip = (Math.abs(cosA) - 0.65) / 0.35;
      zOffset += 0.009 * spineDip;
    }
    if (t >= 0.25 && t <= 0.65 && cosA < -0.3 && Math.abs(sinA) > 0.15 && Math.abs(sinA) < 0.55) {
      const erectorHt = Math.sin(((t - 0.25) / 0.40) * Math.PI);
      const erectorSwell = Math.sin(((Math.abs(sinA) - 0.15) / 0.40) * Math.PI);
      zOffset -= 0.008 * erectorHt * erectorSwell;
    }

    // 3. Pectoralis Major Muscles (Chest front at t between 0.60 and 0.86, cosA > 0)
    if (t >= 0.60 && t <= 0.86 && cosA > 0) {
      const pecHt = Math.sin(((t - 0.60) / 0.26) * Math.PI);
      const pecAngle = Math.sin(Math.acos(Math.max(-1, Math.min(1, cosA))));
      const pecShape = Math.sin(pecAngle * Math.PI) * Math.pow(cosA, 0.85);
      zOffset += 0.034 * pecHt * pecShape;

      // Lower inframammary fold
      if (t >= 0.60 && t <= 0.65 && cosA > 0.4) {
        const foldT = 1 - Math.abs(t - 0.625) / 0.025;
        zOffset -= 0.004 * foldT * cosA;
      }
    }

    // Clavicle (Collarbone) ridges
    if (t >= 0.85 && t <= 0.95 && cosA > 0.25) {
      const clavHt = Math.sin(((t - 0.85) / 0.10) * Math.PI);
      const clavLat = Math.sin(Math.acos(Math.max(-1, Math.min(1, cosA))));
      const clavSwell = Math.sin(clavLat * Math.PI * 0.95) * Math.pow(cosA, 1.2);
      zOffset += 0.011 * clavHt * clavSwell;
    }

    // 4. Rectus Abdominis (Abs curve, linea alba & navel)
    if (t >= 0.32 && t <= 0.60 && cosA > 0) {
      const abHt = Math.sin(((t - 0.32) / 0.28) * Math.PI);
      const abLat = Math.sin(Math.acos(Math.max(-1, Math.min(1, cosA))));
      const abGroove = Math.sin(abLat * Math.PI * 1.8);
      zOffset += 0.014 * abHt * Math.max(0, abGroove) * Math.pow(cosA, 1.2);

      // Umbilicus (Navel) depression at t ~ 0.40
      if (Math.abs(t - 0.40) < 0.035 && cosA > 0.85) {
        const navelFactor = (1 - Math.abs(t - 0.40) / 0.035) * (cosA - 0.85) / 0.15;
        zOffset -= 0.009 * navelFactor;
      }
    }

    // Inguinal fold ("Apollo's belt")
    if (t >= 0.22 && t <= 0.34 && cosA > 0.15 && Math.abs(sinA) > 0.45) {
      const ingHt = Math.sin(((t - 0.22) / 0.12) * Math.PI);
      radiusFactor -= 0.02 * ingHt;
    }

    // Costal margin (lower ribcage flare)
    if (t >= 0.52 && t <= 0.64 && cosA > 0.2 && Math.abs(sinA) > 0.35) {
      const ribHt = Math.sin(((t - 0.52) / 0.12) * Math.PI);
      radiusFactor += 0.026 * ribHt * Math.abs(sinA);
    }

    // 5. Scapula / Shoulder blades at upper back
    if (t >= 0.68 && t <= 0.92 && cosA < -0.2) {
      const scapHt = Math.sin(((t - 0.68) / 0.24) * Math.PI);
      const scapLat = Math.pow(Math.abs(sinA), 1.3) * Math.abs(cosA);
      zOffset -= 0.018 * scapHt * scapLat;
    }

    // 6. Latissimus dorsi taper at sides
    if (t >= 0.55 && t <= 0.82 && Math.abs(sinA) > 0.60) {
      const latHt = Math.sin(((t - 0.55) / 0.27) * Math.PI);
      radiusFactor += 0.085 * latHt * Math.pow(Math.abs(sinA), 2);
    }

    const x = (rx * radiusFactor * sinA) + xOffset;
    const z = centerZ + (rz * radiusFactor * cosA) + zOffset;

    return { x, y, z };
  });
}

/**
 * Procedural Head & Facial Geometry Pair:
 * Head top y ~ 1.76m, Chin y ~ 1.53m.
 * Cranium egg-dome, forehead with brow ridge, orbital eye sockets, nasal pyramid,
 * nasal tip and alar wings, philtrum, upper and lower lips with Cupid's bow,
 * mental protuberance (chin), mandibular jawline, and cheekbones.
 */
export function createHeadGeometryPair(): GeometryPair {
  const heightSteps = 38;
  const radialSteps = 36;

  const yMin = 1.52; // Chin / jaw lower border
  const yMax = 1.76; // Cranium top vertex
  const totalHeight = yMax - yMin;

  return createLoftedGeometryPair(heightSteps, radialSteps, (t, u) => {
    const y = yMin + t * totalHeight;
    const angle = u * Math.PI * 2; // 0 = front (+Z), PI/2 = right (+X), PI = back (-Z)
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    // Anatomical head profile widths
    let rx = 0.076;
    let rz = 0.093;
    let centerZ = 0.005;

    // Height-based anatomical head contours
    if (t < 0.16) {
      // Chin & Jaw base (y ~ 1.52 - 1.56)
      const jt = t / 0.16;
      rx = 0.038 + 0.033 * jt;
      rz = 0.046 + 0.036 * jt;
      centerZ = 0.022 * (1 - jt);
    } else if (t < 0.45) {
      // Lower face, mouth, cheeks (y ~ 1.56 - 1.63)
      const ft = (t - 0.16) / 0.29;
      rx = 0.071 + 0.012 * Math.sin(ft * Math.PI);
      rz = 0.082 + 0.012 * ft;
    } else if (t < 0.76) {
      // Mid face, eyes, temples, brow ridge (y ~ 1.63 - 1.70)
      const bt = (t - 0.45) / 0.31;
      rx = 0.078 + 0.005 * Math.sin(bt * Math.PI);
      rz = 0.094;
    } else {
      // Cranium parietal dome closure (y ~ 1.70 - 1.76)
      const ct = (t - 0.76) / 0.24;
      const domeFactor = Math.cos(ct * (Math.PI / 2));
      rx = 0.078 * Math.pow(domeFactor, 0.65);
      rz = 0.094 * Math.pow(domeFactor, 0.65);
      centerZ = -0.012 * ct;
    }

    let zMod = 0;
    let xMod = 0;

    // 1. Chin prominence (mental protuberance at t < 0.14, front cosA > 0.45)
    if (t < 0.14 && cosA > 0.45) {
      const chinHt = Math.sin((t / 0.14) * Math.PI);
      const chinFront = (cosA - 0.45) / 0.55;
      zMod += 0.020 * chinHt * Math.pow(chinFront, 1.8);
    }

    // Mental labial sulcus (crease between lower lip and chin)
    if (t >= 0.12 && t <= 0.17 && cosA > 0.6) {
      const sulcusHt = 1 - Math.abs(t - 0.145) / 0.025;
      zMod -= 0.005 * sulcusHt * cosA;
    }

    // 2. Lips & Mouth (t ~ 0.17 - 0.28, front cosA > 0.55)
    if (t >= 0.17 && t <= 0.28 && cosA > 0.55) {
      const lipHt = Math.sin(((t - 0.17) / 0.11) * Math.PI);
      const lipFront = (cosA - 0.55) / 0.45;
      zMod += 0.013 * lipHt * Math.pow(lipFront, 2.0);

      // Philtrum dip down center of upper lip
      if (t >= 0.23 && t <= 0.28 && cosA > 0.92) {
        zMod -= 0.003 * Math.sin(((t - 0.23) / 0.05) * Math.PI);
      }
    }

    // 3. Nose Bridge, Tip and Alar Wings (t ~ 0.26 - 0.53, front cosA > 0.72)
    if (t >= 0.26 && t <= 0.53 && cosA > 0.72) {
      const noseHt = Math.sin(((t - 0.26) / 0.27) * Math.PI);
      const noseNarrow = (cosA - 0.72) / 0.28;
      zMod += 0.034 * Math.pow(noseHt, 0.75) * Math.pow(noseNarrow, 3.0);
    }

    // 4. Eye socket / orbital hollows (t ~ 0.42 - 0.55, cosA > 0.45)
    if (t >= 0.42 && t <= 0.55 && cosA > 0.45 && Math.abs(sinA) > 0.22 && Math.abs(sinA) < 0.68) {
      const eyeHt = Math.sin(((t - 0.42) / 0.13) * Math.PI);
      const eyeLat = Math.sin(((Math.abs(sinA) - 0.22) / 0.46) * Math.PI);
      zMod -= 0.013 * eyeHt * eyeLat * Math.pow(cosA, 1.2);
    }

    // 5. Brow ridge / Superciliary arches
    if (t >= 0.52 && t <= 0.62 && cosA > 0.40) {
      const browHt = Math.sin(((t - 0.52) / 0.10) * Math.PI);
      const browFront = (cosA - 0.40) / 0.60;
      zMod += 0.010 * browHt * Math.pow(browFront, 1.5);
    }

    // 6. Zygomatic arches (Cheekbones)
    if (t >= 0.34 && t <= 0.48 && Math.abs(sinA) > 0.6) {
      const cheekHt = Math.sin(((t - 0.34) / 0.14) * Math.PI);
      xMod += 0.007 * cheekHt * Math.sign(sinA);
    }

    const x = rx * sinA + xMod;
    const z = centerZ + rz * cosA + zMod;

    return { x, y, z };
  });
}

/**
 * Procedural Eye Landmark Geometry Pair:
 */
export function createEyeGeometryPair(): GeometryPair {
  const geom = new THREE.SphereGeometry(0.0105, 12, 10);
  geom.scale(1.15, 0.72, 0.85);

  const wire = new THREE.EdgesGeometry(geom, 25);
  return { mesh: geom, wire };
}

/**
 * Procedural Ear Geometry Pair:
 */
export function createEarGeometryPair(isLeft: boolean): GeometryPair {
  const steps = 16;
  const positions: number[] = [];
  const indices: number[] = [];
  const lineIndices: number[] = [];
  const uvs: number[] = [];

  const side = isLeft ? 1 : -1;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const earAngle = t * Math.PI * 1.5 - Math.PI * 0.25;

    const rEarY = 0.025 * Math.sin(earAngle);
    const rEarZ = 0.016 * Math.cos(earAngle);
    const rEarX = 0.009 * Math.sin(t * Math.PI) * side;

    positions.push(rEarX, rEarY, rEarZ);
    uvs.push(0, t);

    const inX = 0.001 * side;
    const inY = rEarY * 0.42;
    const inZ = rEarZ * 0.42;

    positions.push(inX, inY, inZ);
    uvs.push(1, t);
  }

  for (let i = 0; i < steps; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 3;
    const d = a + 2;

    indices.push(a, b, d);
    indices.push(b, c, d);

    lineIndices.push(a, d);
    lineIndices.push(b, c);
    lineIndices.push(a, b);
  }

  const posAttr = new THREE.Float32BufferAttribute(positions, 3);
  const mesh = new THREE.BufferGeometry();
  mesh.setAttribute("position", posAttr);
  mesh.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  mesh.setIndex(indices);
  mesh.computeVertexNormals();

  const wire = new THREE.BufferGeometry();
  wire.setAttribute("position", posAttr);
  wire.setIndex(lineIndices);

  return { mesh, wire };
}

/**
 * Procedural Neck Geometry Pair:
 */
export function createNeckGeometryPair(): GeometryPair {
  const heightSteps = 14;
  const radialSteps = 30;

  const yMin = 1.43;
  const yMax = 1.53;
  const totalHeight = yMax - yMin;

  return createLoftedGeometryPair(heightSteps, radialSteps, (t, u) => {
    const y = yMin + t * totalHeight;
    const angle = u * Math.PI * 2;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    const centerZ = 0.014 * t;
    const rx = 0.065 - 0.016 * t;
    const rz = 0.062 - 0.012 * t;

    let zMod = 0;

    // Adam's apple / thyroid cartilage prominence
    if (t > 0.35 && t < 0.65 && cosA > 0.75) {
      const appleHt = Math.sin(((t - 0.35) / 0.3) * Math.PI);
      zMod += 0.008 * appleHt * Math.pow((cosA - 0.75) / 0.25, 2);
    }

    // Sternocleidomastoid muscle column
    if (t > 0.2 && t < 0.8 && cosA > 0.4 && Math.abs(sinA) > 0.4) {
      const scmHt = Math.sin(((t - 0.2) / 0.6) * Math.PI);
      zMod += 0.004 * scmHt;
    }

    // Trapezius flare at base rear
    if (t < 0.4 && cosA < -0.3) {
      const trapFactor = (1 - t / 0.4) * Math.abs(cosA);
      zMod -= 0.020 * trapFactor;
    }

    const x = rx * sinA;
    const z = centerZ + rz * cosA + zMod;

    return { x, y, z };
  });
}

/**
 * Procedural Arm Geometry Pair:
 */
export function createArmGeometryPair(isLeft: boolean): GeometryPair {
  const heightSteps = 34;
  const radialSteps = 26;
  const totalLength = 0.54;

  const side = isLeft ? 1 : -1;

  return createLoftedGeometryPair(heightSteps, radialSteps, (t, u) => {
    const y = -t * totalLength;
    const angle = u * Math.PI * 2;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    const armX = side * 0.015 * t;
    const armZ = 0.004 * Math.sin(t * Math.PI);

    let rx = 0.046;
    let rz = 0.048;

    if (t < 0.22) {
      // Deltoid shoulder cap (broad lateral teardrop)
      const dt = t / 0.22;
      rx = 0.055 + 0.012 * Math.sin(dt * Math.PI);
      rz = 0.051 + 0.008 * Math.sin(dt * Math.PI);
    } else if (t < 0.52) {
      // Upper arm: bicep (anterior) and tricep (posterior)
      const ut = (t - 0.22) / 0.30;
      rx = 0.043 - 0.004 * ut;
      rz = 0.046 + 0.006 * Math.sin(ut * Math.PI);
    } else if (t < 0.62) {
      // Elbow joint
      rx = 0.038;
      rz = 0.038;
    } else {
      // Forearm: brachioradialis fullness in upper half tapering smoothly to wrist
      const ft = (t - 0.62) / 0.38;
      rx = 0.043 - 0.018 * ft;
      rz = 0.039 - 0.019 * ft;
    }

    let xMod = 0;
    let zMod = 0;

    // Deltoid lateral swell
    if (t < 0.25 && sinA * side > 0) {
      const deltHt = Math.sin((t / 0.25) * Math.PI);
      xMod += side * 0.014 * deltHt * Math.abs(sinA);
    }

    // Biceps swell (+Z)
    if (t >= 0.20 && t <= 0.48 && cosA > 0) {
      const bicepHt = Math.sin(((t - 0.20) / 0.28) * Math.PI);
      zMod += 0.009 * bicepHt * Math.pow(cosA, 1.5);
    }

    // Olecranon elbow bone (-Z)
    if (t >= 0.50 && t <= 0.60 && cosA < -0.6) {
      const elbowHt = Math.sin(((t - 0.50) / 0.10) * Math.PI);
      zMod -= 0.008 * elbowHt;
    }

    const x = armX + rx * sinA + xMod;
    const z = armZ + rz * cosA + zMod;

    return { x, y, z };
  });
}

export interface HandGroups {
  solidGroup: THREE.Group;
  wireGroup: THREE.Group;
}

/**
 * Procedural Hand & Fingers Geometry:
 */
export function createHandGroups(isLeft: boolean): HandGroups {
  const solidGroup = new THREE.Group();
  const wireGroup = new THREE.Group();
  const side = isLeft ? 1 : -1;

  // 1. Palm geometry
  const palmGeom = new THREE.BoxGeometry(0.062, 0.078, 0.022, 5, 6, 3);
  const pos = palmGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let px = pos.getX(i);
    let py = pos.getY(i);
    let pz = pos.getZ(i);

    if (pz > 0) {
      const cupping = Math.sin(((py + 0.039) / 0.078) * Math.PI);
      pz -= 0.0035 * cupping;

      if (px * side < 0 && py < 0) {
        pz += 0.0065 * Math.sin((-py / 0.039) * Math.PI);
      }
    }

    if (py > 0.01) {
      const taper = (py - 0.01) / 0.029;
      px *= 1 - 0.16 * taper;
      pz *= 1 - 0.20 * taper;
    }

    pos.setXYZ(i, px, py, pz);
  }
  palmGeom.computeVertexNormals();

  const palmWire = new THREE.EdgesGeometry(palmGeom, 15);

  const solidPalmMesh = new THREE.Mesh(palmGeom);
  solidPalmMesh.position.set(0, -0.039, 0);
  solidGroup.add(solidPalmMesh);

  const wirePalmSegs = new THREE.LineSegments(palmWire);
  wirePalmSegs.position.set(0, -0.039, 0);
  wireGroup.add(wirePalmSegs);

  // Helper for articulated finger
  function createArticulatedFingerPair(
    length: number,
    baseRadius: number,
    curlAngleRad: number
  ): GeometryPair {
    const segments = 12;
    const rings = 10;
    return createLoftedGeometryPair(segments, rings, (t, u) => {
      const angle = u * Math.PI * 2;
      const r = baseRadius * (1 - t * 0.44);

      const curl = Math.pow(t, 1.4) * curlAngleRad;
      const curY = -t * length * Math.cos(curl);
      const curZ = t * length * Math.sin(curl);

      const x = r * Math.sin(angle);
      const y = curY - r * 0.3 * Math.cos(angle);
      const z = curZ + r * Math.cos(angle);

      return { x, y, z };
    });
  }

  // Four Fingers
  const fingerSpecs = [
    { name: "index", xOffset: -0.019 * side, len: 0.070, r: 0.0080, curl: 0.26 },
    { name: "middle", xOffset: -0.006 * side, len: 0.078, r: 0.0085, curl: 0.30 },
    { name: "ring", xOffset: 0.007 * side, len: 0.072, r: 0.0080, curl: 0.33 },
    { name: "pinky", xOffset: 0.019 * side, len: 0.058, r: 0.0070, curl: 0.36 },
  ];

  fingerSpecs.forEach((spec) => {
    const pair = createArticulatedFingerPair(spec.len, spec.r, spec.curl);

    const sMesh = new THREE.Mesh(pair.mesh);
    sMesh.position.set(spec.xOffset, -0.078, 0);
    solidGroup.add(sMesh);

    const wLines = new THREE.LineSegments(pair.wire);
    wLines.position.set(spec.xOffset, -0.078, 0);
    wireGroup.add(wLines);
  });

  // Thumb
  const thumbPair = createArticulatedFingerPair(0.052, 0.0095, 0.20);
  const sThumb = new THREE.Mesh(thumbPair.mesh);
  sThumb.position.set(-0.030 * side, -0.022, 0.005);
  sThumb.rotation.z = side * 0.50;
  sThumb.rotation.y = side * 0.32;
  sThumb.rotation.x = 0.18;
  solidGroup.add(sThumb);

  const wThumb = new THREE.LineSegments(thumbPair.wire);
  wThumb.position.set(-0.030 * side, -0.022, 0.005);
  wThumb.rotation.z = side * 0.50;
  wThumb.rotation.y = side * 0.32;
  wThumb.rotation.x = 0.18;
  wireGroup.add(wThumb);

  solidGroup.position.set(0, -0.54, 0);
  solidGroup.rotation.y = side * 0.15;

  wireGroup.position.set(0, -0.54, 0);
  wireGroup.rotation.y = side * 0.15;

  return { solidGroup, wireGroup };
}

/**
 * Procedural Leg Geometry Pair:
 */
export function createLegGeometryPair(isLeft: boolean): GeometryPair {
  const heightSteps = 42;
  const radialSteps = 30;

  const yHip = 0.88;
  const yAnkle = 0.08;
  const totalLength = yHip - yAnkle;

  const side = isLeft ? 1 : -1;

  return createLoftedGeometryPair(heightSteps, radialSteps, (t, u) => {
    const y = yHip - t * totalLength;
    const angle = u * Math.PI * 2;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    let legX = side * 0.095;
    if (t < 0.5) {
      legX -= side * 0.005 * Math.sin(t * Math.PI * 2);
    }

    let legZ = 0;

    let rx = 0.086;
    let rz = 0.086;

    if (t < 0.44) {
      // Thigh: powerful muscular cross-section (quadriceps + hamstrings)
      const tt = t / 0.44;
      rx = 0.098 - 0.038 * tt;
      rz = 0.106 - 0.046 * tt;
      legZ = 0.010 * Math.sin(tt * Math.PI);
    } else if (t < 0.54) {
      // Knee joint (patella level y ~ 0.48m)
      const kt = (t - 0.44) / 0.10;
      rx = 0.060 + 0.003 * Math.sin(kt * Math.PI);
      rz = 0.060;
    } else if (t < 0.82) {
      // Lower leg: gastrocnemius calf muscle bulge
      const ct = (t - 0.54) / 0.28;
      rx = 0.058 + 0.011 * Math.sin(ct * Math.PI);
      rz = 0.060 + 0.019 * Math.sin(ct * Math.PI);
    } else {
      // Lower calf & Achilles tendon tapering to ankle
      const at = (t - 0.82) / 0.18;
      rx = 0.052 - 0.018 * at;
      rz = 0.060 - 0.024 * at;
    }

    let xMod = 0;
    let zMod = 0;

    // 1. Vastus lateralis bulge (outer thigh)
    if (t < 0.40 && sinA * side > 0) {
      const vastHt = Math.sin((t / 0.40) * Math.PI);
      xMod += side * 0.015 * vastHt * Math.abs(sinA);
    }

    // Vastus medialis (inner teardrop mound above knee)
    if (t >= 0.32 && t <= 0.46 && sinA * side < 0) {
      const vmHt = Math.sin(((t - 0.32) / 0.14) * Math.PI);
      xMod -= side * 0.009 * vmHt * Math.abs(sinA);
    }

    // 2. Rectus femoris anterior thigh curve
    if (t < 0.42 && cosA > 0) {
      const quadHt = Math.sin((t / 0.42) * Math.PI);
      zMod += 0.017 * quadHt * Math.pow(cosA, 1.4);
    }

    // 3. Patella (kneecap prominence at t ~ 0.46 - 0.53, front cosA > 0.5)
    if (t >= 0.45 && t <= 0.53 && cosA > 0.5) {
      const patellaHt = Math.sin(((t - 0.45) / 0.08) * Math.PI);
      zMod += 0.016 * patellaHt * Math.pow(cosA, 2.0);
    }

    // 4. Popliteal back hollow (behind knee at t ~ 0.46 - 0.54, cosA < -0.4)
    if (t >= 0.46 && t <= 0.54 && cosA < -0.4) {
      const popHt = Math.sin(((t - 0.46) / 0.08) * Math.PI);
      zMod += 0.008 * popHt * Math.abs(cosA);
    }

    // 5. Gastrocnemius (Calf) Asymmetric muscle bulge:
    if (t >= 0.54 && t <= 0.82 && cosA < 0) {
      const calfHt = Math.sin(((t - 0.54) / 0.28) * Math.PI);
      const medialShift = sinA * side < 0 ? 0.009 : 0.0;
      zMod -= (0.025 + medialShift) * calfHt * Math.pow(Math.abs(cosA), 1.2);
    }

    // 6. Anterior tibial crest (shin bone ridge)
    if (t >= 0.55 && t <= 0.84 && cosA > 0.8) {
      zMod += 0.007 * Math.pow(cosA, 3.0);
    }

    // 7. Ankle malleoli (bony ankle bumps at t > 0.85):
    if (t > 0.85) {
      if (sinA * side < 0 && Math.abs(t - 0.90) < 0.07) {
        const medHt = 1 - Math.abs(t - 0.90) / 0.07;
        xMod -= side * 0.010 * medHt;
      }
      if (sinA * side > 0 && Math.abs(t - 0.95) < 0.06) {
        const latHt = 1 - Math.abs(t - 0.95) / 0.06;
        xMod += side * 0.0085 * latHt;
      }
    }

    const x = legX + rx * sinA + xMod;
    const z = legZ + rz * cosA + zMod;

    return { x, y, z };
  });
}

export interface FootGroups {
  solidGroup: THREE.Group;
  wireGroup: THREE.Group;
}

/**
 * Procedural Foot Geometry:
 */
export function createFootGroups(isLeft: boolean): FootGroups {
  const solidGroup = new THREE.Group();
  const wireGroup = new THREE.Group();
  const side = isLeft ? 1 : -1;

  // 1. Foot Body Pair
  const lengthSteps = 22;
  const radialSteps = 22;

  const footPair = createLoftedGeometryPair(lengthSteps, radialSteps, (t, u) => {
    const zHeel = -0.065;
    const zBall = 0.115;
    const z = zHeel + t * (zBall - zHeel);

    const angle = u * Math.PI * 2;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    let width = 0.035;
    if (t < 0.25) {
      width = 0.032;
    } else if (t < 0.6) {
      width = 0.030;
    } else {
      width = 0.046;
    }

    let height = 0.030;
    if (t < 0.35) {
      height = 0.055 * (1 - (0.35 - t) * 0.6);
    } else if (t < 0.7) {
      height = 0.048 - 0.015 * (t - 0.35) / 0.35;
    } else {
      height = 0.022;
    }

    let archLift = 0;
    if (cosA < -0.3 && t >= 0.25 && t <= 0.75 && sinA * side < 0) {
      const archT = Math.sin(((t - 0.25) / 0.5) * Math.PI);
      archLift = 0.016 * archT * Math.abs(sinA);
    }

    const rx = width;
    const ry = height;

    const x = rx * sinA;
    const y = Math.max(0, ry * (cosA + 1) * 0.5 + archLift);

    return { x, y, z };
  });

  const sFoot = new THREE.Mesh(footPair.mesh);
  solidGroup.add(sFoot);

  const wFoot = new THREE.LineSegments(footPair.wire);
  wireGroup.add(wFoot);

  // 2. Anatomical Toes
  const toeSpecs = [
    { name: "bigToe", xOffset: -0.026 * side, zLen: 0.038, rx: 0.011, ry: 0.010 },
    { name: "secondToe", xOffset: -0.013 * side, zLen: 0.034, rx: 0.0085, ry: 0.009 },
    { name: "thirdToe", xOffset: 0.000, zLen: 0.030, rx: 0.0080, ry: 0.0085 },
    { name: "fourthToe", xOffset: 0.013 * side, zLen: 0.026, rx: 0.0075, ry: 0.008 },
    { name: "littleToe", xOffset: 0.025 * side, zLen: 0.022, rx: 0.0070, ry: 0.0075 },
  ];

  toeSpecs.forEach((spec) => {
    const toeGeom = new THREE.CapsuleGeometry(spec.rx, spec.zLen, 6, 8);
    toeGeom.rotateX(Math.PI / 2);
    const toeWire = new THREE.EdgesGeometry(toeGeom, 20);

    const sToe = new THREE.Mesh(toeGeom);
    sToe.position.set(spec.xOffset, spec.ry, 0.115 + spec.zLen * 0.5);
    solidGroup.add(sToe);

    const wToe = new THREE.LineSegments(toeWire);
    wToe.position.set(spec.xOffset, spec.ry, 0.115 + spec.zLen * 0.5);
    wireGroup.add(wToe);
  });

  solidGroup.position.set(side * 0.095, 0.0, 0.02);
  wireGroup.position.set(side * 0.095, 0.0, 0.02);

  return { solidGroup, wireGroup };
}
