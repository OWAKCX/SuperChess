"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft, Edit3, RefreshCw } from "lucide-react"
import { BoardEditor } from "@/components/board-editor"
import { ChessPuzzle } from "@/components/chess-puzzle"
import type { Language, PieceColors, PuzzleType } from "@/app/page"
import type { Board } from "@/types/chess"

interface PuzzleModeProps {
  language: Language
  playerColors: PieceColors
  onBack: () => void
}

export function PuzzleMode({ language, playerColors, onBack }: PuzzleModeProps) {
  const { t } = useTranslation(language)
  const [activeTab, setActiveTab] = useState<PuzzleType>("custom")
  const [puzzleBoard, setPuzzleBoard] = useState<Board | null>(null)
  const [customBoard, setCustomBoard] = useState<Board | null>(null)
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  const [puzzleAttempted, setPuzzleAttempted] = useState(false)

  const handleGeneratePuzzle = () => {
    setPuzzleSolved(false)
    setPuzzleAttempted(false)
  }

  const handlePuzzleSolved = () => {
    setPuzzleSolved(true)
    setPuzzleAttempted(true)
  }

  const handlePuzzleFailed = () => {
    setPuzzleSolved(false)
    setPuzzleAttempted(true)
  }

  const handleUseCustomBoard = () => {
    if (customBoard) {
      setPuzzleBoard(customBoard)
      setActiveTab("custom")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToMenu")}
          </Button>
          <h1 className="text-3xl font-bold text-white">{t("puzzleMode")}</h1>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PuzzleType)} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="bg-white/10 border border-white/20">
              <TabsTrigger value="custom" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Edit3 className="w-4 h-4 mr-2" />
                {t("customPuzzle")}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <TabsContent value="custom" className="mt-0">
                <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">{t("customPuzzle")}</h2>
                    <p className="text-white/80">{t("customPuzzleDescription")}</p>

                    <div className="flex flex-col space-y-3">
                      <h3 className="text-white font-medium">{t("boardEditor")}</h3>
                      <BoardEditor onBoardChange={setCustomBoard} playerColors={playerColors} />
                      <Button
                        onClick={handleUseCustomBoard}
                        disabled={!customBoard}
                        className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400/10 disabled:opacity-50"
                      >
                        {t("useThisBoard")}
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </div>

            <div>
              {puzzleBoard && (
                <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
                  <ChessPuzzle
                    board={puzzleBoard}
                    playerColors={playerColors}
                    puzzleType={activeTab}
                    onPuzzleSolved={handlePuzzleSolved}
                    onPuzzleFailed={handlePuzzleFailed}
                  />
                </Card>
              )}

              {!puzzleBoard && (
                <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 flex items-center justify-center min-h-[400px]">
                  <div className="text-center text-white/60">
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">{t("generatePuzzlePrompt")}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
