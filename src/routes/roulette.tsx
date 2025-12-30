import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, CircleDot, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRoulette } from '@/hooks/use-roulette'

export const Route = createFileRoute('/roulette')({
  head: () => ({
    meta: [
      {
        title: 'Wheel of Fate | Toma decisiones con el azar de los dioses',
      },
      {
        name: 'description',
        content:
          'Personaliza tus opciones y gira la Rueda del Destino. La ruleta de decisiones perfecta para elegir comidas, nombres o ganadores al azar.',
      },
      {
        name: 'keywords',
        content:
          'ruleta de decisiones, wheel of fate, girar ruleta online, sorteo de opciones, seleccionador aleatorio.',
      },
    ],
  }),
  component: RoulettePage,
})

const getSegmentColor = (index: number) => {
  const colors = [
    '#ef4444',
    '#3b82f6',
    '#22c55e',
    '#eab308',
    '#a855f7',
    '#ec4899',
    '#f97316',
    '#14b8a6',
  ]
  return colors[index % colors.length]
}

function RoulettePage() {
  const {
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
  } = useRoulette()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="max-w-3xl w-full space-y-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>

        <Card className="bg-card/80 backdrop-blur">
          <CardHeader>
            {/* <CardTitle className="text-4xl text-center text-balance"> */}
            <CardTitle className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
              <CircleDot className="w-8 h-8 text-primary" />
              <span className="text-primary">Wheel</span> of Fate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 mt-4">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                {/* Pointer/Cursor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-primary drop-shadow-lg"></div>
                </div>

                {/* Roulette Wheel */}
                <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl border-8 border-primary/30">
                  {/* Roulette Wheel SVG */}
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    {options.map((option, index) => {
                      const degreesPerSegment = 360 / options.length

                      // IMPORTANTE: El ángulo de dibujo debe empezar en -90° para que sea "las 12 en punto"
                      const startAngleDeg = index * degreesPerSegment - 90
                      const endAngleDeg = (index + 1) * degreesPerSegment - 90

                      const startAngleRad = (startAngleDeg * Math.PI) / 180
                      const endAngleRad = (endAngleDeg * Math.PI) / 180

                      const x1 = 100 + 100 * Math.cos(startAngleRad)
                      const y1 = 100 + 100 * Math.sin(startAngleRad)
                      const x2 = 100 + 100 * Math.cos(endAngleRad)
                      const y2 = 100 + 100 * Math.sin(endAngleRad)

                      const pathData = [
                        `M 100 100`,
                        `L ${x1} ${y1}`,
                        `A 100 100 0 ${degreesPerSegment > 180 ? 1 : 0} 1 ${x2} ${y2}`,
                        `Z`,
                      ].join(' ')

                      // Ángulo del texto (centro del segmento)
                      const textAngleDeg =
                        index * degreesPerSegment + degreesPerSegment / 2 - 90
                      const textAngleRad = (textAngleDeg * Math.PI) / 180
                      const textX = 100 + 60 * Math.cos(textAngleRad)
                      const textY = 100 + 60 * Math.sin(textAngleRad)

                      return (
                        <g key={index}>
                          <path
                            d={pathData}
                            fill={getSegmentColor(index)}
                            stroke="#fff"
                            strokeWidth="1"
                          />
                          <text
                            x={textX}
                            y={textY}
                            fill="white"
                            fontSize="8"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            // Rotamos el texto para que sea legible radialmente
                            transform={`rotate(${textAngleDeg + 90}, ${textX}, ${textY})`}
                          >
                            {option.slice(0, 10)}
                          </text>
                        </g>
                      )
                    })}
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
            <div className="flex flex-col gap-2">
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

            {/* Options List */}
            <div>
              <p className="text-center text-sm text-muted-foreground mb-3">
                Opciones actuales ({options.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-2 rounded-lg bg-secondary/30">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center bg-muted justify-between gap-2 p-3 rounded-lg font-bold ${getSegmentColor(index)}`}
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
