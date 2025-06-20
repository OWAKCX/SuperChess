import { useState, useEffect, useCallback } from 'react'
import { ChessEngine } from '@/lib/chess-engine'
import type { Move } from 'chess.js'

export interface GameState {
  board: any[][]
  turn: 'w' | 'b'
  isGameOver: boolean
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
  isDraw: boolean
  fen: string
  pgn: string
  history: Move[]
}

export function useChessEngine() {
  const [engine] = useState(() => new ChessEngine())
  const [gameState, setGameState] = useState<GameState>(() => engine.getGameState())
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [validMoves, setValidMoves] = useState<Move[]>([])

  const updateGameState = useCallback(() => {
    setGameState(engine.getGameState())
  }, [engine])

  const selectSquare = useCallback((square: string) => {
    if (selectedSquare === square) {
      setSelectedSquare(null)
      setValidMoves([])
      return
    }

    const piece = engine.getPiece(square)
    if (piece && piece.color === gameState.turn) {
      setSelectedSquare(square)
      setValidMoves(engine.getValidMoves(square))
    } else if (selectedSquare) {
      // Try to make a move
      const move = engine.makeMove(selectedSquare, square)
      if (move) {
        updateGameState()
        setSelectedSquare(null)
        setValidMoves([])
        return true // Move was successful
      }
    }
    return false
  }, [selectedSquare, gameState.turn, engine, updateGameState])

  const makeMove = useCallback((from: string, to: string, promotion?: string) => {
    const move = engine.makeMove(from, to, promotion)
    if (move) {
      updateGameState()
      setSelectedSquare(null)
      setValidMoves([])
      return move
    }
    return null
  }, [engine, updateGameState])

  const makeAIMove = useCallback((difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium') => {
    const aiMove = engine.getAIMove(difficulty)
    if (aiMove) {
      const move = engine.makeMove(aiMove.from, aiMove.to, aiMove.promotion)
      if (move) {
        updateGameState()
        return move
      }
    }
    return null
  }, [engine, updateGameState])

  const undoMove = useCallback(() => {
    const undoneMove = engine.undoMove()
    if (undoneMove) {
      updateGameState()
      setSelectedSquare(null)
      setValidMoves([])
    }
    return undoneMove
  }, [engine, updateGameState])

  const resetGame = useCallback(() => {
    engine.reset()
    updateGameState()
    setSelectedSquare(null)
    setValidMoves([])
  }, [engine, updateGameState])

  const isValidMove = useCallback((from: string, to: string, promotion?: string) => {
    return engine.validateMove(from, to, promotion)
  }, [engine])

  const isSquareHighlighted = useCallback((square: string) => {
    if (selectedSquare === square) return 'selected'
    if (validMoves.some(move => move.to === square)) return 'valid'
    if (gameState.isCheck && engine.getPiece(square)?.type === 'k' && engine.getPiece(square)?.color === gameState.turn) {
      return 'check'
    }
    return null
  }, [selectedSquare, validMoves, gameState.isCheck, gameState.turn, engine])

  return {
    gameState,
    selectedSquare,
    validMoves,
    selectSquare,
    makeMove,
    makeAIMove,
    undoMove,
    resetGame,
    isValidMove,
    isSquareHighlighted,
    engine
  }
}

