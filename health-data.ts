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
    ],
  },
  {
    id: "nasa-twins-study",
    name: "NASA Twins Study",
    year: 2015,
    missionType: "Human research study",
    destination: "International Space Station",
    astronaut: "Scott Kelly",
    earthBasedControl: "Mark Kelly",
    crewSize: 1,
    dataSource: "https://osdr.nasa.gov/",
    healthSystems: ["eye", "muscle", "bones", "brain"],
    timePoints: ["pre-flight", "in-flight", "post-flight"],
    durationDays: 340,
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
        day: 120,
        health: {
          eye: 96,
          muscle: 92,
          bones: 97,
          brain: 97,
        },
      },
      {
        day: 240,
        health: {
          eye: 93,
          muscle: 87,
          bones: 94,
          brain: 94,
        },
      },
      {
        day: 340,
        health: {
          eye: 95,
          muscle: 90,
          bones: 96,
          brain: 98,
        },
      },
    ],
  },
  {
    id: "inspiration4",
    name: "Inspiration4",
    year: 2021,
    missionType: "Commercial crew spaceflight",
    destination: "Low Earth Orbit",
    crewSize: 4,
    dataSource:
      "https://osdr.nasa.gov/bio/repo/data/missions/SpaceX%20Inspiration4",
    healthSystems: ["eye", "muscle", "bones", "brain"],
    timePoints: ["pre-flight", "in-flight", "post-flight"],
    durationDays: 3,
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
        day: 1,
        health: {
          eye: 100,
          muscle: 99,
          bones: 100,
          brain: 99,
        },
      },
      {
        day: 3,
        health: {
          eye: 100,
          muscle: 99,
          bones: 100,
          brain: 99,
        },
      },
    ],
  },
];

/**
 * Calculate dynamic health metrics for any day in a mission via linear interpolation between intervals.
 */
export function getHealthForDay(mission: MissionData, day: number): HealthMetrics {
  const intervals = mission.intervals;
  if (!intervals || intervals.length === 0) {
    return { eye: 100, muscle: 100, bones: 100, brain: 100 };
  }
  if (day <= intervals[0].day) {
    return { ...intervals[0].health };
  }
  const last = intervals[intervals.length - 1];
  if (day >= last.day) {
    return { ...last.health };
  }

  for (let i = 0; i < intervals.length - 1; i++) {
    const prev = intervals[i];
    const next = intervals[i + 1];
    if (day >= prev.day && day <= next.day) {
      const range = next.day - prev.day;
      const t = range === 0 ? 0 : (day - prev.day) / range;
      return {
        eye: Number((prev.health.eye + t * (next.health.eye - prev.health.eye)).toFixed(1)),
        muscle: Number((prev.health.muscle + t * (next.health.muscle - prev.health.muscle)).toFixed(1)),
        bones: Number((prev.health.bones + t * (next.health.bones - prev.health.bones)).toFixed(1)),
        brain: Number((prev.health.brain + t * (next.health.brain - prev.health.brain)).toFixed(1)),
      };
    }
  }

  return { ...last.health };
}

