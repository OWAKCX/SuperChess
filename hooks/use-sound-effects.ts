"use client"

import { useCallback, useRef, useState } from "react"

type SoundType = "move" | "capture" | "check" | "checkmate" | "gameStart" | "invalidMove" | "enPassant" | "select"

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.1) => {
      if (!soundEnabled) return

      try {
        const audioContext = getAudioContext()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        oscillator.type = type

        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      } catch (error) {
        console.warn("Could not play sound:", error)
      }
    },
    [soundEnabled, getAudioContext],
  )

  const playChord = useCallback(
    (frequencies: number[], duration: number, type: OscillatorType = "sine", volume = 0.05) => {
      if (!soundEnabled) return

      frequencies.forEach((freq) => {
        playTone(freq, duration, type, volume)
      })
    },
    [soundEnabled, playTone],
  )

  const playSound = useCallback(
    (soundType: SoundType) => {
      if (!soundEnabled) return

      switch (soundType) {
        case "move":
          // Simple click sound
          playTone(800, 0.1, "square", 0.08)
          break

        case "capture":
          // Lower pitched thud
          playTone(300, 0.15, "sawtooth", 0.12)
          setTimeout(() => playTone(200, 0.1, "triangle", 0.08), 50)
          break

        case "check":
          // Alert sound - ascending tones
          playTone(600, 0.1, "sine", 0.1)
          setTimeout(() => playTone(800, 0.1, "sine", 0.1), 100)
          setTimeout(() => playTone(1000, 0.15, "sine", 0.12), 200)
          break

        case "checkmate":
          // Victory/defeat fanfare
          const checkmateChord = [523, 659, 784, 1047] // C major chord
          playChord(checkmateChord, 0.8, "triangle", 0.06)
          setTimeout(() => playChord([392, 494, 587, 784], 0.6, "triangle", 0.05), 400) // G major
          setTimeout(() => playChord([523, 659, 784, 1047], 1.0, "triangle", 0.07), 800) // C major
          break

        case "gameStart":
          // Welcoming ascending arpeggio
          const startNotes = [262, 330, 392, 523] // C major arpeggio
          startNotes.forEach((freq, index) => {
            setTimeout(() => playTone(freq, 0.3, "triangle", 0.08), index * 150)
          })
          break

        case "invalidMove":
          // Error buzz
          playTone(150, 0.2, "sawtooth", 0.1)
          setTimeout(() => playTone(120, 0.15, "sawtooth", 0.08), 100)
          break

        case "enPassant":
          // Special capture sound - two quick tones
          playTone(600, 0.08, "sine", 0.1)
          setTimeout(() => playTone(400, 0.12, "triangle", 0.09), 80)
          break

        case "select":
          // Soft selection sound
          playTone(1200, 0.05, "sine", 0.06)
          break

        default:
          break
      }
    },
    [soundEnabled, playTone, playChord],
  )

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev)
  }, [])

  return {
    playSound,
    soundEnabled,
    toggleSound,
  }
}
