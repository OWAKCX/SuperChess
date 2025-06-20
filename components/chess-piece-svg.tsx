// Individual chess piece SVG components
export const ChessPieceSVG = {
  king: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path
        d="M50 10 L45 15 L40 10 L40 20 L35 20 L35 25 L40 25 L40 30 L35 30 L30 35 L30 40 L25 45 L25 85 L75 85 L75 45 L70 40 L70 35 L65 30 L60 30 L60 25 L65 25 L65 20 L60 20 L60 10 L55 15 L50 10 Z"
        fill="currentColor"
      />
      <circle cx="50" cy="15" r="3" fill="currentColor" />
      <rect x="45" y="5" width="10" height="3" fill="currentColor" />
      <rect x="48" y="2" width="4" height="3" fill="currentColor" />
    </svg>
  ),
  
  queen: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path
        d="M20 25 L25 20 L30 25 L35 15 L40 25 L45 10 L50 25 L55 10 L60 25 L65 15 L70 25 L75 20 L80 25 L75 30 L70 35 L65 40 L60 45 L55 50 L50 55 L45 50 L40 45 L35 40 L30 35 L25 30 L20 25 Z"
        fill="currentColor"
      />
      <rect x="25" y="55" width="50" height="30" fill="currentColor" />
      <circle cx="30" cy="20" r="2" fill="currentColor" />
      <circle cx="45" cy="15" r="2" fill="currentColor" />
      <circle cx="50" cy="10" r="2" fill="currentColor" />
      <circle cx="55" cy="15" r="2" fill="currentColor" />
      <circle cx="70" cy="20" r="2" fill="currentColor" />
    </svg>
  ),
  
  rook: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="25" y="15" width="50" height="70" fill="currentColor" />
      <rect x="20" y="10" width="60" height="10" fill="currentColor" />
      <rect x="25" y="5" width="10" height="10" fill="currentColor" />
      <rect x="40" y="5" width="10" height="10" fill="currentColor" />
      <rect x="55" y="5" width="10" height="10" fill="currentColor" />
      <rect x="70" y="5" width="10" height="10" fill="currentColor" />
    </svg>
  ),
  
  bishop: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="70" rx="25" ry="15" fill="currentColor" />
      <path
        d="M35 55 Q50 10 65 55 Q60 60 50 65 Q40 60 35 55 Z"
        fill="currentColor"
      />
      <circle cx="50" cy="15" r="4" fill="currentColor" />
      <path d="M46 12 L54 18 M54 12 L46 18" stroke="white" strokeWidth="1" />
    </svg>
  ),
  
  knight: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="25" y="75" width="50" height="10" fill="currentColor" />
      <path
        d="M30 75 L35 65 L40 55 L45 45 L50 35 L55 25 L60 20 L65 18 L70 20 L72 25 L70 30 L65 35 L60 40 L55 45 L50 50 L45 55 L40 60 L35 65 L30 70 L30 75 Z"
        fill="currentColor"
      />
      <circle cx="62" cy="25" r="2" fill="white" />
      <path d="M55 30 Q60 28 65 32" stroke="white" strokeWidth="1" fill="none" />
    </svg>
  ),
  
  pawn: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="35" y="65" width="30" height="20" fill="currentColor" />
      <circle cx="50" cy="55" r="15" fill="currentColor" />
      <circle cx="50" cy="25" r="12" fill="currentColor" />
    </svg>
  )
};

