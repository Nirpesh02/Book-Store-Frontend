import React from 'react'

const Svg = ({ children, className = '', viewBox = '0 0 24 24', ...props }) => (
  <svg viewBox={viewBox} fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    {children}
  </svg>
)

export const LayoutDashboard = (props) => (
  <Svg {...props}><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></Svg>
)

export const BookOpen = (props) => (
  <Svg {...props}><path d="M2 7c0 0 4-3 9-3s9 3 9 3v11s-4-3-9-3-9 3-9 3V7z"/></Svg>
)

export const Users = (props) => (
  <Svg {...props}><circle cx="8" cy="8" r="3"/><path d="M17 11c0-2.2-1.8-4-4-4"/><path d="M2 20c2-3 6-4 10-4s8 1 10 4"/></Svg>
)

export const History = (props) => (
  <Svg {...props}><path d="M21 12a9 9 0 1 1-9-9"/><path d="M12 7v5l4 2"/></Svg>
)

export const FileText = (props) => (
  <Svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/></Svg>
)

export const Settings = (props) => (
  <Svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.21 4.21A2 2 0 1 1 7.04 1.38l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c.05.56.35 1.07.88 1.38.53.31 1.16.34 1.71.06l.09-.05A2 2 0 1 1 19.4 15z"/></Svg>
)

export const UserCheck = (props) => (
  <Svg {...props}><circle cx="9" cy="7" r="4"/><path d="M17 11l2 2 4-4"/><path d="M3 21v-1a4 4 0 0 1 4-4h4"/></Svg>
)

export const Search = (props) => (
  <Svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></Svg>
)

export const Plus = (props) => (
  <Svg {...props}><path d="M12 5v14M5 12h14"/></Svg>
)

export const UserPlus = (props) => (
  <Svg {...props}><circle cx="8" cy="9" r="4"/><path d="M20 8v6M23 11h-6"/><path d="M2 21v-1a4 4 0 0 1 4-4h4"/></Svg>
)

export const Bell = (props) => (
  <Svg {...props}><path d="M18 8a6 6 0 10-12 0v5H4l2 2h12l2-2h-2V8z"/></Svg>
)

export const Filter = (props) => (
  <Svg {...props}><path d="M22 4H2l8 9v7l4 2v-9z"/></Svg>
)

export const BookmarkCheck = (props) => (
  <Svg {...props}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="M17 9l-2 2-1-1"/></Svg>
)

export const AlertCircle = (props) => (
  <Svg {...props}><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></Svg>
)

export const ArrowUpRight = (props) => (
  <Svg {...props}><path d="M7 17L17 7"/><path d="M7 7h10v10"/></Svg>
)

export const Mail = (props) => (
  <Svg {...props}><path d="M3 8l9 6 9-6"/><path d="M21 19H3V5h18v14z"/></Svg>
)

export const Phone = (props) => (
  <Svg {...props}><path d="M22 16.92V21a1 1 0 0 1-1.11 1 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75c.2.94.63 2.07 1.26 3.36a1 1 0 0 1-.24 1.05L7.91 9.09a16 16 0 0 0 6 6l1.93-1.93a1 1 0 0 1 1.05-.24c1.29.63 2.42 1.06 3.36 1.26a1 1 0 0 1 .75 1V21z"/></Svg>
)

export default Svg
