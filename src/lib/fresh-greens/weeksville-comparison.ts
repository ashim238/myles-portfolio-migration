// Saved OSRM driving estimates for the same Utica Avenue start and Weeksville entrance.
// Requested origin [-73.931082, 40.669252], destination [-73.92517816, 40.67397768].
// St. Marks is the direct route (133.3 seconds, 1028.3 m). Lincoln is selected with a
// waypoint at Rochester Avenue [-73.928261, 40.669588] (158.7 seconds, 1027.9 m).
// The native lib/api/routes.ts rounds to whole minutes. Its lib/daylight.ts returned
// these segments and arrival labels for 2026-11-23T16:32:00-05:00. Local calculated
// sunset is 16:34:09.906. Geometry and the OSM basemap share a local projection.
// Routing: router.project-osrm.org/route/v1/driving. Map data © OpenStreetMap contributors.
export const trip = {
  destination: "Weeksville Heritage Center",
  origin: "Utica Avenue",
  departure: "4:32 PM",
  date: "Nov. 23, 2026",
  sunset: "4:34 PM",
  start: [146.6, 400.0],
  finish: [463.4, 72.2],
  routes: [
    {
      via: "St. Marks Avenue",
      minutes: 2,
      miles: "0.6",
      arrival: "4:34 PM",
      light: "Dusk",
      segments: [
        {
          d: "M146.6,400 149,369.2 149.2,366.2 149.5,362.3 151.5,335.2 153,313.7 153.5,307.6 154,300.4 155.3,281.4 157.6,250 157.9,245.7 158.3,240 162,188.4 162.3,183.9 162.7,178.2 165.4,141.7 166.6,126.5 166.9,121.8 167.3,116.6 168.4,99.8 169,92.1 170.9,64.7 171.2,60 176.2,60.3 311.2,70.1 317.4,70.5 321.7,70.8 340.8,72.2 417.3,77.7 457.1,80.6 462.7,81 463.1,75.3 463.4,72.2",
          light: "Dusk",
          color: "#784961",
        },
      ],
    },
    {
      via: "Lincoln Place",
      minutes: 3,
      miles: "0.6",
      arrival: "4:35 PM",
      light: "After dark",
      segments: [
        {
          d: "M146.6,400 149,369.2 149.2,366.2 154.3,366.6 289.6,376.2 295.3,376.7 295.6,372 299,324.4 299.5,318.2 300,311 303.5,260.5 303.8,256.3",
          light: "Dusk",
          color: "#784961",
        },
        {
          d: "M303.8,256.3 304.3,250.7 308,198.7 308.3,194.5 308.7,188.8 312.4,136.8 312.7,132.3 313.1,127.2 314.1,115 315.1,101.4 317.1,75.4 317.4,70.5 321.7,70.8 340.8,72.2 417.3,77.7 457.1,80.6 462.7,81 463.1,75.3 463.4,72.2",
          light: "After dark",
          color: "#2D1B69",
        },
      ],
    },
  ],
} as const;
