"use client"

import type { PieceType, PieceColor as ChessPieceColor } from "@/types/chess"
import type { PieceColor } from "@/app/page"
import { ChessPieceSVG } from "./chess-piece-svg-enhanced"

interface PieceColors {
  white: PieceColor
  black: PieceColor
}

interface ChessPieceProps {
  type: PieceType
  color: ChessPieceColor
  playerColors: PieceColors
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
  const selectedColor = color === "white" ? playerColors.white : playerColors.black
  const textColor = colorMap[selectedColor]

  // Fallback to Unicode symbols if SVG doesn't work
  const unicodeSymbols: Record<string, string> = {
    k: color === 'white' ? '♔' : '♚',  // king
    q: color === 'white' ? '♕' : '♛',  // queen
    r: color === 'white' ? '♖' : '♜',  // rook
    b: color === 'white' ? '♗' : '♝',  // bishop
    n: color === 'white' ? '♘' : '♞',  // knight
    p: color === 'white' ? '♙' : '♟'   // pawn
  }

  return (
    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${textColor} drop-shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer`}>
      <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl">
        {unicodeSymbols[type] || '?'}
      </div>
    </div>
  )
}
