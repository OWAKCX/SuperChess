"use client"

import { useState, useCallback } from "react"
import type { Board, Piece, Square, GameStatus } from "@/types/chess"

const initialBoard: Board = [
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
  Array(8).fill({ type: "pawn", color: "black" }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: "pawn", color: "white" }),
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

interface LastMove {
  from: Square
  to: Square
  piece: Piece
  wasTwoSquarePawnMove: boolean
}

type PromotionPiece = "queen" | "rook" | "bishop" | "knight"

export function useChessEngine() {
  const [board, setBoard] = useState<Board>(initialBoard)
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [validMoves, setValidMoves] = useState<Square[]>([])
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [isInCheck, setIsInCheck] = useState(false)
  const [lastMove, setLastMove] = useState<LastMove | null>(null)
  const [promotionSquare, setPromotionSquare] = useState<Square | null>(null)
  const [promotionColor, setPromotionColor] = useState<"white" | "black" | null>(null)

  const isValidSquare = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  const findKing = useCallback((board: Board, color: "white" | "black"): Square | null => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && piece.type === "king" && piece.color === color) {
          return { row, col }
        }
      }
    }
    return null
  }, [])

  const isSquareUnderAttack = useCallback((board: Board, square: Square, byColor: "white" | "black"): boolean => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && piece.color === byColor) {
          const moves = getRawPossibleMoves(piece, row, col, board, null)
          if (moves.some((move) => move.row === square.row && move.col === square.col)) {
            return true
          }
        }
      }
    }
    return false
  }, [])

  const isKingInCheck = useCallback(
    (board: Board, color: "white" | "black"): boolean => {
      const kingPos = findKing(board, color)
      if (!kingPos) return false

      const opponentColor = color === "white" ? "black" : "white"
      return isSquareUnderAttack(board, kingPos, opponentColor)
    },
    [findKing, isSquareUnderAttack],
  )

  // Raw moves without checking king safety - used for attack detection
  const getRawPossibleMoves = useCallback(
    (piece: Piece, row: number, col: number, board: Board, lastMove: LastMove | null): Square[] => {
      const moves: Square[] = []

      switch (piece.type) {
        case "pawn":
          const direction = piece.color === "white" ? -1 : 1
          const startRow = piece.color === "white" ? 6 : 1
          const enPassantRank = piece.color === "white" ? 3 : 4

          // Forward move
          if (isValidSquare(row + direction, col) && !board[row + direction][col]) {
            moves.push({ row: row + direction, col })

            // Double move from start
            if (row === startRow && !board[row + 2 * direction][col]) {
              moves.push({ row: row + 2 * direction, col })
            }
          }

          // Regular captures
          for (const dc of [-1, 1]) {
            if (isValidSquare(row + direction, col + dc)) {
              const target = board[row + direction][col + dc]
              if (target && target.color !== piece.color) {
                moves.push({ row: row + direction, col: col + dc })
              }
            }
          }

          // En passant capture
          if (row === enPassantRank && lastMove) {
            // Check if last move was a two-square pawn move
            if (
              lastMove.wasTwoSquarePawnMove &&
              lastMove.piece.type === "pawn" &&
              lastMove.piece.color !== piece.color &&
              lastMove.to.row === row && // Same rank as our pawn
              Math.abs(lastMove.to.col - col) === 1 // Adjacent column
            ) {
              // We can capture en passant
              const captureCol = lastMove.to.col
              const captureRow = row + direction
              if (isValidSquare(captureRow, captureCol)) {
                moves.push({ row: captureRow, col: captureCol })
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
    },
    [],
  )

  // Legal moves that consider king safety
  const getPossibleMoves = useCallback(
    (piece: Piece, row: number, col: number, board: Board): Square[] => {
      const rawMoves = getRawPossibleMoves(piece, row, col, board, lastMove)

      // Filter moves that would leave or put the king in check
      return rawMoves.filter((move) => {
        const testBoard = board.map((boardRow) => [...boardRow])
        testBoard[move.row][move.col] = piece
        testBoard[row][col] = null

        // Handle en passant capture in test board
        if (
          piece.type === "pawn" &&
          lastMove &&
          lastMove.wasTwoSquarePawnMove &&
          lastMove.piece.type === "pawn" &&
          lastMove.piece.color !== piece.color &&
          lastMove.to.row === row &&
          Math.abs(lastMove.to.col - col) === 1 &&
          move.col === lastMove.to.col &&
          move.row === row + (piece.color === "white" ? -1 : 1)
        ) {
          // Remove the captured pawn in en passant
          testBoard[lastMove.to.row][lastMove.to.col] = null
        }

        return !isKingInCheck(testBoard, piece.color)
      })
    },
    [getRawPossibleMoves, isKingInCheck, lastMove],
  )

  const getAllLegalMoves = useCallback(
    (board: Board, color: "white" | "black"): Square[] => {
      const allMoves: Square[] = []
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col]
          if (piece && piece.color === color) {
            const moves = getPossibleMoves(piece, row, col, board)
            allMoves.push(...moves)
          }
        }
      }
      return allMoves
    },
    [getPossibleMoves],
  )

  const checkGameStatus = useCallback(
    (board: Board, color: "white" | "black"): GameStatus => {
      const inCheck = isKingInCheck(board, color)
      const legalMoves = getAllLegalMoves(board, color)

      if (legalMoves.length === 0) {
        if (inCheck) {
          return "checkmate"
        } else {
          return "stalemate"
        }
      }

      if (inCheck) {
        return "check"
      }

      return "playing"
    },
    [isKingInCheck, getAllLegalMoves],
  )

  const selectSquare = useCallback(
    (row: number, col: number) => {
      // Prevent moves when game is over
      if (gameStatus !== "playing" && gameStatus !== "check") return

      const piece = board[row][col]

      if (selectedSquare) {
        // Try to make a move
        const isValidMove = validMoves.some((move) => move.row === row && move.col === col)

        if (isValidMove) {
          makeMove(selectedSquare, { row, col })
          setSelectedSquare(null)
          setValidMoves([])
        } else if (piece && piece.color === currentPlayer) {
          // Select new piece - but only show legal moves
          setSelectedSquare({ row, col })
          const legalMoves = getPossibleMoves(piece, row, col, board)
          setValidMoves(legalMoves)
        } else {
          // Deselect
          setSelectedSquare(null)
          setValidMoves([])
        }
      } else if (piece && piece.color === currentPlayer) {
        // Select piece - but only show legal moves
        setSelectedSquare({ row, col })
        const legalMoves = getPossibleMoves(piece, row, col, board)
        setValidMoves(legalMoves)
      }
    },
    [board, selectedSquare, validMoves, currentPlayer, gameStatus, getPossibleMoves],
  )

  const makeMove = useCallback(
    (from: Square, to: Square, promotionPiece?: PromotionPiece) => {
      const newBoard = board.map((row) => [...row])
      const piece = newBoard[from.row][from.col]

      if (!piece) return

      // Check if this is pawn promotion
      const isPawnPromotion =
        piece.type === "pawn" &&
        ((piece.color === "white" && to.row === 0) || (piece.color === "black" && to.row === 7))

      // If it's pawn promotion and no promotion piece is specified, show promotion dialog
      if (isPawnPromotion && !promotionPiece) {
        setPromotionSquare(to)
        setPromotionColor(piece.color)
        return
      }

      // Check if this is an en passant capture
      const isEnPassant =
        piece.type === "pawn" &&
        lastMove &&
        lastMove.wasTwoSquarePawnMove &&
        lastMove.piece.type === "pawn" &&
        lastMove.piece.color !== piece.color &&
        lastMove.to.row === from.row &&
        Math.abs(lastMove.to.col - from.col) === 1 &&
        to.col === lastMove.to.col &&
        to.row === from.row + (piece.color === "white" ? -1 : 1) &&
        !newBoard[to.row][to.col]

      // Make the move
      const finalPiece = isPawnPromotion && promotionPiece ? { type: promotionPiece, color: piece.color } : piece

      newBoard[to.row][to.col] = finalPiece
      newBoard[from.row][from.col] = null

      // Handle en passant capture - remove the captured pawn
      if (isEnPassant && lastMove) {
        newBoard[lastMove.to.row][lastMove.to.col] = null
      }

      // Check if this move is a two-square pawn move
      const wasTwoSquarePawnMove = piece.type === "pawn" && Math.abs(to.row - from.row) === 2

      // Create move notation
      let moveNotation = `${piece.type}${String.fromCharCode(97 + from.col)}${8 - from.row}-${String.fromCharCode(97 + to.col)}${8 - to.row}`
      if (isEnPassant) {
        moveNotation += " e.p."
      }
      if (isPawnPromotion && promotionPiece) {
        moveNotation += `=${promotionPiece}`
      }

      setMoveHistory((prev) => [...prev, moveNotation])

      // Update last move
      setLastMove({
        from,
        to,
        piece: finalPiece,
        wasTwoSquarePawnMove,
      })

      // Clear promotion state
      setPromotionSquare(null)
      setPromotionColor(null)

      // Switch players
      const nextPlayer = currentPlayer === "white" ? "black" : "white"

      // Check game status for the next player
      const newGameStatus = checkGameStatus(newBoard, nextPlayer)
      const kingInCheck = isKingInCheck(newBoard, nextPlayer)

      setBoard(newBoard)
      setCurrentPlayer(nextPlayer)
      setGameStatus(newGameStatus)
      setIsInCheck(kingInCheck)
    },
    [board, currentPlayer, lastMove, checkGameStatus, isKingInCheck],
  )

  const handlePromotion = useCallback(
    (promotionPiece: PromotionPiece) => {
      if (selectedSquare && promotionSquare) {
        makeMove(selectedSquare, promotionSquare, promotionPiece)
        setSelectedSquare(null)
        setValidMoves([])
      }
    },
    [selectedSquare, promotionSquare, makeMove],
  )

  const makeAIMove = useCallback(
    (from: Square, to: Square) => {
      makeMove(from, to)
    },
    [makeMove],
  )

  const resetGame = useCallback(() => {
    setBoard(initialBoard)
    setCurrentPlayer("white")
    setGameStatus("playing")
    setSelectedSquare(null)
    setValidMoves([])
    setMoveHistory([])
    setIsInCheck(false)
    setLastMove(null)
    setPromotionSquare(null)
    setPromotionColor(null)
  }, [])

  return {
    board,
    currentPlayer,
    gameStatus,
    selectedSquare,
    validMoves,
    moveHistory,
    isInCheck,
    lastMove,
    promotionSquare,
    promotionColor,
    selectSquare,
    makeAIMove,
    handlePromotion,
    resetGame,
  }
}
