import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Bomb, Flag, RefreshCcw, Trophy } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useMinesweeper } from '@/hooks/use-minesweeper'

export const Route = createFileRoute('/minesweeper')({
  head: () => ({
    meta: [
      {
        title:
          'Pandora’s Grid (Buscaminas) | Toma decisiones con el azar de los dioses',
      },
      {
        name: 'description',
        content:
          'Pon a prueba tu fortuna en la Cuadrícula de Pandora. Encuentra los tesoros ocultos y evita las trampas en este juego de pura suerte y riesgo.',
      },
      {
        name: 'keywords',
        content:
          "juego de suerte, buscaminas online, tesoros ocultos, probar fortuna, Pandora's Grid, minijuegos de azar.",
      },
    ],
  }),
  component: MinesweeperPage,
})

function MinesweeperPage() {
  const {
    grid,
    gridSize,
    setGridSize,
    mineCount,
    setMineCount,
    gameState,
    isFlagging,
    setIsFlagging,
    revealCell,
    toggleFlag,
    resetGame,
  } = useMinesweeper(6, 6)

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Button>
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {`Pandora’s `}
            <span className="text-primary">Grid</span>
          </h1>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur border-primary/20 sm:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div>
                <CardTitle className="text-2xl">Ajustes</CardTitle>
                <CardDescription>
                  {gridSize}x{gridSize} | {mineCount} Bombas
                </CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={resetGame}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Tamaño Tablero
                </label>
                <Slider
                  value={[gridSize]}
                  min={3}
                  max={9}
                  step={1}
                  onValueChange={(v) => {
                    setGridSize(v[0])
                    setMineCount(
                      Math.min(mineCount, Math.floor(v[0] * v[0] * 0.3)),
                    )
                  }}
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Bombas
                </label>
                <Slider
                  value={[mineCount]}
                  min={1}
                  max={Math.floor(gridSize * gridSize * 0.4)}
                  step={1}
                  onValueChange={(v) => setMineCount(v[0])}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 sm:col-span-2 items-center">
            <Button
              variant={isFlagging ? 'default' : 'outline'}
              onClick={() => setIsFlagging(!isFlagging)}
              className="w-full max-w-[200px]"
            >
              <Flag
                className={cn('w-4 h-4 mr-2', isFlagging && 'fill-current')}
              />
              {isFlagging ? 'Modo Bandera: ON' : 'Modo Bandera: OFF'}
            </Button>

            {/* Minesweeper */}
            <div
              className="grid gap-1 p-4 bg-secondary/20 rounded-xl w-fit border border-border/50"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => (
                  <button
                    key={`${r}-${c}`}
                    onClick={() =>
                      isFlagging ? toggleFlag(r, c) : revealCell(r, c)
                    }
                    onContextMenu={(e) => {
                      e.preventDefault()
                      toggleFlag(r, c)
                    }}
                    className={cn(
                      'max-[400px]:w-8 max-[400px]:h-8 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg font-bold rounded-md transition-all',
                      cell.isRevealed
                        ? cell.isMine
                          ? 'bg-destructive text-white'
                          : 'bg-card text-foreground'
                        : 'bg-primary/20 hover:bg-primary/40 cursor-pointer shadow-sm active:scale-95',
                      gameState === 'lost' &&
                        cell.isMine &&
                        !cell.isRevealed &&
                        'bg-destructive/40',
                    )}
                  >
                    {cell.isRevealed ? (
                      cell.isMine ? (
                        <Bomb className="w-6 h-6 animate-bounce" />
                      ) : (
                        cell.neighborCount || ''
                      )
                    ) : (
                      cell.isFlagged && (
                        <Flag className="w-5 h-5 text-primary fill-current animate-pulse" />
                      )
                    )}
                  </button>
                )),
              )}
            </div>
          </div>
        </div>

        {gameState !== 'playing' && (
          <div
            className={cn(
              'p-6 rounded-xl text-center space-y-4 animate-in fade-in zoom-in duration-300 border',
              gameState === 'won'
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-destructive/10 border-destructive text-destructive',
            )}
          >
            <div className="flex justify-center">
              {gameState === 'won' ? (
                <Trophy className="w-12 h-12" />
              ) : (
                <Bomb className="w-12 h-12" />
              )}
            </div>
            <h2 className="text-2xl font-bold">
              {gameState === 'won' ? '¡Has Ganado!' : '¡BOOM! Juego Terminado'}
            </h2>
            <Button
              variant={gameState === 'won' ? 'default' : 'destructive'}
              onClick={resetGame}
            >
              Intentar de nuevo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
