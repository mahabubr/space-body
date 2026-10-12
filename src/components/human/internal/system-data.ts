export type SystemId = "bones" | "brain" | "eyes" | "muscles";

export interface SystemInfo {
  id: SystemId;
  name: string;
  badge: string;
  color: string;
  glowColor: string;
  shortDescription: string;
  problemInSpace: string;
  effectOnAstronauts: string;
  nasaSolution: string;
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  missionRisk: "HIGH" | "CRITICAL" | "MODERATE";
}

export const SYSTEMS_DATA: Record<SystemId, SystemInfo> = {
  bones: {
    id: "bones",
    name: "Skeletal System",
    badge: "BONE DECALCIFICATION",
    color: "#fbf7ee",
    glowColor: "#0284c7",
    shortDescription:
      "Structural framework of 206 bones maintaining form and calcium homeostasis in Earth's gravity.",
    problemInSpace:
      "In microgravity, bones no longer bear mechanical loads. Without resistance, osteoclast activity outpaces bone-building osteoblasts, causing astronauts to shed 1.0% to 1.5% of bone mineral density in hips and spine every single month.",
    effectOnAstronauts:
      "Accelerated early-onset osteoporosis, heightened risk of fractures upon touchdown on Mars or Earth, and excessive calcium flushed into the bloodstream resulting in painful kidney stones.",
    nasaSolution:
      "Heavy load training on the Advanced Resistive Exercise Device (ARED) delivering up to 600 lbs of simulated weight, daily Vitamin D/calcium nutritional supplements, and antiresorptive bisphosphonate pharmacotherapy.",
    cameraTarget: [-0.08, -0.32, 0.0],
    cameraPosition: [-0.14, -0.28, 1.45],
    missionRisk: "CRITICAL",
  },
  brain: {
    id: "brain",
    name: "Central Nervous System",
    badge: "CEPHALIC FLUID SHIFT",
    color: "#f472b6",
    glowColor: "#ec4899",
    shortDescription:
      "Cerebral hemispheres, cerebellum, and brainstem controlling sensory processing, motor coordination, and cognition.",
    problemInSpace:
      "The absence of gravitational hydrostatic pressure shifts nearly 2 liters of blood and cerebral fluids upward into the head and cranium, increasing intracranial pressure and disorienting inner-ear vestibular balance canals.",
    effectOnAstronauts:
      "Space Adaptation Syndrome (severe nausea, spatial disorientation, illusion of inversion), sleep disruption, cognitive fatigue, and long-term dilation of the cerebral ventricular cavities.",
    nasaSolution:
      "Pre-flight sensory-motor acclimation training, Russian-developed Chibis Lower Body Negative Pressure (LBNP) suits to draw fluids back down into the legs, and cognitive circadian light protocols.",
    cameraTarget: [-0.015, 0.82, -0.046],
    cameraPosition: [-0.015, 0.835, 0.72],
    missionRisk: "HIGH",
  },
  eyes: {
    id: "eyes",
    name: "Visual System (SANS)",
    badge: "NEURO-OCULAR SYNDROME",
    color: "#0284c7",
    glowColor: "#38bdf8",
    shortDescription:
      "Eyeballs, lens optics, and optic nerve sheaths routing sensory inputs to the visual cortex.",
    problemInSpace:
      "Cephalic fluid pooling elevates pressures behind the globe of the eye, causing optic disc edema, posterior eye globe flattening, and nerve sheath distension—a condition known as SANS (Spaceflight-Associated Neuro-ocular Syndrome).",
    effectOnAstronauts:
      "Progressive hyperopic shift (loss of near visual acuity, making checklists unreadable without glasses), cotton-wool spots on the retina, and potential irreversible vision impairment on long-duration Mars transit.",
    nasaSolution:
      "Onboard diagnostic retinal Optical Coherence Tomography (OCT) scanning, adjustable Space Focals glasses, high-dose vitamin B-complex metabolic interventions, and negative-pressure sleeping headgear.",
    cameraTarget: [0.0325, 0.7689, 0.048],
    cameraPosition: [0.035, 0.772, 0.52],
    missionRisk: "CRITICAL",
  },
  muscles: {
    id: "muscles",
    name: "Muscular System",
    badge: "POSTURAL ATROPHY",
    color: "#be185d",
    glowColor: "#f97316",
    shortDescription:
      "Major antigravity skeletal muscle groups providing posture, locomotion, and metabolic energy expenditure.",
    problemInSpace:
      "Without the continuous effort required to stand against 1G gravity, postural antigravity muscles (calves, quadriceps, and spinal erectors) experience immediate loss of mechanical tension, losing protein synthesis within 72 hours.",
    effectOnAstronauts:
      "Loss of up to 20% of skeletal muscle mass within short missions, transition of endurance slow-twitch fibers to easily fatigued fast-twitch fibers, posture collapse, and severe physical exhaustion upon Mars surface landing.",
    nasaSolution:
      "Mandatory 2.5 hours of daily rigorous physical conditioning combining high-resistance ARED squats and deadlifts, the T2 Colbert bungee-tethered treadmill, and the CEVIS cycle ergometer with amino acid supplementation.",
    cameraTarget: [0.08, -0.18, 0.0],
    cameraPosition: [0.15, -0.15, 1.45],
    missionRisk: "HIGH",
  },
};
