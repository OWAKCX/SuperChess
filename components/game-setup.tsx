"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft, User, Bot, Brain, Target, Crown } from "lucide-react"
import type { PieceColor, PieceColors, GameMode, Language, PlayerSide, GameSettings, AILevel } from "@/app/page"

interface GameSetupProps {
  language: Language
  onGameSetup: (settings: GameSettings) => void
  onBack: () => void
}

// Update the colors array to include black and white options
const colors: { value: PieceColor; name: string; class: string }[] = [
  { value: "red", name: "Red", class: "bg-red-500" },
  { value: "blue", name: "Blue", class: "bg-blue-500" },
  { value: "green", name: "Green", class: "bg-green-500" },
  { value: "pink", name: "Pink", class: "bg-pink-500" },
  { value: "yellow", name: "Yellow", class: "bg-yellow-500" },
  { value: "orange", name: "Orange", class: "bg-orange-500" },
  { value: "black", name: "Black", class: "bg-gray-900" },
  { value: "white", name: "White", class: "bg-gray-100" },
]

const aiLevels: { value: AILevel; name: string; icon: any; description: string }[] = [
  { value: "easy", name: "Easy", icon: User, description: "Beginner friendly" },
  { value: "medium", name: "Medium", icon: Brain, description: "Balanced challenge" },
  { value: "hard", name: "Hard", icon: Target, description: "Advanced player" },
  { value: "expert", name: "Expert", icon: Crown, description: "Master level" },
]

