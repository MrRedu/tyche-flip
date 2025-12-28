import { useState } from 'react'

export type CoinSide = 'heads' | 'tails' | null

export const useFlipCoin = () => {
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<CoinSide>(null)
  const [selectedSide, setSelectedSide] = useState<CoinSide>(null)
  const [stats, setStats] = useState({ heads: 0, tails: 0 })

  const flipCoin = () => {
    if (isFlipping || !selectedSide) return

    setIsFlipping(true)
    setResult(null)

    setTimeout(() => {
      const newResult: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails'
      setResult(newResult)
      setIsFlipping(false)

      setStats((prev) => ({
        ...prev,
        [newResult]: prev[newResult] + 1,
      }))
    }, 2000)
  }

  const isWin = result === selectedSide

  const resultText =
    !result || !selectedSide ? '' : isWin ? '¡Ganaste! 🎉' : 'Perdiste 😢'

  const resultColor =
    !result || !selectedSide ? '' : isWin ? 'text-primary' : 'text-destructive'

  return {
    isFlipping,
    result,
    selectedSide,
    stats,
    setSelectedSide,
    flipCoin,
    resultText,
    resultColor,
  }
}
