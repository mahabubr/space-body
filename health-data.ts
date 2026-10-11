export const HEALTH_DATA = {
  ISS: {
    name: "ISS Mission",
    duration: 180,

    days: {
      1: {
        muscle: 100,
        bone: 100,
        vision: 100,
        energy: 100,
      },

      30: {
        muscle: 95,
        bone: 98,
        vision: 98,
        energy: 90,
      },

      90: {
        muscle: 85,
        bone: 92,
        vision: 94,
        energy: 80,
      },

      180: {
        muscle: 75,
        bone: 85,
        vision: 90,
        energy: 70,
      },
    },
  },

  MOON: {
    name: "Moon Mission",
    duration: 30,

    days: {
      1: {
        muscle: 100,
        bone: 100,
        vision: 100,
        energy: 100,
      },

      30: {
        muscle: 88,
        bone: 92,
        vision: 92,
        energy: 75,
      },
    },
  },

  MARS: {
    name: "Mars Mission",
    duration: 900,

    days: {
      1: {
        muscle: 100,
        bone: 100,
        vision: 100,
        energy: 100,
      },

      30: {
        muscle: 85,
        bone: 90,
        vision: 90,
        energy: 80,
      },

      900: {
        muscle: 45,
        bone: 65,
        vision: 70,
        energy: 45,
      },
    },
  },
};
