"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChessPiece } from "@/components/chess-piece"
import { RefreshCw } from "lucide-react"
import { validateCheckmateInOne, validateBestTrade } from "@/utils/puzzle-validator"
import type { Board, Piece, Square } from "@/types/chess"
import type { PieceColors, PuzzleType } from "@/app/page"
import { PawnPromotionDialog } from "./pawn-promotion-dialog"

interface ChessPuzzleProps {
  board: Board
  playerColors: PieceColors
  puzzleType: PuzzleType
  onPuzzleSolved: () => void
  onPuzzleFailed: () => void
}

type PromotionPiece = "queen" | "rook" | "bishop" | "knight"

export function ChessPuzzle({ board, playerColors, puzzleType, onPuzzleSolved, onPuzzleFailed }: ChessPuzzleProps) {
  const [puzzleBoard, setPuzzleBoard] = useState<Board>(board)
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [validMoves, setValidMoves] = useState<Square[]>([])
  const [moveHistory, setMoveHistory] = useState<{ from: Square; to: Square; piece: Piece }[]>([])
  const [promotionSquare, setPromotionSquare] = useState<Square | null>(null)
  const [promotionColor, setPromotionColor] = useState<"white" | "black" | null>(null)
  const [language, setLanguage] = useState<string>("en") // Added language state, default to "en"

  useEffect(() => {
    setPuzzleBoard(board)
    setSelectedSquare(null)
    setValidMoves([])
    setMoveHistory([])
  }, [board])

  const isValidSquare = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  const getPossibleMoves = useCallback((piece: Piece, row: number, col: number, board: Board): Square[] => {
    const moves: Square[] = []

    switch (piece.type) {
      case "pawn":
        const direction = piece.color === "white" ? -1 : 1
        const startRow = piece.color === "white" ? 6 : 1

        // Forward move
        if (isValidSquare(row + direction, col) && !board[row + direction][col]) {
          moves.push({ row: row + direction, col })
          // Double move from start
          if (row === startRow && !board[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col })
          }
        }

        // Captures
        for (const dc of [-1, 1]) {
          if (isValidSquare(row + direction, col + dc)) {
            const target = board[row + direction][col + dc]
            if (target && target.color !== piece.color) {
              moves.push({ row: row + direction, col: col + dc })
            }
          }
        }
        break

      case "rook":
        const rookDirections = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ]
        for (const [dr, dc] of rookDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i
            const newCol = col + dc * i
            if (!isValidSquare(newRow, newCol)) break

            const target = board[newRow][newCol]
            if (!target) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break

      case "bishop":
        const bishopDirections = [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]
        for (const [dr, dc] of bishopDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i
            const newCol = col + dc * i
            if (!isValidSquare(newRow, newCol)) break

            const target = board[newRow][newCol]
            if (!target) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break

      case "queen":
        const queenDirections = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]
        for (const [dr, dc] of queenDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i
            const newCol = col + dc * i
            if (!isValidSquare(newRow, newCol)) break

            const target = board[newRow][newCol]
            if (!target) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break

      case "king":
        const kingMoves = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]
        for (const [dr, dc] of kingMoves) {
          const newRow = row + dr
          const newCol = col + dc
          if (isValidSquare(newRow, newCol)) {
            const target = board[newRow][newCol]
            if (!target || target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        }
        break

      case "knight":
        const knightMoves = [
          [2, 1],
          [2, -1],
          [-2, 1],
          [-2, -1],
          [1, 2],
          [1, -2],
          [-1, 2],
          [-1, -2],
        ]
        for (const [dr, dc] of knightMoves) {
          const newRow = row + dr
          const newCol = col + dc
          if (isValidSquare(newRow, newCol)) {
            const target = board[newRow][newCol]
            if (!target || target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        }
        break
    }

    return moves
  }, [])

  const handleSquareClick = (row: number, col: number) => {
    const piece = puzzleBoard[row][col]

    if (selectedSquare) {
      // Try to make a move
      const isValidMove = validMoves.some((move) => move.row === row && move.col === col)

      if (isValidMove) {
        const from = selectedSquare
        const to = { row, col }
        const movingPiece = puzzleBoard[from.row][from.col]

        if (movingPiece) {
          // Check if this is pawn promotion
          const isPawnPromotion =
            movingPiece.type === "pawn" &&
            ((movingPiece.color === "white" && to.row === 0) || (movingPiece.color === "black" && to.row === 7))

          if (isPawnPromotion) {
            setPromotionSquare(to)
            setPromotionColor(movingPiece.color)
            return
          }

          // Make regular move
          makeMove(from, to, movingPiece)
        }

        setSelectedSquare(null)
        setValidMoves([])
      } else if (piece && piece.color === "white") {
        // Select new piece
        setSelectedSquare({ row, col })
        const moves = getPossibleMoves(piece, row, col, puzzleBoard)
        setValidMoves(moves)
      } else {
        // Deselect
        setSelectedSquare(null)
        setValidMoves([])
      }
    } else if (piece && piece.color === "white") {
      // Select piece (only white pieces can be moved in puzzles)
      setSelectedSquare({ row, col })
      const moves = getPossibleMoves(piece, row, col, puzzleBoard)
      setValidMoves(moves)
    }
  }

  const handlePromotion = (promotionPiece: PromotionPiece) => {
    if (selectedSquare && promotionSquare) {
      const movingPiece = puzzleBoard[selectedSquare.row][selectedSquare.col]
      if (movingPiece) {
        const promotedPiece = { type: promotionPiece, color: movingPiece.color }
        makeMove(selectedSquare, promotionSquare, promotedPiece)
      }
      setPromotionSquare(null)
      setPromotionColor(null)
      setSelectedSquare(null)
      setValidMoves([])
    }
  }

  const makeMove = (from: Square, to: Square, piece: Piece) => {
    // Make the move
    const newBoard = puzzleBoard.map((r) => [...r])
    newBoard[to.row][to.col] = piece
    newBoard[from.row][from.col] = null
    setPuzzleBoard(newBoard)

    // Record the move
    setMoveHistory([...moveHistory, { from, to, piece }])

    // Validate the puzzle
    if (puzzleType === "checkmate") {
      if (validateCheckmateInOne(newBoard, piece.color)) {
        onPuzzleSolved()
      } else {
        onPuzzleFailed()
      }
    } else if (puzzleType === "trades") {
      if (validateBestTrade(from, to, puzzleBoard, piece)) {
        onPuzzleSolved()
      } else {
        onPuzzleFailed()
      }
    }
  }

  const handleResetPuzzle = () => {
    setPuzzleBoard(board)
    setSelectedSquare(null)
    setValidMoves([])
    setMoveHistory([])
  }

  const isLightSquare = (row: number, col: number) => {
    return (row + col) % 2 === 0
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">
          {puzzleType === "checkmate"
            ? "Checkmate in One"
            : puzzleType === "trades"
              ? "Find Best Trade"
              : "Custom Puzzle"}
        </h3>
        <Button
          onClick={handleResetPuzzle}
          size="sm"
          className="bg-transparent border border-white/30 text-white hover:bg-white/10"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      <div className="inline-block p-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
        <div className="grid grid-cols-8 gap-0 border-2 border-amber-600">
          {puzzleBoard.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer
                  ${isLightSquare(rowIndex, colIndex) ? "bg-amber-100" : "bg-amber-800"}
                  ${selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex ? "ring-4 ring-blue-400" : ""}
                  ${validMoves.some((move) => move.row === rowIndex && move.col === colIndex) ? "ring-2 ring-green-400" : ""}
                  hover:brightness-110
                  transition-all
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && <ChessPiece type={piece.type} color={piece.color} playerColors={playerColors} />}
                {validMoves.some((move) => move.row === rowIndex && move.col === colIndex) && !piece && (
                  <div className="w-3 h-3 bg-green-400 rounded-full opacity-60" />
                )}
              </div>
            )),
          )}
        </div>
      </div>

      {moveHistory.length > 0 && (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-sm font-medium text-white/80 mb-2">Move History</h4>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {moveHistory.map((move, index) => (
              <div key={index} className="text-sm text-white/70">
                {index + 1}. {move.piece.type} {String.fromCharCode(97 + move.from.col)}
                {8 - move.from.row} → {String.fromCharCode(97 + move.to.col)}
                {8 - move.to.row}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Pawn Promotion Dialog */}
      {promotionSquare && promotionColor && (
        <PawnPromotionDialog
          color={promotionColor}
          playerColors={playerColors}
          language={language}
          onPromotion={handlePromotion}
        />
      )}
    </div>
  )
}
