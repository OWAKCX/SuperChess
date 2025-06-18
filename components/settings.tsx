"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft, Globe } from "lucide-react"
import type { Language } from "@/app/page"

interface SettingsProps {
  language: Language
  onLanguageChange: (language: Language) => void
  onBack: () => void
}

const languages: { value: Language; name: string; flag: string }[] = [
  { value: "en", name: "English", flag: "🇺🇸" },
  { value: "sr", name: "Српски", flag: "🇷🇸" },
  { value: "ru", name: "Русский", flag: "🇷🇺" },
]

export function Settings({ language, onLanguageChange, onBack }: SettingsProps) {
  const { t } = useTranslation(language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button onClick={onBack} className="text-white hover:bg-white/10 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Button>
            <h2 className="text-2xl font-bold text-white">{t("settings")}</h2>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              {t("language")}
            </h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <Button
                  key={lang.value}
                  onClick={() => onLanguageChange(lang.value)}
                  className={`w-full justify-start h-12 bg-transparent border-2 ${
                    language === lang.value
                      ? "border-blue-400 text-blue-400 bg-blue-400/10"
                      : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  }`}
                >
                  <span className="mr-3 text-lg">{lang.flag}</span>
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
