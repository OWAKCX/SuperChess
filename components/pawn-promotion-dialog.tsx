"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChessPiece } from "@/components/chess-piece"
import { useTranslation } from "@/hooks/use-translation"
import type { PieceColor } from "@/types/chess"
import type { PieceColors, Language } from "@/app/page"

type PromotionPiece = "queen" | "rook" | "bishop" | "knight"

interface PawnPromotionDialogProps {
  color: PieceColor
  playerColors: PieceColors
  language: Language
  onPromotion: (piece: PromotionPiece) => void
}

const promotionPieces: PromotionPiece[] = ["queen", "rook", "bishop", "knight"]

export function PawnPromotionDialog({ color, playerColors, language, onPromotion }: PawnPromotionDialogProps) {
  const { t } = useTranslation(language)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{t("pawnPromotion")}</h2>
            <p className="text-white/80">{t("choosePiece")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {promotionPieces.map((pieceType) => (
              <Button
                key={pieceType}
                onClick={() => onPromotion(pieceType)}
                className="h-20 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 flex flex-col items-center justify-center space-y-2"
              >
                <ChessPiece type={pieceType} color={color} playerColors={playerColors} />
                <span className="text-sm font-medium">{t(pieceType)}</span>
              </Button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-white/60 text-sm">{t("promotionHint")}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
