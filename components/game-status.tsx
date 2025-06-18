"use client"

import { Card } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import type { GameMode, Language } from "@/app/page"

// Define PlayerSide type
type PlayerSide = "white" | "black"

// Update the interface to include playerSide
interface GameStatusProps {
  status: string
  currentPlayer: "white" | "black"
  gameMode: GameMode
  playerSide: PlayerSide
  language: Language
}

// Update the function signature
export function GameStatus({ status, currentPlayer, gameMode, playerSide, language }: GameStatusProps) {
  const { t } = useTranslation(language)

  return (
    <Card className="p-4 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="text-center">
        <h3 className="text-white font-semibold mb-2">{t("gameStatus")}</h3>
        <p className="text-white/90 text-lg">{status}</p>
        {/* Update the display to show whose turn it is more clearly */}
        <div className="mt-3 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${currentPlayer === "white" ? "bg-white" : "bg-gray-400"}`} />
            <span className="text-white/70 text-sm">
              {t("white")}{" "}
              {playerSide === "white" ? `(${t("you")})` : gameMode === "ai" ? `(${t("ai")})` : `(${t("opponent")})`}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${currentPlayer === "black" ? "bg-gray-800 ring-2 ring-white" : "bg-gray-600"}`}
            />
            <span className="text-white/70 text-sm">
              {t("black")}{" "}
              {playerSide === "black" ? `(${t("you")})` : gameMode === "ai" ? `(${t("ai")})` : `(${t("opponent")})`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