export function GameSetup({ language, onGameSetup, onBack }: GameSetupProps) {
  const { t } = useTranslation(language)
  const [selectedMode, setSelectedMode] = useState<GameMode>("ai")
  const [selectedColors, setSelectedColors] = useState<PieceColors>({ white: "blue", black: "red" })
  const [selectedPlayerSide, setSelectedPlayerSide] = useState<PlayerSide>("white")
  const [selectedAILevel, setSelectedAILevel] = useState<AILevel>("medium")

  const handleStart = () => {
    onGameSetup({
      mode: selectedMode,
      colors: selectedColors,
      playerSide: selectedPlayerSide,
      aiLevel: selectedAILevel,
    })
  }

  const updateWhiteColor = (color: PieceColor) => {
    setSelectedColors((prev) => ({ ...prev, white: color }))
  }

  const updateBlackColor = (color: PieceColor) => {
    setSelectedColors((prev) => ({ ...prev, black: color }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button onClick={onBack} className="text-white hover:bg-white/10 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Button>
            <h2 className="text-2xl font-bold text-white">{t("gameSetup")}</h2>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">{t("selectGameMode")}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setSelectedMode("ai")}
                className={`h-16 flex-col bg-transparent border-2 ${
                  selectedMode === "ai"
                    ? "border-blue-400 text-blue-400 bg-blue-400/10"
                    : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                }`}
              >
                <Bot className="w-6 h-6 mb-1" />
                {t("vsAI")}
              </Button>
              <Button
                onClick={() => setSelectedMode("local")}
                className={`h-16 flex-col bg-transparent border-2 ${
                  selectedMode === "local"
                    ? "border-blue-400 text-blue-400 bg-blue-400/10"
                    : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                }`}
              >
                <User className="w-6 h-6 mb-1" />
                {t("local")}
              </Button>
            </div>
          </div>

          {/* AI Difficulty Selection - only show when AI mode is selected */}
          {selectedMode === "ai" && (
            <div>
              <h3 className="text-white font-semibold mb-3">{t("selectAIDifficulty")}</h3>
              <div className="grid grid-cols-2 gap-3">
                {aiLevels.map((level) => {
                  const IconComponent = level.icon
                  return (
                    <Button
                      key={level.value}
                      onClick={() => setSelectedAILevel(level.value)}
                      className={`h-20 flex-col bg-transparent border-2 ${
                        selectedAILevel === level.value
                          ? "border-purple-400 text-purple-400 bg-purple-400/10"
                          : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mb-1" />
                      <span className="text-sm font-medium">{t(level.value)}</span>
                      <span className="text-xs opacity-70">{t(level.value + "Description")}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-white font-semibold mb-3">{t("selectWhitePieceColor")}</h3>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <Button
                  key={`white-${color.value}`}
                  onClick={() => updateWhiteColor(color.value)}
                  className={`h-16 bg-transparent border-2 ${
                    selectedColors.white === color.value
                      ? "border-white ring-2 ring-blue-400 bg-white/10"
                      : "border-white/30"
                  } hover:bg-white/10 hover:border-white/50`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full ${color.class} mb-1`} />
                    <span className="text-white text-sm">{t(color.value)}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">{t("selectBlackPieceColor")}</h3>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <Button
                  key={`black-${color.value}`}
                  onClick={() => updateBlackColor(color.value)}
                  className={`h-16 bg-transparent border-2 ${
                    selectedColors.black === color.value
                      ? "border-white ring-2 ring-blue-400 bg-white/10"
                      : "border-white/30"
                  } hover:bg-white/10 hover:border-white/50`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full ${color.class} mb-1`} />
                    <span className="text-white text-sm">{t(color.value)}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">{t("selectPlayerSide")}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setSelectedPlayerSide("white")}
                className={`h-16 flex-col bg-transparent border-2 ${
                  selectedPlayerSide === "white"
                    ? "border-blue-400 text-blue-400 bg-blue-400/10"
                    : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                }`}
              >
                <span className="text-2xl mb-1">♔</span>
                {t("playAsWhite")}
              </Button>
              <Button
                onClick={() => setSelectedPlayerSide("black")}
                className={`h-16 flex-col bg-transparent border-2 ${
                  selectedPlayerSide === "black"
                    ? "border-blue-400 text-blue-400 bg-blue-400/10"
                    : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                }`}
              >
                <span className="text-2xl mb-1">♚</span>
                {t("playAsBlack")}
              </Button>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">{t("gamePreview")}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-8">
                <div
                  className={`text-center ${selectedPlayerSide === "white" ? "ring-2 ring-blue-400 rounded-lg p-2" : ""}`}
                >
                  <div
                    className={`text-3xl mb-1 ${colors.find((c) => c.value === selectedColors.white)?.class.replace("bg-", "text-")}`}
                  >
                    ♔
                  </div>
                  <span className="text-white/70 text-sm">
                    {t("white")}{" "}
                    {selectedPlayerSide === "white"
                      ? `(${t("you")})`
                      : selectedMode === "ai"
                        ? `(${t("ai")})`
                        : `(${t("opponent")})`}
                  </span>
                </div>
                <div
                  className={`text-center ${selectedPlayerSide === "black" ? "ring-2 ring-blue-400 rounded-lg p-2" : ""}`}
                >
                  <div
                    className={`text-3xl mb-1 ${colors.find((c) => c.value === selectedColors.black)?.class.replace("bg-", "text-")}`}
                  >
                    ♚
                  </div>
                  <span className="text-white/70 text-sm">
                    {t("black")}{" "}
                    {selectedPlayerSide === "black"
                      ? `(${t("you")})`
                      : selectedMode === "ai"
                        ? `(${t("ai")})`
                        : `(${t("opponent")})`}
                  </span>
                </div>
              </div>

              {/* AI Difficulty Preview */}
              {selectedMode === "ai" && (
                <div className="text-center pt-2 border-t border-white/10">
                  <div className="flex items-center justify-center space-x-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span className="text-white/70 text-sm">
                      {t("aiDifficulty")}: <span className="text-purple-400 font-medium">{t(selectedAILevel)}</span>
                    </span>
                  </div>
                  <span className="text-white/50 text-xs">{t(selectedAILevel + "Description")}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleStart}
            className="w-full h-12 text-lg bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400/10 hover:border-green-500"
          >
            {t("startGame")}
          </Button>
        </div>
      </Card>
    </div>
  )
}
