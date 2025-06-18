"use client"

import { useCallback } from "react"
import type { Board, Piece, Square } from "@/types/chess"
import type { AILevel } from "@/app/page"

interface AIMove {
  from: Square
  to: Square
  score: number
  promotion?: "queen" | "rook" | "bishop" | "knight"
}

export function useAI(aiLevel: AILevel) {
  const isValidSquare = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  const getPieceValue = (piece: Piece): number => {
    const values = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 100,
    }
    return values[piece.type]
  }

  const evaluateBoard = useCallback((board: Board, color: "white" | "black"): number => {
    let score = 0

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece) {
          const pieceValue = getPieceValue(piece)
          if (piece.color === color) {
            score += pieceValue
            // Positional bonuses
            if (piece.type === "pawn") {
              // Pawns are more valuable when advanced
              score += piece.color === "white" ? (6 - row) * 0.1 : (row - 1) * 0.1
            }
            if (piece.type === "knight" || piece.type === "bishop") {
              // Knights and bishops are better in center
              const centerDistance = Math.abs(3.5 - row) + Math.abs(3.5 - col)
              score += (7 - centerDistance) * 0.1
            }
          } else {
            score -= pieceValue
            // Positional penalties for opponent
            if (piece.type === "pawn") {
              score -= piece.color === "white" ? (6 - row) * 0.1 : (row - 1) * 0.1
            }
          }
        }
      }
    }

    return score
  }, [])

  const getRawPossibleMoves = useCallback((piece: Piece, row: number, col: number, board: Board): Square[] => {
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

  const getAllPossibleMoves = useCallback(
    (board: Board, color: "white" | "black"): AIMove[] => {
      const allMoves: AIMove[] = []

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col]
          if (piece && piece.color === color) {
            const possibleMoves = getRawPossibleMoves(piece, row, col, board)

            for (const move of possibleMoves) {
              // Check for pawn promotion
              const isPawnPromotion =
                (piece.color === "white" && move.row === 0) || (piece.color === "black" && move.row === 7)

              if (isPawnPromotion) {
                // Generate moves for each promotion piece
                const promotionPieces: ("queen" | "rook" | "bishop" | "knight")[] = [
                  "queen",
                  "rook",
                  "bishop",
                  "knight",
                ]

                for (const promotionPiece of promotionPieces) {
                  // Simulate the promotion
                  const testBoard = board.map((r) => [...r])
                  const capturedPiece = testBoard[move.row][move.col]
                  testBoard[move.row][move.col] = { type: promotionPiece, color: piece.color }
                  testBoard[row][col] = null

                  // Calculate move score with promotion bonus
                  let score = evaluateBoard(testBoard, color)

                  // Bonus for promotion (queen gets highest bonus)
                  const promotionBonus =
                    promotionPiece === "queen" ? 8 : promotionPiece === "rook" ? 4 : promotionPiece === "bishop" ? 2 : 2
                  score += promotionBonus

                  // Bonus for captures during promotion
                  if (capturedPiece) {
                    score += getPieceValue(capturedPiece) * 0.5
                  }

                  allMoves.push({
                    from: { row, col },
                    to: move,
                    score,
                    promotion: promotionPiece,
                  })
                }
              } else {
                // Regular pawn move (non-promotion)
                // Simulate the move
                const testBoard = board.map((r) => [...r])
                const capturedPiece = testBoard[move.row][move.col]
                testBoard[move.row][move.col] = piece
                testBoard[row][col] = null

                // Calculate move score
                let score = evaluateBoard(testBoard, color)

                // Bonus for captures
                if (capturedPiece) {
                  score += getPieceValue(capturedPiece) * 0.5
                }

                allMoves.push({
                  from: { row, col },
                  to: move,
                  score,
                })
              }
            }
          }
        }
      }

      return allMoves
    },
    [getRawPossibleMoves, evaluateBoard],
  )

  const getAIMove = useCallback(
    (board: Board, color: "white" | "black"): AIMove | null => {
      const allMoves = getAllPossibleMoves(board, color)

      if (allMoves.length === 0) return null

      // Sort moves by score
      allMoves.sort((a, b) => b.score - a.score)

      let selectedMove: AIMove

      switch (aiLevel) {
        case "easy":
          // Easy: 70% random, 30% best move
          if (Math.random() < 0.3) {
            selectedMove = allMoves[0] // Best move
          } else {
            selectedMove = allMoves[Math.floor(Math.random() * Math.min(allMoves.length, 5))] // Random from top 5
          }
          break

        case "medium":
          // Medium: 50% best moves, 50% good moves
          if (Math.random() < 0.5) {
            selectedMove = allMoves[Math.floor(Math.random() * Math.min(allMoves.length, 3))] // Top 3
          } else {
            selectedMove = allMoves[Math.floor(Math.random() * Math.min(allMoves.length, 8))] // Top 8
          }
          break

        case "hard":
          // Hard: 80% best moves, 20% very good moves
          if (Math.random() < 0.8) {
            selectedMove = allMoves[Math.floor(Math.random() * Math.min(allMoves.length, 2))] // Top 2
          } else {
            selectedMove = allMoves[Math.floor(Math.random() * Math.min(allMoves.length, 4))] // Top 4
          }
          break

        case "expert":
          // Expert: Always best move with slight randomization among equally good moves
          const bestScore = allMoves[0].score
          const bestMoves = allMoves.filter((move) => Math.abs(move.score - bestScore) < 0.1)
          selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)]
          break

        default:
          selectedMove = allMoves[0]
      }

      return selectedMove
    },
    [aiLevel, getAllPossibleMoves],
  )

  return { getAIMove }
}
