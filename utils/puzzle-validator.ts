"use client"

import type { Board, Piece, Square } from "@/types/chess"

// Check if the king is in checkmate
export function validateCheckmateInOne(board: Board, playerColor: "white" | "black"): boolean {
  // This is a simplified implementation
  // In a real app, you would implement full chess rules to validate checkmate

  // Find the opponent's king
  const opponentColor = playerColor === "white" ? "black" : "white"
  let kingPos: Square | null = null

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.type === "king" && piece.color === opponentColor) {
        kingPos = { row, col }
        break
      }
    }
    if (kingPos) break
  }

  if (!kingPos) return false

  // Check if the king is under attack
  const isUnderAttack = isSquareUnderAttack(board, kingPos, playerColor)

  // Check if the king has any legal moves
  const hasLegalMoves = hasKingLegalMoves(board, kingPos, opponentColor)

  // It's checkmate if the king is under attack and has no legal moves
  return isUnderAttack && !hasLegalMoves
}

// Check if a square is under attack by a specific color
function isSquareUnderAttack(board: Board, square: Square, byColor: "white" | "black"): boolean {
  // This is a simplified implementation
  // In a real app, you would check all possible attacking moves

  // Check for pawn attacks
  const pawnDirection = byColor === "white" ? 1 : -1
  for (const dc of [-1, 1]) {
    const attackRow = square.row + pawnDirection
    const attackCol = square.col + dc
    if (isValidSquare(attackRow, attackCol)) {
      const piece = board[attackRow][attackCol]
      if (piece && piece.type === "pawn" && piece.color === byColor) {
        return true
      }
    }
  }

  // Check for knight attacks
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
    const attackRow = square.row + dr
    const attackCol = square.col + dc
    if (isValidSquare(attackRow, attackCol)) {
      const piece = board[attackRow][attackCol]
      if (piece && piece.type === "knight" && piece.color === byColor) {
        return true
      }
    }
  }

  // Check for king attacks
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
    const attackRow = square.row + dr
    const attackCol = square.col + dc
    if (isValidSquare(attackRow, attackCol)) {
      const piece = board[attackRow][attackCol]
      if (piece && piece.type === "king" && piece.color === byColor) {
        return true
      }
    }
  }

  // Check for rook/queen attacks (horizontal and vertical)
  const rookDirections = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]
  for (const [dr, dc] of rookDirections) {
    for (let i = 1; i < 8; i++) {
      const attackRow = square.row + dr * i
      const attackCol = square.col + dc * i
      if (!isValidSquare(attackRow, attackCol)) break

      const piece = board[attackRow][attackCol]
      if (piece) {
        if ((piece.type === "rook" || piece.type === "queen") && piece.color === byColor) {
          return true
        }
        break
      }
    }
  }

  // Check for bishop/queen attacks (diagonal)
  const bishopDirections = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ]
  for (const [dr, dc] of bishopDirections) {
    for (let i = 1; i < 8; i++) {
      const attackRow = square.row + dr * i
      const attackCol = square.col + dc * i
      if (!isValidSquare(attackRow, attackCol)) break

      const piece = board[attackRow][attackCol]
      if (piece) {
        if ((piece.type === "bishop" || piece.type === "queen") && piece.color === byColor) {
          return true
        }
        break
      }
    }
  }

  return false
}

// Check if the king has any legal moves
function hasKingLegalMoves(board: Board, kingPos: Square, kingColor: "white" | "black"): boolean {
  const opponentColor = kingColor === "white" ? "black" : "white"
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
    const newRow = kingPos.row + dr
    const newCol = kingPos.col + dc

    if (isValidSquare(newRow, newCol)) {
      const piece = board[newRow][newCol]

      // The square is empty or has an opponent's piece
      if (!piece || piece.color !== kingColor) {
        // Create a test board with the king moved
        const testBoard = board.map((row) => [...row])
        testBoard[kingPos.row][kingPos.col] = null
        testBoard[newRow][newCol] = { type: "king", color: kingColor }

        // Check if the king would be under attack in the new position
        if (!isSquareUnderAttack(testBoard, { row: newRow, col: newCol }, opponentColor)) {
          return true
        }
      }
    }
  }

  return false
}

// Check if a square is valid
function isValidSquare(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

// Get the value of a piece
function getPieceValue(piece: Piece): number {
  const values: Record<string, number> = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 100,
  }
  return values[piece.type] || 0
}

// Validate if the trade is the best possible
export function validateBestTrade(from: Square, to: Square, board: Board, movingPiece: Piece): boolean {
  // Check if there's a piece at the destination
  const capturedPiece = board[to.row][to.col]
  if (!capturedPiece) return false

  // Calculate the value of the trade
  const movingValue = getPieceValue(movingPiece)
  const capturedValue = getPieceValue(capturedPiece)

  // The trade is good if we capture a more valuable piece
  const isGoodTrade = capturedValue > movingValue

  // Check if there are better trades available
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === movingPiece.color) {
        // Get all possible moves for this piece
        const moves = getPossibleMoves(piece, row, col, board)

        for (const move of moves) {
          const targetPiece = board[move.row][move.col]
          if (targetPiece && targetPiece.color !== piece.color) {
            const pieceValue = getPieceValue(piece)
            const targetValue = getPieceValue(targetPiece)

            // If there's a better trade available, this is not the best trade
            if (targetValue - pieceValue > capturedValue - movingValue) {
              return false
            }
          }
        }
      }
    }
  }

  return isGoodTrade
}

// Get possible moves for a piece (simplified)
function getPossibleMoves(piece: Piece, row: number, col: number, board: Board): Square[] {
  const moves: Square[] = []

  switch (piece.type) {
    case "pawn":
      const direction = piece.color === "white" ? -1 : 1

      // Captures
      for (const dc of [-1, 1]) {
        const newRow = row + direction
        const newCol = col + dc
        if (isValidSquare(newRow, newCol)) {
          const target = board[newRow][newCol]
          if (target && target.color !== piece.color) {
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
  }

  return moves
}
