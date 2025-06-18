"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft, Crown, Zap } from "lucide-react"
import type { Language } from "@/app/page"

interface RulesProps {
  language: Language
  onBack: () => void
}

export function Rules({ language, onBack }: RulesProps) {
  const { t } = useTranslation(language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <h1 className="text-3xl font-bold text-white">{t("chessRules")}</h1>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Crown className="w-6 h-6 mr-2" />
              {t("objective")}
            </h2>
            <p className="text-white/90">{t("objectiveText")}</p>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">{t("pieceMovement")}</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">♔ {t("king")}</h3>
                  <p className="text-white/80 text-sm">{t("kingMovement")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">♕ {t("queen")}</h3>
                  <p className="text-white/80 text-sm">{t("queenMovement")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">♖ {t("rook")}</h3>
                  <p className="text-white/80 text-sm">{t("rookMovement")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">♗ {t("bishop")}</h3>
                  <p className="text-white/80 text-sm">{t("bishopMovement")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">♘ {t("knight")}</h3>
                  <p className="text-white/80 text-sm">{t("knightMovement")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">♙ {t("pawn")}</h3>
                  <p className="text-white/80 text-sm">{t("pawnMovement")}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              {t("specialMoves")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">{t("castling")}</h3>
                <p className="text-white/80 text-sm">{t("castlingText")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">{t("enPassant")}</h3>
                <p className="text-white/80 text-sm">{t("enPassantText")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">{t("pawnPromotion")}</h3>
                <p className="text-white/80 text-sm">{t("pawnPromotionText")}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">{t("gameEnd")}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">{t("check")}</h3>
                <p className="text-white/80 text-sm">{t("checkText")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">{t("checkmate")}</h3>
                <p className="text-white/80 text-sm">{t("checkmateText")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">{t("stalemate")}</h3>
                <p className="text-white/80 text-sm">{t("stalemateText")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">{t("draw")}</h3>
                <p className="text-white/80 text-sm">{t("drawText")}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
