import { Link, createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Dices, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { useDiceRoll } from '@/hooks/use-dice-roll'

export const Route = createFileRoute('/dice-roll')({
  head: () => ({
    meta: [
      {
        title:
          'The Dice of Destiny | Toma decisiones con el azar de los dioses',
      },
      {
        name: 'description',
        content:
          'Tira los Dados del Destino. Un generador de números aleatorios con dados virtuales para tus juegos de mesa o decisiones numéricas.',
      },
      {
        name: 'keywords',
        content:
          'dados virtuales, tirar dado online, dice roll, dados de la suerte, generador números aleatorios.',
      },
    ],
  }),
  component: DiceRollPage,
})

// Componente visual puro para la cara del dado
const DiceFace = ({ value }: { value: number }) => {
  const dots = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  }

  return (
    <div className="grid grid-cols-3 grid-rows-3 w-16 h-16 md:w-24 md:h-24 bg-white rounded-xl shadow-inner p-2 gap-1 border-2 border-slate-200">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {dots[value as keyof typeof dots].includes(i) && (
            <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-slate-900 rounded-full shadow-sm" />
          )}
        </div>
      ))}
    </div>
  )
}

function DiceRollPage() {
  const { numDice, setNumDice, results, total, history, isRolling, rollDice } =
    useDiceRoll(1)

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur border-primary/20 overflow-hidden">
              <CardHeader className="text-center border-b border-primary/10">
                <CardTitle className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
                  <Dices className="w-8 h-8 text-primary" />
                  The Dice
                  <span className="text-primary">of Destiny</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Número de Dados: {numDice}
                    </span>
                  </div>
                  <Slider
                    value={[numDice]}
                    min={1}
                    max={3}
                    step={1}
                    onValueChange={(val) => setNumDice(val[0])}
                    className="py-4"
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-6 min-h-[120px] items-center">
                  <AnimatePresence mode="wait">
                    {!isRolling ? (
                      results.map((val, idx) => (
                        <motion.div
                          key={`${idx}-${val}`}
                          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ type: 'spring', duration: 0.4 }}
                        >
                          <DiceFace value={val} />
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-6"
                      >
                        {[...Array(numDice)].map((_, i) => (
                          <div
                            key={i}
                            className="w-16 h-16 md:w-24 md:h-24 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center border-2 border-dashed border-slate-300"
                          >
                            <RotateCcw className="w-6 h-6 text-slate-400 animate-spin" />
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    Total: {total}
                  </div>
                </div>

                <Button
                  onClick={rollDice}
                  disabled={isRolling}
                  size="lg"
                  className="w-full h-16 text-xl font-bold shadow-lg shadow-primary/20"
                >
                  {isRolling ? 'Lanzando...' : 'Lanzar Dados'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-primary/20 h-full">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  Historial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {history.length === 0 && (
                    <p className="text-muted-foreground text-center py-8 italic">
                      No hay lanzamientos aún
                    </p>
                  )}
                  {history.map((res, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                    >
                      <div className="flex gap-1.5">
                        {res.map((v, j) => (
                          <span
                            key={j}
                            className="w-6 h-6 flex items-center justify-center bg-white text-slate-900 rounded font-bold text-xs shadow-sm border border-slate-200"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                      <span className="font-bold text-primary">
                        Suma: {res.reduce((a, b) => a + b, 0)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
