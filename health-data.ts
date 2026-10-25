export interface HealthMetrics {
  eye: number;
  muscle: number;
  bones: number;
  brain: number;
}

export interface MissionInterval {
  day: number;
  health: HealthMetrics;
}

export interface MissionDescription {
  shortDescription: string;
  problemInSpace: string;
  effectOnAstronauts: string;
  nasaSolution: string;
}

export interface MissionData {
  id: string;
  name: string;
  yearRange?: string;
  year?: number;
  missionType: string;
  destination: string;
  crewSize: number | null;
  astronaut?: string;
  earthBasedControl?: string;
  dataSource: string;
  healthSystems: string[];
  timePoints: string[];
  durationDays: number;
  intervals: MissionInterval[];
  description?: {
    eye?: MissionDescription;
    muscle?: MissionDescription;
    bones?: MissionDescription;
    brain?: MissionDescription;
  };
}

export const HEALTH_DATA: MissionData[] = [
  {
    id: "iss-human-research",
    name: "International Space Station (ISS)",
    yearRange: "1998-present",
    missionType: "Long-duration human spaceflight",
    destination: "Low Earth Orbit",
    crewSize: null,
    dataSource: "https://nlsp.nasa.gov/",
    healthSystems: ["eye", "muscle", "bones", "brain"],
    timePoints: ["pre-flight", "in-flight", "post-flight"],
    durationDays: 180,
    description: {
      bones: {
        shortDescription:
          "Structural framework of 206 bones maintaining form and calcium homeostasis in Earth's gravity.",
        problemInSpace:
          "In microgravity, bones no longer bear mechanical loads. Without resistance, osteoclast activity outpaces bone-building osteoblasts, causing astronauts to shed 1.0% to 1.5% of bone mineral density in hips and spine every single month.",
        effectOnAstronauts:
          "Accelerated early-onset osteoporosis, heightened risk of fractures upon touchdown on Mars or Earth, and excessive calcium flushed into the bloodstream resulting in painful kidney stones.",
        nasaSolution:
          "Heavy load training on the Advanced Resistive Exercise Device (ARED) delivering up to 600 lbs of simulated weight, daily Vitamin D/calcium nutritional supplements, and antiresorptive bisphosphonate pharmacotherapy.",
      },
      brain: {
        shortDescription:
          "Cerebral hemispheres, cerebellum, and brainstem controlling sensory processing, motor coordination, and cognition.",
        problemInSpace:
          "The absence of gravitational hydrostatic pressure shifts nearly 2 liters of blood and cerebral fluids upward into the head and cranium, increasing intracranial pressure and disorienting inner-ear vestibular balance canals.",
        effectOnAstronauts:
          "Space Adaptation Syndrome (severe nausea, spatial disorientation, illusion of inversion), sleep disruption, cognitive fatigue, and long-term dilation of the cerebral ventricular cavities.",
        nasaSolution:
          "Pre-flight sensory-motor acclimation training, Russian-developed Chibis Lower Body Negative Pressure (LBNP) suits to draw fluids back down into the legs, and cognitive circadian light protocols.",
      },
      eye: {
        shortDescription:
          "Eyeballs, lens optics, and optic nerve sheaths routing sensory inputs to the visual cortex.",
        problemInSpace:
          "Cephalic fluid pooling elevates pressures behind the globe of the eye, causing optic disc edema, posterior eye globe flattening, and nerve sheath distension—a condition known as SANS (Spaceflight-Associated Neuro-ocular Syndrome).",
        effectOnAstronauts:
          "Progressive hyperopic shift (loss of near visual acuity, making checklists unreadable without glasses), cotton-wool spots on the retina, and potential irreversible vision impairment on long-duration Mars transit.",
        nasaSolution:
          "Onboard diagnostic retinal Optical Coherence Tomography (OCT) scanning, adjustable Space Focals glasses, high-dose vitamin B-complex metabolic interventions, and negative-pressure sleeping headgear.",
      },
      muscle: {
        shortDescription:
          "Major antigravity skeletal muscle groups providing posture, locomotion, and metabolic energy expenditure.",
        problemInSpace:
          "Without the continuous effort required to stand against 1G gravity, postural antigravity muscles (calves, quadriceps, and spinal erectors) experience immediate loss of mechanical tension, losing protein synthesis within 72 hours.",
        effectOnAstronauts:
          "Loss of up to 20% of skeletal muscle mass within short missions, transition of endurance slow-twitch fibers to easily fatigued fast-twitch fibers, posture collapse, and severe physical exhaustion upon Mars surface landing.",
        nasaSolution:
          "Mandatory 2.5 hours of daily rigorous physical conditioning combining high-resistance ARED squats and deadlifts, the T2 Colbert bungee-tethered treadmill, and the CEVIS cycle ergometer with amino acid supplementation.",
      },
    },
    intervals: [
      {
        day: 0,
        health: {
          eye: 100,
          muscle: 100,
          bones: 100,
          brain: 100,
        },
      },
      {
        day: 30,
        health: {
          eye: 98,
          muscle: 96,
          bones: 99,
          brain: 98,
        },
      },
      {
        day: 90,
        health: {
          eye: 95,
          muscle: 90,
          bones: 97,
          brain: 96,
        },
      },
      {
        day: 180,
        health: {
          eye: 96,
          muscle: 86,
          bones: 95,
          brain: 97,
        },
      },
      {
        day: 320,
        health: {
          eye: 93,
          muscle: 76,
          bones: 91,
          brain: 94,
        },
      },
      {
        day: 380,
        health: {
          eye: 100,
          muscle: 100,
          bones: 100,
          brain: 100,
        },
      },
    ],
  },
];
