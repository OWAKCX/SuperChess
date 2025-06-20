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
    if (gameStatus === "checkmate") {
      playSound("checkmate")
    } else if (gameStatus === "check") {
      playSound("check")
    }
  }, [gameStatus, playSound])

  // Play move sounds when move history changes
  useEffect(() => {
    if (moveHistory.length > 0 && lastMove) {
      const lastMoveNotation = moveHistory[moveHistory.length - 1]

      if (lastMoveNotation.includes("e.p.")) {
        // En passant
        playSound("enPassant")
      } else {
        // Check if it was a capture (look for captured piece)
        const wasCapture = board.some((row, rowIndex) =>
          row.some((piece, colIndex) => {
            if (!piece) return false
            // This is a simplified capture detection
            // In a real implementation, you'd track the previous board state
            return false
          }),
        )

        // For now, we'll detect captures by checking if the destination had a piece
        // This is not perfect but works for most cases
        if (lastMove.to.row !== lastMove.from.row || lastMove.to.col !== lastMove.from.col) {
          // Simple heuristic: if it's a pawn moving diagonally, it's likely a capture
          const piece = board[lastMove.to.row][lastMove.to.col]
          if (piece?.type === "pawn" && Math.abs(lastMove.to.col - lastMove.from.col) === 1) {
            playSound("capture")
          } else {
            playSound("move")
          }
        }
      }
    }
  }, [moveHistory, lastMove, board, playSound])

  // AI move logic
  useEffect(() => {
    const aiSide = playerSide === "white" ? "black" : "white"
    if (gameMode === "ai" && currentPlayer === aiSide && gameStatus === "playing") {
      setAiThinking(true)

      // Get AI move based on difficulty level
      const aiMoveDelay = aiLevel === "easy" ? 500 : aiLevel === "medium" ? 1000 : aiLevel === "hard" ? 1500 : 2000

      const timer = setTimeout(() => {
        const aiMove = getAIMove(board, aiSide)
        if (aiMove) {
          makeAIMove(aiMove.from, aiMove.to)
        }
        setAiThinking(false)
      }, aiMoveDelay)

      return () => clearTimeout(timer)
    }
  }, [currentPlayer, gameMode, gameStatus, board, playerSide, aiLevel, getAIMove, makeAIMove])

  const handleSquareClick = (row: number, col: number) => {
    if (gameMode === "ai" && currentPlayer !== playerSide) return

    const piece = board[row][col]
    const wasValidMove = validMoves.some((move) => move.row === row && move.col === col)

    // Play selection sound when selecting a piece
    if (!selectedSquare && piece && piece.color === currentPlayer) {
      playSound("select")
    }

    // Play invalid move sound when clicking invalid square
    if (selectedSquare && !wasValidMove && (!piece || piece.color !== currentPlayer)) {
      playSound("invalidMove")
    }

    selectSquare(row, col)
  }

  const handleResetGame = () => {
    resetGame()
    setGameStarted(false)
    playSound("gameStart")
  }

  const getStatusMessage = () => {
    if (aiThinking) return `${t("aiThinking")} (${t(aiLevel)})`
    if (gameStatus === "checkmate") {
      return currentPlayer === "white" ? t("blackWins") : t("whiteWins")
    }
    if (gameStatus === "stalemate") return t("stalemate")
    if (gameStatus === "draw") return t("draw")
    if (isInCheck) return t("check")
    return currentPlayer === "white" ? t("whiteToMove") : t("blackToMove")
  }

  const getWinnerMessage = () => {
    if (gameStatus === "checkmate") {
      const winner = currentPlayer === "white" ? "black" : "white"
      const winnerText = winner === "white" ? t("white") : t("black")
      const youText =
        playerSide === winner ? ` (${t("you")})` : gameMode === "ai" ? ` (${t("ai")})` : ` (${t("opponent")})`
      return `${winnerText}${youText} ${t("wins")}`
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBackToMenu}
            className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToMenu")}
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleSound}
              className={`bg-transparent border-2 ${
                soundEnabled
                  ? "border-green-400 text-green-400 hover:bg-green-400/10"
                  : "border-red-400 text-red-400 hover:bg-red-400/10"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
              {soundEnabled ? t("soundOn") : t("soundOff")}
            </Button>

            <Button
              onClick={handleResetGame}
              className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("newGame")}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChessBoard
              board={board}
              selectedSquare={selectedSquare}
              validMoves={validMoves}
              playerColors={playerColors}
              gameStatus={gameStatus}
              winner={getWinnerMessage()}
              language={language}
              onSquareClick={handleSquareClick}
            />
          </div>

          <div className="space-y-4">
            <GameStatus
              status={getStatusMessage()}
              currentPlayer={currentPlayer}
              gameMode={gameMode}
              playerSide={playerSide}
              language={language}
            />

            {/* AI Difficulty Display */}
            {gameMode === "ai" && (
              <div className="p-4 bg-purple-500/10 backdrop-blur-lg border-purple-400/30 rounded-lg">
                <div className="flex items-center space-x-2 text-purple-400">
                  <Bot className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">{t("aiOpponent")}</div>
                    <div className="text-sm opacity-80">
                      {t("difficulty")}: {t(aiLevel)} - {t(aiLevel + "Description")}
                    </div>
                  </div>
                </div>
                {aiThinking && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-purple-300 text-sm">{t("aiAnalyzing")}</span>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 bg-white/10 backdrop-blur-lg border-white/20 rounded-lg">
              <h3 className="text-white font-semibold mb-2">{t("moveHistory")}</h3>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {moveHistory.map((move, index) => (
                  <div key={index} className="text-white/70 text-sm">
                    {Math.floor(index / 2) + 1}. {move}
                  </div>
                ))}
              </div>
            </div>

            {soundEnabled && (
              <div className="p-3 bg-green-500/10 backdrop-blur-lg border-green-400/30 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <Volume2 className="w-4 h-4" />
                  <span>{t("soundEffectsEnabled")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
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
    </div>
  )
}
