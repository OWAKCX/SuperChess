// Enhanced chess piece SVG components with better styling
export const ChessPieceSVG = {
  king: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="kingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path
        d="M50 15 L48 12 L45 15 L45 20 L40 20 L40 25 L45 25 L45 30 L40 30 L35 35 L35 40 L30 45 L30 80 L70 80 L70 45 L65 40 L65 35 L60 30 L55 30 L55 25 L60 25 L60 20 L55 20 L55 15 L52 12 L50 15 Z"
        fill="url(#kingGradient)"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="50" cy="12" r="2" fill="currentColor" />
      <rect x="47" y="8" width="6" height="2" fill="currentColor" />
      <rect x="49" y="6" width="2" height="2" fill="currentColor" />
      <rect x="25" y="80" width="50" height="5" fill="currentColor" />
    </svg>
  ),
  
  queen: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="queenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path
        d="M25 30 L30 25 L35 30 L40 20 L45 30 L50 15 L55 30 L60 20 L65 30 L70 25 L75 30 L70 35 L65 40 L60 45 L55 50 L50 55 L45 50 L40 45 L35 40 L30 35 L25 30 Z"
        fill="url(#queenGradient)"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect x="25" y="55" width="50" height="25" fill="url(#queenGradient)" />
      <circle cx="35" cy="25" r="2" fill="currentColor" />
      <circle cx="45" cy="20" r="2" fill="currentColor" />
      <circle cx="50" cy="15" r="2" fill="currentColor" />
      <circle cx="55" cy="20" r="2" fill="currentColor" />
      <circle cx="65" cy="25" r="2" fill="currentColor" />
      <rect x="25" y="80" width="50" height="5" fill="currentColor" />
    </svg>
  ),
  
  rook: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="rookGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect x="30" y="20" width="40" height="60" fill="url(#rookGradient)" stroke="currentColor" strokeWidth="1" />
      <rect x="25" y="15" width="50" height="8" fill="url(#rookGradient)" />
      <rect x="30" y="10" width="8" height="8" fill="currentColor" />
      <rect x="42" y="10" width="8" height="8" fill="currentColor" />
      <rect x="54" y="10" width="8" height="8" fill="currentColor" />
      <rect x="66" y="10" width="8" height="8" fill="currentColor" />
      <rect x="25" y="80" width="50" height="5" fill="currentColor" />
    </svg>
  ),
  
  bishop: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="bishopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="75" rx="25" ry="10" fill="url(#bishopGradient)" />
      <path
        d="M35 60 Q50 15 65 60 Q60 65 50 70 Q40 65 35 60 Z"
        fill="url(#bishopGradient)"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="50" cy="18" r="3" fill="currentColor" />
      <path d="M47 15 L53 21 M53 15 L47 21" stroke="white" strokeWidth="1.5" />
      <rect x="25" y="80" width="50" height="5" fill="currentColor" />
    </svg>
  ),
  
  knight: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="knightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect x="25" y="80" width="50" height="5" fill="currentColor" />
      <path
        d="M30 80 L35 70 L40 60 L45 50 L50 40 L55 30 L60 25 L65 23 L70 25 L72 30 L70 35 L65 40 L60 45 L55 50 L50 55 L45 60 L40 65 L35 70 L30 75 L30 80 Z"
        fill="url(#knightGradient)"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="62" cy="30" r="2" fill="white" />
      <path d="M55 35 Q60 33 65 37" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  
  pawn: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="pawnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect x="35" y="70" width="30" height="15" fill="url(#pawnGradient)" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="60" r="12" fill="url(#pawnGradient)" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="30" r="10" fill="url(#pawnGradient)" stroke="currentColor" strokeWidth="1" />
      <rect x="35" y="85" width="30" height="3" fill="currentColor" />
    </svg>
  )
};

