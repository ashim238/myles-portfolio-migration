type Props = { name: string };

const COMMON = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function CategoryIcon({ name }: Props) {
  switch (name) {
    case "All":
      return (
        <svg {...COMMON}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "Architecture & design":
      return (
        <svg {...COMMON}>
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-9h6v9" />
        </svg>
      );
    case "Arts & culture":
      return (
        <svg {...COMMON}>
          <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.2-1.6-.4-1 .3-2 1.3-2H17a4 4 0 0 0 4-4 8 8 0 0 0-9-10z" />
          <circle cx="7.5" cy="11.5" r=".6" />
          <circle cx="10" cy="7.5" r=".6" />
          <circle cx="14.5" cy="7" r=".6" />
          <circle cx="17.5" cy="11" r=".6" />
        </svg>
      );
    case "Community engagement":
      return (
        <svg {...COMMON}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.4" />
          <path d="M3 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
          <path d="M21 20v-1a3 3 0 0 0-2.4-2.94" />
        </svg>
      );
    case "Cooking":
      return (
        <svg {...COMMON}>
          <path d="M4 10h16l-1 9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 10z" />
          <path d="M2 10h20" />
          <path d="M8 6c0-1.5 1-3 2-3M12 6c0-1.5 1-3 2-3" />
        </svg>
      );
    case "Educational":
      return (
        <svg {...COMMON}>
          <path d="M22 10 12 5 2 10l10 5 10-5z" />
          <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
        </svg>
      );
    case "Entertainment":
      return (
        <svg {...COMMON}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case "Food tours":
      return (
        <svg {...COMMON}>
          <path d="M6 3v8a2 2 0 0 0 2 2v8" />
          <path d="M10 3v8a2 2 0 0 1-2 2" />
          <path d="M6 3v6" />
          <path d="M17 3c-2 0-3 2-3 5s1 5 3 5v8" />
        </svg>
      );
    case "Galleries":
      return (
        <svg {...COMMON}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="1.5" />
          <path d="m21 16-5-5-9 9" />
        </svg>
      );
    case "Wellness & movement":
      return (
        <svg {...COMMON}>
          <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
        </svg>
      );
    case "Outdoors & nature":
      return (
        <svg {...COMMON}>
          <path d="M12 3 5 14h4l-3 6h12l-3-6h4z" />
          <path d="M12 20v2" />
        </svg>
      );
    case "Markets & makers":
      return (
        <svg {...COMMON}>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case "Sports & recreation":
      return (
        <svg {...COMMON}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "Family & kids":
      return (
        <svg {...COMMON}>
          <circle cx="9" cy="6" r="2.5" />
          <circle cx="17" cy="8" r="2" />
          <path d="M4 21v-2a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" />
          <path d="M14 21v-1a2.5 2.5 0 0 1 2.5-2.5h1A2.5 2.5 0 0 1 20 20v1" />
        </svg>
      );
    case "Photography & film":
      return (
        <svg {...COMMON}>
          <path d="M23 19V8a2 2 0 0 0-2-2h-4l-2-3H9L7 6H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case "Water & boating":
      return (
        <svg {...COMMON}>
          <path d="M2 20c1.5 0 3-1 4-2 1 1 2.5 2 4 2s3-1 4-2c1 1 2.5 2 4 2s3-1 4-2" />
          <path d="M2 15c1.5 0 3-1 4-2 1 1 2.5 2 4 2s3-1 4-2c1 1 2.5 2 4 2s3-1 4-2" />
          <path d="M2 10c1.5 0 3-1 4-2 1 1 2.5 2 4 2s3-1 4-2c1 1 2.5 2 4 2s3-1 4-2" />
        </svg>
      );
    case "Fashion & vintage":
      return (
        <svg {...COMMON}>
          <circle cx="12" cy="5" r="2" />
          <path d="M13.5 8.2A2 2 0 0 1 14 9.5L21 14l-2 3-7-3-7 3-2-3 7-4.5a2 2 0 0 1 .5-1.3" />
        </svg>
      );
    default:
      return null;
  }
}
