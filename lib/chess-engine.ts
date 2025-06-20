import { Chess } from 'chess.js'

export class ChessEngine {
  private chess: Chess
  private stockfish: Worker | null = null

  constructor() {
    this.chess = new Chess()
    this.initStockfish()
  }

  private async initStockfish() {
    try {
      // Initialize Stockfish worker
      if (typeof Worker !== 'undefined') {
        // For now, we'll implement a simple AI without Stockfish
        // Stockfish integration can be added later with proper worker setup
        console.log('Chess engine initialized without Stockfish')
      }
    } catch (error) {
      console.error('Failed to initialize Stockfish:', error)
    }
  }

  // Get current game state
  getGameState() {
    return {
      board: this.chess.board(),
      turn: this.chess.turn(),
      isGameOver: this.chess.isGameOver(),
      isCheck: this.chess.isCheck(),
      isCheckmate: this.chess.isCheckmate(),
      isStalemate: this.chess.isStalemate(),
      isDraw: this.chess.isDraw(),
      fen: this.chess.fen(),
      pgn: this.chess.pgn(),
      history: this.chess.history({ verbose: true })
    }
  }

  // Make a move
  makeMove(from: string, to: string, promotion?: string) {
    try {
      const move = this.chess.move({
        from,
        to,
        promotion: promotion as any
      })
      return move
    } catch (error) {
      console.error('Invalid move:', error)
      return null
    }
  }

  // Get valid moves for a square
  getValidMoves(square: string) {
    return this.chess.moves({ square, verbose: true })
  }

  // Get all valid moves
  getAllValidMoves() {
    return this.chess.moves({ verbose: true })
  }

  // Undo last move
  undoMove() {
    return this.chess.undo()
  }

  // Reset game
  reset() {
    this.chess.reset()
  }

  // Load position from FEN
  loadFen(fen: string) {
    try {
      this.chess.load(fen)
      return true
    } catch (error) {
      console.error('Invalid FEN:', error)
      return false
    }
  }

  // Simple AI move (random for now, can be improved)
  getAIMove(difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium') {
    const moves = this.getAllValidMoves()
    if (moves.length === 0) return null

    // Simple random move for now
    // In a real implementation, this would use Stockfish or other AI logic
    const randomIndex = Math.floor(Math.random() * moves.length)
    return moves[randomIndex]
  }

  // Check if square is under attack
  isSquareAttacked(square: string, color: 'w' | 'b') {
    return this.chess.isAttacked(square, color)
  }

  // Get piece at square
  getPiece(square: string) {
    return this.chess.get(square)
  }

  // Validate move without making it
  validateMove(from: string, to: string, promotion?: string) {
    try {
      const moves = this.chess.moves({ square: from, verbose: true })
      return moves.some(move => 
        move.to === to && 
        (!promotion || move.promotion === promotion)
      )
    } catch (error) {
      return false
    }
  }
}

