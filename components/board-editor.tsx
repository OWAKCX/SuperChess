"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChessPiece } from "@/components/chess-piece"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, RotateCcw } from "lucide-react"
import type { Board, PieceType, PieceColor as ChessPieceColor } from "@/types/chess"
import type { PieceColors } from "@/app/page"

interface BoardEditorProps {
  onBoardChange: (board: Board) => void
  playerColors: PieceColors
}

const initialEmptyBoard: Board = Array(8)
  .fill(null)
  .map(() => Array(8).fill(null))

const pieceTypes: PieceType[] = ["king", "queen", "rook", "bishop", "knight", "pawn"]

export function BoardEditor({ onBoardChange, playerColors }: BoardEditorProps) {
  const [board, setBoard] = useState<Board>(initialEmptyBoard)
  const [selectedPiece, setSelectedPiece] = useState<{ type: PieceType; color: ChessPieceColor } | null>(null)
  const [activeColor, setActiveColor] = useState<ChessPieceColor>("white")

  useEffect(() => {
    onBoardChange(board)
  }, [board, onBoardChange])

  const handleSquareClick = (row: number, col: number) => {
    if (selectedPiece) {
      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = { ...selectedPiece }
      setBoard(newBoard)
    } else {
      // If no piece is selected, remove the piece at the clicked square
      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = null
      setBoard(newBoard)
    }
  }

  const handlePieceSelect = (type: PieceType) => {
    setSelectedPiece({ type, color: activeColor })
  }

  const handleClearBoard = () => {
    setBoard(initialEmptyBoard)
    setSelectedPiece(null)
  }

  const handleResetToStartPosition = () => {
    const startPosition: Board = [
      [
        { type: "rook", color: "black" },
        { type: "knight", color: "black" },
        { type: "bishop", color: "black" },
        { type: "queen", color: "black" },
        { type: "king", color: "black" },
        { type: "bishop", color: "black" },
        { type: "knight", color: "black" },
        { type: "rook", color: "black" },
      ],
      Array(8)
        .fill(null)
        .map(() => ({ type: "pawn", color: "black" })),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8)
        .fill(null)
        .map(() => ({ type: "pawn", color: "white" })),
      [
        { type: "rook", color: "white" },
        { type: "knight", color: "white" },
        { type: "bishop", color: "white" },
        { type: "queen", color: "white" },
        { type: "king", color: "white" },
        { type: "bishop", color: "white" },
        { type: "knight", color: "white" },
        { type: "rook", color: "white" },
      ],
    ]
    setBoard(startPosition)
    setSelectedPiece(null)
  }

  const isLightSquare = (row: number, col: number) => {
    return (row + col) % 2 === 0
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs
          value={activeColor}
          onValueChange={(value) => setActiveColor(value as ChessPieceColor)}
          className="w-auto"
        >
          <TabsList className="bg-white/10 border border-white/20">
            <TabsTrigger value="white" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              White
            </TabsTrigger>
            <TabsTrigger value="black" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Black
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex space-x-2">
          <Button
            onClick={handleClearBoard}
            size="sm"
            className="bg-transparent border border-red-400/50 text-red-400 hover:bg-red-400/10"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
          <Button
            onClick={handleResetToStartPosition}
            size="sm"
            className="bg-transparent border border-white/30 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {pieceTypes.map((type) => (
          <Button
            key={type}
            onClick={() => handlePieceSelect(type)}
            className={`p-2 h-auto bg-transparent border ${
              selectedPiece?.type === type && selectedPiece?.color === activeColor
                ? "border-blue-400 bg-blue-400/10"
                : "border-white/30 hover:bg-white/10"
            }`}
          >
            <ChessPiece type={type} color={activeColor} playerColors={playerColors} />
          </Button>
        ))}
        <Button
          onClick={() => setSelectedPiece(null)}
          className={`p-2 h-auto bg-transparent border ${
            selectedPiece === null ? "border-blue-400 bg-blue-400/10" : "border-white/30 hover:bg-white/10"
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center text-white">✕</div>
        </Button>
      </div>

      <div className="inline-block p-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
        <div className="grid grid-cols-8 gap-0 border-2 border-amber-600">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer
                  ${isLightSquare(rowIndex, colIndex) ? "bg-amber-100" : "bg-amber-800"}
                  hover:brightness-110
                  transition-all
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && <ChessPiece type={piece.type} color={piece.color} playerColors={playerColors} />}
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  )
}
