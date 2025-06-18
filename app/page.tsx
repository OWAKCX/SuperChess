"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { SettingsIcon, UserIcon } from "lucide-react"
import { ChessGame } from "@/components/chess-game"
import { ChessPuzzle } from "@/components/chess-puzzle"
import { Settings } from "@/components/settings"
import { Rules } from "@/components/rules"
import { GameSetup } from "@/components/game-setup"
import { PuzzleMode } from "@/components/puzzle-mode"
import { Auth } from "@/components/auth"
import { UserProfile } from "@/components/user-profile"
import { useTranslation } from "@/hooks/use-translation"

export type Language = "en" | "sr" | "ru"
export type GameMode = "ai" | "local"
export type PieceColor = "red" | "blue" | "green" | "pink" | "yellow" | "orange"
export type AIDifficulty = "easy" | "medium" | "hard" | "expert"

interface User {
  id: string
  username: string
  email: string
  createdAt: string
  gamesPlayed: number
  gamesWon: number
}

interface GameConfig {
  mode: GameMode
  playerSide: "white" | "black"
  whiteColor: PieceColor
  blackColor: PieceColor
  aiDifficulty: AIDifficulty
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en")
  const [currentView, setCurrentView] = useState<
    "menu" | "game" | "puzzle" | "settings" | "rules" | "setup" | "puzzleMode" | "profile"
  >("menu")
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    mode: "ai",
    playerSide: "white",
    whiteColor: "blue",
    blackColor: "red",
    aiDifficulty: "medium",
  })
  const [user, setUser] = useState<User | null>(null)
  const [showProfile, setShowProfile] = useState(false)

  const { t } = useTranslation(language)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("chess_current_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    localStorage.setItem("chess_current_user", JSON.stringify(loggedInUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("chess_current_user")
    setShowProfile(false)
    setCurrentView("menu")
  }

  const updateUserStats = (won: boolean) => {
    if (!user) return

    const updatedUser = {
      ...user,
      gamesPlayed: user.gamesPlayed + 1,
      gamesWon: won ? user.gamesWon + 1 : user.gamesWon,
    }

    setUser(updatedUser)
    localStorage.setItem("chess_current_user", JSON.stringify(updatedUser))

    // Update in users array
    const users = JSON.parse(localStorage.getItem("chess_users") || "[]")
    const userIndex = users.findIndex((u: User) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem("chess_users", JSON.stringify(users))
    }
  }

  // If no user is logged in, show auth
  if (!user) {
    return <Auth onLogin={handleLogin} language={language} />
  }

  // If showing profile
  if (showProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="space-y-4">
          <UserProfile user={user} onLogout={handleLogout} language={language} />
          <Button
            onClick={() => setShowProfile(false)}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            {t("back")}
          </Button>
        </div>
      </div>
    )
  }

  if (currentView === "game") {
    return (
      <ChessGame
        gameMode={gameConfig.mode}
        playerColors={{ white: gameConfig.whiteColor, black: gameConfig.blackColor }}
        playerSide={gameConfig.playerSide}
        aiLevel={gameConfig.aiDifficulty}
        language={language}
        onBackToMenu={() => setCurrentView("menu")}
      />
    )
  }

  if (currentView === "puzzle") {
    return <ChessPuzzle language={language} onBack={() => setCurrentView("puzzleMode")} />
  }

  if (currentView === "settings") {
    return <Settings language={language} onLanguageChange={setLanguage} onBack={() => setCurrentView("menu")} />
  }

  if (currentView === "rules") {
    return <Rules language={language} onBack={() => setCurrentView("menu")} />
  }

  if (currentView === "setup") {
    return (
      <GameSetup
        language={language}
        onGameSetup={(settings) => {
          setGameConfig({
            mode: settings.mode,
            playerSide: settings.playerSide,
            whiteColor: settings.colors.white,
            blackColor: settings.colors.black,
            aiDifficulty: settings.aiLevel,
          })
          setCurrentView("game")
        }}
        onBack={() => setCurrentView("menu")}
      />
    )
  }

  if (currentView === "puzzleMode") {
    return (
      <PuzzleMode
        language={language}
        playerColors={{ white: gameConfig.whiteColor, black: gameConfig.blackColor }}
        onBack={() => setCurrentView("menu")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                ♔ {t("chess")}
              </h1>
              <Button
                onClick={() => setShowProfile(true)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <UserIcon className="w-5 h-5 mr-2" />
                {user.username}
              </Button>
            </div>
            <p className="text-gray-300 mb-8">{t("welcomeMessage")}</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setCurrentView("setup")}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
            >
              {t("newGame")}
            </Button>

            <Button
              onClick={() => setCurrentView("puzzleMode")}
              variant="outline"
              className="w-full h-12 border-white/20 text-white hover:bg-white/10"
            >
              {t("puzzleMode")}
            </Button>

            <div className="flex gap-4">
              <Button
                onClick={() => setCurrentView("rules")}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {t("rules")}
              </Button>
              <Button
                onClick={() => setCurrentView("settings")}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                {t("settings")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
