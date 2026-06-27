const PATHS = {
  home: ['M3 11.5 12 4l9 7.5', 'M5.5 10v9.5h13V10'],
  briefcase: ['M3 8.5h18v11H3z', 'M8.5 8.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2.5', 'M3 13h18'],
  list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3.5 6h.01', 'M3.5 12h.01', 'M3.5 18h.01'],
  file: ['M6 3h8l4 4v14H6z', 'M14 3v4h4', 'M9 13h6', 'M9 17h6'],
  card: ['M3 6.5h18v11H3z', 'M3 10.5h18', 'M6.5 14.5h4'],
  spark: ['M12 3v4', 'M12 17v4', 'M3 12h4', 'M17 12h4', 'M12 9l1.4 1.6L15 12l-1.6 1.4L12 15l-1.4-1.6L9 12l1.6-1.4z'],
  bell: ['M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8', 'M13.7 21a2 2 0 0 1-3.4 0'],
  chat: ['M21 11.5a8 8 0 0 1-11.6 7.1L3 20.5l1.9-6.4A8 8 0 1 1 21 11.5z'],
  users: ['M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7', 'M22 19v-2a4 4 0 0 0-3-3.8', 'M16 2.2a4 4 0 0 1 0 7.6'],
  shield: ['M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z', 'M9 12l2 2 4-4'],
  gauge: ['M12 13a8 8 0 0 1 8-8', 'M12 13 17 8', 'M4 13a8 8 0 0 1 4-7', 'M3.5 19.5h17'],
  download: ['M12 3v12', 'M7 11l5 5 5-5', 'M4.5 20.5h15'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18', 'M12 7.5V12l3 2'],
  check: ['M20 6 9 17l-5-5'],
  chevronRight: ['M9 6l6 6-6 6'],
  chevronLeft: ['M15 6l-6 6 6 6'],
  plus: ['M12 5v14', 'M5 12h14'],
  grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 17.5h7', 'M17.5 14v7'],
  moon: ['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'],
  save: ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8'],
  send: ['M22 2L11 13', 'M22 2L15 22l-4-9-9-4 20-7z'],
  star: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  x: ['M18 6 6 18', 'M6 6l12 12'],
  globe: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18', 'M3 12h18', 'M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z'],
}

export default function Icon({ name, size = 18, style = {} }) {
  const paths = PATHS[name] || PATHS.home
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}
