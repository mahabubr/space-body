export type SystemId = "bones" | "brain" | "eyes" | "muscles";

export interface SystemInfo {
  id: SystemId;
  name: string;
  badge: string;
  color: string;
  glowColor: string;
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
    cameraTarget: [0.08, -0.18, 0.0],
    cameraPosition: [0.15, -0.15, 1.45],
    missionRisk: "HIGH",
  },
};
