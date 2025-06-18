export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn"
export type PieceColor = "white" | "black"
export type GameStatus = "playing" | "check" | "checkmate" | "stalemate" | "draw"

export interface Piece {
  type: PieceType
  color: PieceColor
}

export interface Square {
  row: number
  col: number
}

export type Board = (Piece | null)[][]
