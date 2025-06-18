"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Target, Calendar, LogOut, User } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface UserType {
  id: string
  username: string
  email: string
  createdAt: string
  gamesPlayed: number
  gamesWon: number
}

interface UserProfileProps {
  user: UserType
  onLogout: () => void
  language: "en" | "sr" | "ru"
}

export function UserProfile({ user, onLogout, language }: UserProfileProps) {
  const { t } = useTranslation(language)

  const winRate = user.gamesPlayed > 0 ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0
  const memberSince = new Date(user.createdAt).toLocaleDateString()

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-white">{user.username}</CardTitle>
        <p className="text-gray-300 text-sm">{user.email}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{user.gamesPlayed}</p>
            <p className="text-gray-300 text-sm">{t("gamesPlayed")}</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{user.gamesWon}</p>
            <p className="text-gray-300 text-sm">{t("gamesWon")}</p>
          </div>
        </div>

        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-3xl font-bold text-green-400">{winRate}%</p>
          <p className="text-gray-300 text-sm">{t("winRate")}</p>
        </div>

        <div className="flex items-center justify-center text-gray-300 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          {t("memberSince")}: {memberSince}
        </div>

        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full bg-transparent border-2 border-red-400 text-red-400 hover:bg-red-400/10 hover:border-red-500"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t("logout")}
        </Button>
      </CardContent>
    </Card>
  )
}
