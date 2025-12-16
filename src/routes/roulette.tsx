import { useState } from 'react'

import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/roulette')({
  component: RoulettePage,
})

function RoulettePage() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [options, setOptions] = useState<Array<string>>([
    'Opción 1',
    'Opción 2',
    'Opción 3',
  ])
  const [newOption, setNewOption] = useState('')
  const [lastResults, setLastResults] = useState<Array<string>>([])
  const [rotation, setRotation] = useState(0)

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions((prev) => [...prev, newOption.trim()])
      setNewOption('')
    }
  }

  const removeOption = (optionToRemove: string) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((opt) => opt !== optionToRemove))
    }
  }

  const spinRoulette = () => {
    if (isSpinning || options.length === 0) return

    setIsSpinning(true)
    setResult(null)

    const randomIndex = Math.floor(Math.random() * options.length)
    const degreesPerSegment = 360 / options.length
    const targetDegree = randomIndex * degreesPerSegment + degreesPerSegment / 2
    const spins = 5 * 360
    const finalRotation = spins + targetDegree

    setRotation(finalRotation)

    setTimeout(() => {
      const newResult = options[randomIndex]
      setResult(newResult)
      setIsSpinning(false)
      setLastResults((prev) => [newResult, ...prev].slice(0, 10))
    }, 4000)
  }

  const removeLastResult = () => {
    if (result && options.length > 2) {
      removeOption(result)
      setResult(null)
    }
  }

  const getSegmentColor = (index: number) => {
    const colors = [
      '#ef4444', // red
      '#3b82f6', // blue
      '#22c55e', // green
      '#eab308', // yellow
      '#a855f7', // purple
      '#ec4899', // pink
      '#f97316', // orange
      '#14b8a6', // teal
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="max-w-4xl w-full space-y-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>

        <Card className="bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-4xl text-center text-balance">
              <span className="text-primary">Ruleta</span> Personalizada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                {/* Pointer/Cursor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-primary drop-shadow-lg"></div>
                </div>

                {/* Roulette Wheel */}
                <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl border-8 border-primary/30">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full transition-transform duration-[4000ms] ease-out"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                    }}
                  >
                    {options.map((option, index) => {
                      const degreesPerSegment = 360 / options.length
                      const startAngle =
                        (index * degreesPerSegment - 90) * (Math.PI / 180)
                      const endAngle =
                        ((index + 1) * degreesPerSegment - 90) * (Math.PI / 180)

                      const x1 = 100 + 100 * Math.cos(startAngle)
                      const y1 = 100 + 100 * Math.sin(startAngle)
                      const x2 = 100 + 100 * Math.cos(endAngle)
                      const y2 = 100 + 100 * Math.sin(endAngle)

                      const largeArcFlag = degreesPerSegment > 180 ? 1 : 0

                      const pathData = [
                        `M 100 100`,
                        `L ${x1} ${y1}`,
                        `A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                        `Z`,
                      ].join(' ')

                      const textAngle =
                        (index * degreesPerSegment + degreesPerSegment / 2) *
                        (Math.PI / 180)
                      const textRadius = 65
                      const textX =
                        100 + textRadius * Math.cos(textAngle - Math.PI / 2)
                      const textY =
                        100 + textRadius * Math.sin(textAngle - Math.PI / 2)

                      return (
                        <g key={index}>
                          <path
                            d={pathData}
                            fill={getSegmentColor(index)}
                            stroke="#fff"
                            strokeWidth="2"
                          />
                          <text
                            x={textX}
                            y={textY}
                            fill="white"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${index * degreesPerSegment + degreesPerSegment / 2}, ${textX}, ${textY})`}
                            className="pointer-events-none"
                          >
                            {option.length > 12
                              ? option.slice(0, 12) + '...'
                              : option}
                          </text>
                        </g>
                      )
                    })}
                    {/* Center circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="15"
                      fill="#1a1a1a"
                      stroke="#f4d03f"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>

              {/* Result Display */}
              {result !== null && (
                <div className="text-center space-y-3">
                  <div className="text-3xl font-bold text-primary">
                    ¡Resultado!
                  </div>
                  <div className="text-xl text-muted-foreground">
                    Cayó:{' '}
                    <span className="text-primary font-bold">{result}</span>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setResult(null)} variant="outline">
                      Continuar con todas
                    </Button>
                    <Button
                      onClick={removeLastResult}
                      variant="destructive"
                      disabled={options.length <= 2}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar esta opción
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Add Option Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Añadir nueva opción..."
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addOption()}
                disabled={isSpinning}
              />
              <Button
                onClick={addOption}
                disabled={isSpinning || !newOption.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Options List */}
            <div>
              <p className="text-center text-sm text-muted-foreground mb-3">
                Opciones actuales ({options.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-2 rounded-lg bg-secondary/30">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between gap-2 p-3 rounded-lg font-bold ${getSegmentColor(index)}`}
                  >
                    <span className="truncate flex-1">{option}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeOption(option)}
                      disabled={isSpinning || options.length <= 2}
                      className="h-8 w-8 hover:bg-black/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Spin Button */}
            <Button
              size="lg"
              onClick={spinRoulette}
              disabled={isSpinning || options.length === 0}
              className="w-full h-16 text-2xl"
            >
              {isSpinning ? 'Girando...' : 'Girar Ruleta'}
            </Button>

            {/* Last Results */}
            {lastResults.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-3 text-center">
                  Últimos resultados
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {lastResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded-full bg-primary/20 text-primary font-bold border border-primary/30 text-sm"
                    >
                      {res}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
