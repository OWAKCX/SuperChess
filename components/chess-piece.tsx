"use client"

import type { PieceType, PieceColor as ChessPieceColor } from "@/types/chess"
import type { PieceColor } from "@/app/page"

interface PieceColors {
  white: PieceColor
  black: PieceColor
}

interface ChessPieceProps {
  type: PieceType
  color: ChessPieceColor
  playerColors: PieceColors
}

const pieceSymbols: Record<PieceType, { white: string; black: string }> = {
  king: { white: "♔", black: "♚" },
  queen: { white: "♕", black: "♛" },
  rook: { white: "♖", black: "♜" },
  bishop: { white: "♗", black: "♝" },
  knight: { white: "♘", black: "♞" },
  pawn: { white: "♙", black: "♟" },
}

const colorMap: Record<PieceColor, string> = {
  red: "text-red-500",
  blue: "text-blue-500",
  green: "text-green-500",
  pink: "text-pink-500",
  yellow: "text-yellow-500",
  orange: "text-orange-500",
  black: "text-gray-900",
  white: "text-gray-100",
}

export function ChessPiece({ type, color, playerColors }: ChessPieceProps) {
  const symbol = pieceSymbols[type][color]
  const selectedColor = color === "white" ? playerColors.white : playerColors.black
  const textColor = colorMap[selectedColor]

  return <span className={`text-4xl sm:text-5xl ${textColor} drop-shadow-sm`}>{symbol}</span>
}
