"use client"

import { ChessPiece } from "./chess-piece"
import type { PieceColor } from "@/app/page"

interface PieceColors {
  white: PieceColor
  black: PieceColor
}

interface ChessBoardProps {
  board: any[][]
  selectedSquare: string | null
  validMoves: string[]
  playerColors: PieceColors
  onSquareClick: (row: number, col: number) => void
  lastMove?: any
  isFlipped?: boolean
  isSquareHighlighted?: (square: string) => string | null
}

export function ChessBoard({
  board,
  selectedSquare,
  validMoves,
  playerColors,
  onSquareClick,
  lastMove,
  isFlipped = false,
  isSquareHighlighted
}: ChessBoardProps) {
  
  const isLightSquare = (row: number, col: number) => {
    return (row + col) % 2 === 0
  }

  const getSquareName = (row: number, col: number) => {
    return String.fromCharCode(97 + col) + (8 - row)
  }

  const isSelected = (row: number, col: number) => {
    const square = getSquareName(row, col)
    return selectedSquare === square
  }

  const isValidMove = (row: number, col: number) => {
    const square = getSquareName(row, col)
    return validMoves.includes(square)
  }

  const getSquareHighlight = (row: number, col: number) => {
    const square = getSquareName(row, col)
    if (isSquareHighlighted) {
      return isSquareHighlighted(square)
    }
    return null
  }

  const renderSquare = (row: number, col: number) => {
    const piece = board[row][col]
    const isLight = isLightSquare(row, col)
    const selected = isSelected(row, col)
    const validMove = isValidMove(row, col)
    const highlight = getSquareHighlight(row, col)
    
    let squareClass = `w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer relative transition-all duration-300 hover:scale-105 `
    
    if (isLight) {
      squareClass += "bg-amber-100 "
    } else {
      squareClass += "bg-amber-800 "
    }
    
    if (selected) {
      squareClass += "ring-4 ring-yellow-400 bg-yellow-200 "
    }
    
    if (validMove) {
      squareClass += "ring-2 ring-green-400 "
    }
    
    if (highlight === 'check') {
      squareClass += "bg-red-400 animate-pulse "
    }

    return (
      <div
        key={`${row}-${col}`}
        className={squareClass}
        onClick={() => onSquareClick(row, col)}
      >
        {piece && (
          <ChessPiece
            type={piece.type}
            color={piece.color}
            playerColors={playerColors}
          />
        )}
        {validMove && !piece && (
          <div className="w-3 h-3 bg-green-400 rounded-full opacity-60 animate-bounce" />
        )}
      </div>
    )
  }

  const renderBoard = () => {
    const squares = []
    const boardToRender = isFlipped ? [...board].reverse() : board
    
    for (let row = 0; row < 8; row++) {
      const actualRow = isFlipped ? 7 - row : row
      for (let col = 0; col < 8; col++) {
        const actualCol = isFlipped ? 7 - col : col
        squares.push(renderSquare(actualRow, actualCol))
      }
    }
    
    return squares
  }

  const renderCoordinates = () => {
    const files = isFlipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const ranks = isFlipped ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1']
    
    return (
      <>
        {/* Files (bottom) */}
        <div className="flex">
          <div className="w-6"></div>
          {files.map(file => (
            <div key={file} className="w-12 sm:w-16 text-center text-white text-sm font-medium">
              {file}
            </div>
          ))}
        </div>
        
        {/* Ranks (left side) */}
        <div className="absolute left-0 top-0 flex flex-col">
          {ranks.map((rank, index) => (
            <div key={rank} className="w-6 h-12 sm:h-16 flex items-center justify-center text-white text-sm font-medium">
              {rank}
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="grid grid-cols-8 gap-0 border-4 border-amber-900 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-50 to-amber-100">
          {renderBoard()}
        </div>
        {renderCoordinates()}
      </div>
    </div>
  )
}

