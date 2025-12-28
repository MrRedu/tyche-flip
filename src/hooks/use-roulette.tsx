import { useRef, useState } from 'react'

export function useRoulette(
  initialOptions: string[] = ['Opción 1', 'Opción 2', 'Opción 3'],
) {
  const [options, setOptions] = useState<string[]>(initialOptions)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [lastResults, setLastResults] = useState<string[]>([])
  const [rotation, setRotation] = useState(0)
  const [newOption, setNewOption] = useState('')

  // Guardamos la rotación total acumulada para que nunca gire hacia atrás
  const totalRotationRef = useRef(0)

  const addOption = () => {
    const trimmed = newOption.trim()
    if (trimmed && !options.includes(trimmed)) {
      setOptions((prev) => [...prev, trimmed])
      setNewOption('')
    }
  }

  const removeOption = (optionToRemove: string) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((opt) => opt !== optionToRemove))
      if (result === optionToRemove) setResult(null)
    }
  }

  const spinRoulette = () => {
    if (isSpinning || options.length === 0) return

    setIsSpinning(true)
    setResult(null)

    // 1. Elegimos el índice ganador
    const randomIndex = Math.floor(Math.random() * options.length)

    // 2. Calculamos los grados
    const degreesPerSegment = 360 / options.length

    // El centro del segmento que queremos que quede arriba (en grados)
    const segmentCenter =
      randomIndex * degreesPerSegment + degreesPerSegment / 2

    /**
     * LÓGICA DE ROTACIÓN:
     * Para que el segmento elegido quede en el PUNTERO (arriba, 0°):
     * Debemos rotar la ruleta (360 - segmentCenter).
     */
    const rotationToTarget = 360 - segmentCenter

    // Añadimos 5 vueltas completas (5 * 360) para el efecto visual
    const extraSpins = 1800

    // Calculamos cuánto falta para que la rotación actual llegue al siguiente "punto de destino"
    // Esto evita que la ruleta haga cosas raras si ya estaba rotada.
    const currentRotationMod = totalRotationRef.current % 360
    const distanceToNextTarget =
      (rotationToTarget - currentRotationMod + 360) % 360

    const finalSpinAddition = distanceToNextTarget + extraSpins
    totalRotationRef.current += finalSpinAddition

    setRotation(totalRotationRef.current)

    // 3. Resultado al terminar la transición (4 segundos)
    setTimeout(() => {
      const winner = options[randomIndex]
      setResult(winner)
      setIsSpinning(false)
      setLastResults((prev) => [winner, ...prev].slice(0, 10))
    }, 4000)
  }

  const removeLastResult = () => {
    if (result) {
      if (options.length > 2) {
        const optionToDelete = result

        setResult(null)

        setOptions((prev) => prev.filter((opt) => opt !== optionToDelete))
      } else {
        alert('Deben quedar al menos 2 opciones para que la ruleta funcione.')
      }
    }
  }

  return {
    options,
    isSpinning,
    result,
    lastResults,
    rotation,
    newOption,
    setNewOption,
    setResult,
    addOption,
    removeOption,
    spinRoulette,
    removeLastResult,
  }
}
