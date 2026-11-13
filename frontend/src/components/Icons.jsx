const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const I = ({ size = 18, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
    {children}
  </svg>
);

export const LogoMark = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 6 L38 20 L24 42 L10 20 Z" stroke="currentColor" strokeWidth="2.2" fill="none" />
    <path d="M10 20 H38" stroke="currentColor" strokeWidth="2.2" />
    <path d="M24 6 L19 20 L24 42 L29 20 Z" stroke="currentColor" strokeWidth="1.4" fill="none" />
  </svg>
);

export const DashboardIcon = (p) => (
  <I {...p}>
    <rect x="3" y="3" width="8" height="8" rx="1" />
    <rect x="13" y="3" width="8" height="8" rx="1" />
    <rect x="3" y="13" width="8" height="8" rx="1" />
    <rect x="13" y="13" width="8" height="8" rx="1" />
  </I>
);

export const BedIcon = (p) => (
  <I {...p}>
    <path d="M3 18V7M3 12h18a2 2 0 0 1 2 2v4M6 9h5a2 2 0 0 1 2 2v1H4" />
    <circle cx="7.5" cy="11.5" r="1.6" />
  </I>
);

export const CalendarIcon = (p) => (
  <I {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </I>
);

export const InvoiceIcon = (p) => (
  <I {...p}>
    <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z" />
    <path d="M9 8h6M9 12h6" />
  </I>
);

export const BroomIcon = (p) => (
  <I {...p}>
    <path d="M14 4l6 6M9 13l5-5 3 3-5 5z" />
    <path d="M9 13L4 20M7 12l5 5" />
  </I>
);

export const UsersIcon = (p) => (
  <I {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14c2.3.8 4 3 4 6" />
  </I>
);

export const StarIcon = ({ size = 18, filled = true, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...rest}
    fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
);

export const BellIcon = (p) => (
  <I {...p}>
    <path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9" />
    <path d="M10 20a2.2 2.2 0 0 0 4 0" />
  </I>
);

export const GearIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v3M12 18.2v3M4.2 7l2.6 1.5M17.2 15.5l2.6 1.5M4.2 17l2.6-1.5M17.2 8.5l2.6-1.5" />
  </I>
);

export const MenuIcon = (p) => (
  <I {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </I>
);

export const LogoutIcon = (p) => (
  <I {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </I>
);

export const CheckIcon = (p) => (
  <I {...p}><path d="M4 12.5l5 5L20 6.5" /></I>
);

export const XIcon = (p) => (
  <I {...p}><path d="M6 6l12 12M18 6L6 18" /></I>
);

export const PrintIcon = (p) => (
  <I {...p}>
    <path d="M7 8V3h10v5" />
    <rect x="4" y="8" width="16" height="8" rx="1.5" />
    <path d="M7 13h10v8H7z" />
  </I>
);

export const PlusIcon = (p) => (
  <I {...p}><path d="M12 5v14M5 12h14" /></I>
);

export const TrashIcon = (p) => (
  <I {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" />
    <path d="M10 11v6M14 11v6" />
  </I>
);

export const EditIcon = (p) => (
  <I {...p}>
    <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16z" />
    <path d="M13.5 6.5l4 4" />
  </I>
);

export const ConciergeIcon = (p) => (
  <I {...p}>
    <path d="M3 18h18M5 18a7 7 0 0 1 14 0" />
    <path d="M12 6.5v1.5M5.5 9l1 1M18.5 9l-1 1" />
  </I>
);

export const SpaIcon = (p) => (
  <I {...p}>
    <path d="M12 21c-5 0-9-3.5-9-8 3 0 5.5 1.5 7 3.5C11.5 11 14 7 19 5c.5 6-2.5 10-7 10" />
    <path d="M12 21c0-4 1.5-8 5-11" />
  </I>
);

export const DiningIcon = (p) => (
  <I {...p}>
    <path d="M7 3v8a2.5 2.5 0 0 0 5 0V3M9.5 11v10" />
    <path d="M17 3c-1.5 2-2 4-2 6s.5 2.5 2 2.5V21" />
  </I>
);

export const CarIcon = (p) => (
  <I {...p}>
    <path d="M4 16v-4l2-5h12l2 5v4" />
    <path d="M3 16h18M4 12h16" />
    <circle cx="7.5" cy="18" r="1.5" />
    <circle cx="16.5" cy="18" r="1.5" />
  </I>
);

export const WifiIcon = (p) => (
  <I {...p}>
    <path d="M4 9.5a13 13 0 0 1 16 0M7 13a8.5 8.5 0 0 1 10 0" />
    <circle cx="12" cy="17.5" r="1.2" fill="currentColor" stroke="none" />
  </I>
);

export const GymIcon = (p) => (
  <I {...p}>
    <path d="M6.5 6.5v11M4 9v6M17.5 6.5v11M20 9v6M6.5 12h11" />
  </I>
);

export const KeyIcon = (p) => (
  <I {...p}>
    <circle cx="8" cy="14" r="3.5" />
    <path d="M11 11l9-9M17 4l2.5 2.5M14.5 6.5L17 9" />
  </I>
);

export const EyeIcon = (p) => (
  <I {...p}>
    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </I>
);

export const EyeOffIcon = (p) => (
  <I {...p}>
    <path d="M4 4l16 16" />
    <path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.1 6.8A16.4 16.4 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </I>
);
