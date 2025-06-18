"use client"

import { ChessPiece } from "./chess-piece"
import type { Board, Square } from "@/types/chess"
import type { PieceColors } from "@/app/page"

interface ChessBoardProps {
  board: Board
  selectedSquare: Square | null
  validMoves: Square[]
  playerColors: PieceColors
  gameStatus: string
  winner: string | null
  language: string
  onSquareClick: (row: number, col: number) => void
}

export function ChessBoard({
  board,
  selectedSquare,
  validMoves,
  playerColors,
  gameStatus,
  winner,
  language,
  onSquareClick,
}: ChessBoardProps) {
  const isSquareSelected = (row: number, col: number) => {
    return selectedSquare?.row === row && selectedSquare?.col === col
  }

  const isValidMove = (row: number, col: number) => {
    return validMoves.some((move) => move.row === row && move.col === col)
  }

  const isLightSquare = (row: number, col: number) => {
    return (row + col) % 2 === 0
  }

  const isGameOver = gameStatus === "checkmate" || gameStatus === "stalemate" || gameStatus === "draw"

  const getGameOverMessage = () => {
    const messages = {
      en: {
        checkmate: "Checkmate!",
        stalemate: "Stalemate!",
        draw: "Draw!",
      },
      sr: {
        checkmate: "Šah-Mat!",
        stalemate: "Pat!",
        draw: "Nерешено!",
      },
      ru: {
        checkmate: "Шах и мат!",
        stalemate: "Пат!",
        draw: "Ничья!",
      },
    }

    const lang = language as keyof typeof messages
    const statusKey = gameStatus as keyof typeof messages.en
    return messages[lang]?.[statusKey] || messages.en[statusKey]
  }

  const handleSquareClick = (row: number, col: number) => {
    // Disable clicks when game is over
    if (isGameOver) return
    onSquareClick(row, col)
  }

  return (
    <div className="inline-block p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 relative select-none">
      <div className="grid grid-cols-8 gap-0 border-2 border-amber-600 relative">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer relative select-none
                ${isLightSquare(rowIndex, colIndex) ? "bg-amber-100" : "bg-amber-800"}
                ${isSquareSelected(rowIndex, colIndex) ? "ring-4 ring-blue-400" : ""}
                ${isValidMove(rowIndex, colIndex) ? "ring-2 ring-green-400" : ""}
                ${isGameOver ? "cursor-not-allowed opacity-75" : "hover:brightness-110"}
                transition-all
              `}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {piece && <ChessPiece type={piece.type} color={piece.color} playerColors={playerColors} />}
              {isValidMove(rowIndex, colIndex) && !piece && !isGameOver && (
                <div className="w-3 h-3 bg-green-400 rounded-full opacity-60" />
              )}
            </div>
          )),
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10 rounded">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-2xl animate-pulse">
                {getGameOverMessage()}
              </div>
              {winner && <div className="text-xl sm:text-2xl text-white/90 drop-shadow-lg">{winner}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Board coordinates */}
      <div className="flex justify-between mt-2 px-2">
        {["a", "b", "c", "d", "e", "f", "g", "h"].map((letter) => (
          <span key={letter} className="text-white/70 text-sm font-mono">
            {letter}
          </span>
        ))}
      </div>
    </div>
  )
}
