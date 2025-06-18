"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, UserIcon, Mail, Lock } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface UserType {
  id: string
  username: string
  email: string
  createdAt: string
  gamesPlayed: number
  gamesWon: number
}

interface AuthProps {
  onLogin: (user: UserType) => void
  language: "en" | "sr" | "ru"
}

export function Auth({ onLogin, language }: AuthProps) {
  const { t } = useTranslation(language)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!isLogin && !formData.username.trim()) {
      newErrors.username = t("usernameRequired")
    } else if (!isLogin && formData.username.length < 3) {
      newErrors.username = t("usernameTooShort")
    }

    if (!formData.email.trim()) {
      newErrors.email = t("emailRequired")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("emailInvalid")
    }

    if (!formData.password) {
      newErrors.password = t("passwordRequired")
    } else if (formData.password.length < 6) {
      newErrors.password = t("passwordTooShort")
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwordsNotMatch")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (isLogin) {
        // Login logic
        const users = JSON.parse(localStorage.getItem("chess_users") || "[]")
        const user = users.find((u: UserType) => u.email === formData.email)

        if (!user) {
          setErrors({ email: t("userNotFound") })
          return
        }

        // In a real app, you'd verify the password hash
        onLogin(user)
      } else {
        // Sign up logic
        const users = JSON.parse(localStorage.getItem("chess_users") || "[]")

        // Check if user already exists
        if (users.some((u: UserType) => u.email === formData.email)) {
          setErrors({ email: t("emailExists") })
          return
        }

        if (users.some((u: UserType) => u.username === formData.username)) {
          setErrors({ username: t("usernameExists") })
          return
        }

        const newUser: UserType = {
          id: Date.now().toString(),
          username: formData.username,
          email: formData.email,
          createdAt: new Date().toISOString(),
          gamesPlayed: 0,
          gamesWon: 0,
        }

        users.push(newUser)
        localStorage.setItem("chess_users", JSON.stringify(users))
        onLogin(newUser)
      }
    } catch (error) {
      setErrors({ general: t("authError") })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">{isLogin ? t("login") : t("signUp")}</CardTitle>
          <CardDescription className="text-gray-300">{isLogin ? t("welcomeBack") : t("createAccount")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  {t("username")}
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("enterUsername")}
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                {errors.username && <p className="text-red-400 text-sm">{errors.username}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                {t("email")}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("enterEmail")}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                {t("password")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("enterPassword")}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  {t("confirmPassword")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("confirmPassword")}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
              </div>
            )}

            {errors.general && <p className="text-red-400 text-sm text-center">{errors.general}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400/10 hover:border-purple-500"
            >
              {loading ? t("loading") : isLogin ? t("login") : t("signUp")}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-300 hover:text-purple-200 text-sm bg-transparent hover:bg-purple-400/10 px-3 py-1 rounded"
              >
                {isLogin ? t("needAccount") : t("haveAccount")}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
