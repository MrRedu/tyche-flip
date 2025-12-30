import { useCallback, useMemo, useState } from 'react'

export type DiceResult = Array<number>

export function useDiceRoll(initialDice = 1) {
  const [numDice, setNumDice] = useState(initialDice)
  const [results, setResults] = useState<DiceResult>([1])
  const [history, setHistory] = useState<Array<DiceResult>>([])
  const [isRolling, setIsRolling] = useState(false)

  // Calculamos el total de forma eficiente
  const total = useMemo(() => results.reduce((a, b) => a + b, 0), [results])

  const rollDice = useCallback(() => {
    if (isRolling) return

    setIsRolling(true)

    // Simulamos el retraso del lanzamiento (animación)
    setTimeout(() => {
      const newResults = Array.from(
        { length: numDice },
        () => Math.floor(Math.random() * 6) + 1,
      )
      setResults(newResults)
      setHistory((prev) => [newResults, ...prev].slice(0, 10))
      setIsRolling(false)
    }, 600)
  }, [numDice, isRolling])

  return {
    numDice,
    setNumDice,
    results,
    total,
    history,
    isRolling,
    rollDice,
  }
}
