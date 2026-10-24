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
    glowColor: "#fbbf24",
    cameraTarget: [-0.095, -0.2, -0.02],
    cameraPosition: [-0.18, -0.16, 1.35],
    missionRisk: "CRITICAL",
  },
  brain: {
    id: "brain",
    name: "Central Nervous System",
    badge: "CEPHALIC FLUID SHIFT",
    color: "#f472b6",
    glowColor: "#ec4899",
    cameraTarget: [0.0, 0.816, -0.016],
    cameraPosition: [0.0, 0.825, 0.52],
    missionRisk: "HIGH",
  },
  eyes: {
    id: "eyes",
    name: "Visual System (SANS)",
    badge: "NEURO-OCULAR SYNDROME",
    color: "#0284c7",
    glowColor: "#38bdf8",
    cameraTarget: [0.0265, 0.776, 0.046],
    cameraPosition: [0.028, 0.78, 0.36],
    missionRisk: "CRITICAL",
  },
  muscles: {
    id: "muscles",
    name: "Muscular System",
    badge: "POSTURAL ATROPHY",
    color: "#be185d",
    glowColor: "#f43f5e",
    cameraTarget: [0.095, -0.12, 0.02],
    cameraPosition: [0.18, -0.08, 1.35],
    missionRisk: "HIGH",
  },
};
