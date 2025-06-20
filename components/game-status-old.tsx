"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, Target, Zap, Brain, Star } from "lucide-react"
import type { Language, AIDifficulty, GameMode } from "@/app/page"
import { useTranslation } from "@/hooks/use-translation"

interface GameStatusProps {
  currentPlayer: "white" | "black"
  gameStatus: string
  moveHistory: any[]
  language: Language
  aiThinking?: boolean
  gameMode: GameMode
  playerSide: "white" | "black"
  aiLevel: AIDifficulty
}

export function GameStatus({
  currentPlayer,
  gameStatus,
  moveHistory,
  language,
  aiThinking = false,
  gameMode,
  playerSide,
  aiLevel
}: GameStatusProps) {
  const { t } = useTranslation(language)
  const [gameTime, setGameTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getAILevelIcon = () => {
    switch (aiLevel) {
      case 'easy': return <Target className="w-4 h-4" />
      case 'medium': return <Zap className="w-4 h-4" />
      case 'hard': return <Brain className="w-4 h-4" />
      case 'expert': return <Star className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const getAILevelColor = () => {
    switch (aiLevel) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-orange-500'
      case 'expert': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusMessage = () => {
    if (gameStatus === 'checkmate') {
      return currentPlayer === 'white' ? t('blackWins') : t('whiteWins')
    }
    if (gameStatus === 'stalemate') return t('stalemate')
    if (gameStatus === 'draw') return t('draw')
    if (gameStatus === 'check') return t('check')
    if (aiThinking) return t('aiThinking')
    return currentPlayer === 'white' ? t('whiteToMove') : t('blackToMove')
  }

  const isGameOver = ['checkmate', 'stalemate', 'draw'].includes(gameStatus)

  return (
    <div className="space-y-4">
      {/* Game Status Card */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{t('gameStatus')}</h3>
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(gameTime)}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Current Turn */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{t('currentTurn')}:</span>
              <Badge 
                variant={currentPlayer === 'white' ? 'default' : 'secondary'}
                className={`${currentPlayer === 'white' ? 'bg-blue-500' : 'bg-red-500'} text-white`}
              >
                {currentPlayer === 'white' ? t('white') : t('black')} 
                {currentPlayer === playerSide && ' (You)'}
              </Badge>
            </div>

            {/* Game Mode */}
            {gameMode === 'ai' && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">{t('opponent')}:</span>
                <Badge className={`${getAILevelColor()} text-white flex items-center space-x-1`}>
                  {getAILevelIcon()}
                  <span>{t('ai')} ({t(aiLevel)})</span>
                </Badge>
              </div>
            )}

            {/* Status Message */}
            <div className="text-center py-3">
              <div className={`text-lg font-semibold ${
                isGameOver ? 'text-yellow-400' : 
                aiThinking ? 'text-blue-400 animate-pulse' : 
                'text-white'
              }`}>
                {getStatusMessage()}
              </div>
              {gameStatus === 'check' && (
                <div className="text-red-400 text-sm mt-1 animate-pulse">
                  ⚠️ {t('kingInCheck')}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Move History */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{t('moveHistory')}</h3>
            <Badge variant="outline" className="border-white/20 text-white">
              {Math.ceil(moveHistory.length / 2)} {t('moves')}
            </Badge>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-1">
            {moveHistory.length === 0 ? (
              <div className="text-gray-400 text-center py-4">
                {t('noMovesYet')}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, i) => (
                  <div key={i} className="flex space-x-2 text-white">
                    <span className="text-gray-400 w-6">{i + 1}.</span>
                    <span className="flex-1">{moveHistory[i * 2]?.san || ''}</span>
                    <span className="flex-1">{moveHistory[i * 2 + 1]?.san || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game Over Message */}
      {isGameOver && (
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-yellow-400 mb-2">
              {t('gameOver')}
            </h3>
            <p className="text-white">
              {getStatusMessage()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

