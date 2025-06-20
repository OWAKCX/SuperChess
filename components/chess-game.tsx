"use client"

import { useState, useEffect } from "react"
import { ChessBoard } from "./chess-board"
import { GameStatus } from "./game-status"
import { useChessEngine } from "@/hooks/use-chess-engine"
import { useTranslation } from "@/hooks/use-translation"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Bot } from "lucide-react"
import type { PieceColor, GameMode, Language, AIDifficulty } from "@/app/page"
import { PawnPromotionDialog } from "./pawn-promotion-dialog"

interface PieceColors {
  white: PieceColor
  black: PieceColor
}

interface ChessGameProps {
  gameMode: GameMode
  playerColors: PieceColors
  playerSide: "white" | "black"
  aiLevel: AIDifficulty
  language: Language
  onBackToMenu: () => void
}

export function ChessGame({ gameMode, playerColors, playerSide, aiLevel, language, onBackToMenu }: ChessGameProps) {
  const { t } = useTranslation(language)
  const { playSound, soundEnabled, toggleSound } = useSoundEffects()
  const {
    gameState,
    selectedSquare,
    validMoves,
    selectSquare,
    makeMove,
    makeAIMove,
    undoMove,
    resetGame,
    isSquareHighlighted
  } = useChessEngine()

  const [aiThinking, setAiThinking] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [promotionSquare, setPromotionSquare] = useState<string | null>(null)

  // Play game start sound
  useEffect(() => {
    if (!gameStarted) {
      playSound("gameStart")
      setGameStarted(true)
    }
  }, [playSound, gameStarted])

  // Play check/checkmate sounds
  useEffect(() => {
    if (gameState.isCheckmate) {
      playSound("checkmate")
    } else if (gameState.isCheck) {
      playSound("check")
    }
  }, [gameState.isCheckmate, gameState.isCheck, playSound])

  // AI move logic
  useEffect(() => {
    if (gameMode === "ai" && !gameState.isGameOver) {
      const aiSide = playerSide === "white" ? "b" : "w"
      const isAITurn = gameState.turn === aiSide

      if (isAITurn && !aiThinking) {
        setAiThinking(true)
        
        // Add delay for AI thinking
        setTimeout(() => {
          const aiMove = makeAIMove(aiLevel)
          if (aiMove) {
            playSound("move")
          }
          setAiThinking(false)
        }, 1000)
      }
    }
  }, [gameMode, gameState.turn, gameState.isGameOver, playerSide, aiLevel, makeAIMove, aiThinking, playSound])

  const handleSquareClick = (row: number, col: number) => {
    const square = String.fromCharCode(97 + col) + (8 - row)
    selectSquare(square)
  }

  const handleNewGame = () => {
    resetGame()
    setGameStarted(false)
    setPromotionSquare(null)
  }

  const handlePromotion = (piece: string) => {
    setPromotionSquare(null)
    // Handle promotion logic here if needed
  }

  // Convert chess.js board to our format
  const convertBoard = () => {
    const board = gameState.board
    console.log('Converting board:', board)
    return board.map((row) =>
      row.map((piece) => {
        if (!piece) return null
        console.log('Converting piece:', piece)
        return {
          type: piece.type,
          color: piece.color === 'w' ? 'white' : 'black'
        }
      })
    )
  }

  const currentPlayer = gameState.turn === 'w' ? 'white' : 'black'
  const gameStatus = gameState.isCheckmate ? 'checkmate' : 
                    gameState.isStalemate ? 'stalemate' : 
                    gameState.isDraw ? 'draw' : 
                    gameState.isCheck ? 'check' : 'playing'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* Game Controls */}
        <div className="flex lg:flex-col gap-2 lg:w-48">
          <Button
            onClick={onBackToMenu}
            variant="outline"
            className="flex-1 lg:flex-none border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToMenu")}
          </Button>

          <Button
            onClick={toggleSound}
            variant="outline"
            className="flex-1 lg:flex-none border-white/20 text-white hover:bg-white/10"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
            {soundEnabled ? t("soundOn") : t("soundOff")}
          </Button>

          <Button
            onClick={handleNewGame}
            variant="outline"
            className="flex-1 lg:flex-none border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t("newGame")}
          </Button>
        </div>

        {/* Chess Board */}
        <div className="flex-1 flex justify-center">
          <ChessBoard
            board={convertBoard()}
            onSquareClick={handleSquareClick}
            selectedSquare={selectedSquare}
            validMoves={validMoves.map(move => move.to)}
            lastMove={gameState.history.length > 0 ? gameState.history[gameState.history.length - 1] : null}
            playerColors={playerColors}
            isFlipped={playerSide === "black"}
            isSquareHighlighted={isSquareHighlighted}
          />
        </div>

        {/* Game Status */}
        <div className="lg:w-80">
          <GameStatus
            currentPlayer={currentPlayer}
            gameStatus={gameStatus}
            moveHistory={gameState.history}
            language={language}
            aiThinking={aiThinking && gameMode === "ai"}
            gameMode={gameMode}
            playerSide={playerSide}
            aiLevel={aiLevel}
          />
        </div>
      </div>

      {/* Pawn Promotion Dialog */}
      {promotionSquare && (
        <PawnPromotionDialog
          isOpen={!!promotionSquare}
          onClose={() => setPromotionSquare(null)}
          onSelect={handlePromotion}
          color={gameState.turn === 'w' ? 'white' : 'black'}
          playerColors={playerColors}
        />
      )}
    </div>
  )
}

