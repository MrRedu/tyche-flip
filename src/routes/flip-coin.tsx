import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFlipCoin } from '@/hooks/use-flip-coin'

export const Route = createFileRoute('/flip-coin')({
  component: FlipCoinPage,
})

function FlipCoinPage() {
  const {
    isFlipping,
    result,
    selectedSide,
    stats,
    setSelectedSide,
    flipCoin,
    resultText,
    resultColor,
  } = useFlipCoin()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="max-w-2xl w-full space-y-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>

        <Card className="bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-4xl text-center text-balance">
              Flip <span className="text-primary">Coin</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Coin Display */}
            <div className="flex justify-center items-center min-h-[300px]">
              <div
                className={`relative w-48 h-48 ${isFlipping ? 'animate-[coin-flip_2s_ease-in-out]' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary to-primary/70 shadow-2xl flex items-center justify-center border-8 border-primary/30">
                  <span className="text-6xl font-bold text-primary-foreground">
                    {result === null ? '?' : result === 'heads' ? 'H' : 'T'}
                  </span>
                </div>
              </div>
            </div>

            {/* Result Display */}
            {result && (
              <div
                className={`text-center text-3xl font-bold ${resultColor} transition-colors duration-300 ease-in-out`}
              >
                {resultText}
              </div>
            )}

            {/* Selection Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                variant={selectedSide === 'heads' ? 'default' : 'outline'}
                onClick={() => !isFlipping && setSelectedSide('heads')}
                disabled={isFlipping}
                className="h-20 text-xl"
              >
                Cara (H)
              </Button>
              <Button
                size="lg"
                variant={selectedSide === 'tails' ? 'default' : 'outline'}
                onClick={() => !isFlipping && setSelectedSide('tails')}
                disabled={isFlipping}
                className="h-20 text-xl"
              >
                Cruz (T)
              </Button>
            </div>

            {/* Flip Button */}
            <Button
              size="lg"
              onClick={flipCoin}
              disabled={isFlipping || !selectedSide}
              className="w-full h-16 text-2xl"
            >
              {isFlipping ? 'Lanzando...' : 'Lanzar Moneda'}
            </Button>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Caras</p>
                <p className="text-3xl font-bold text-primary">{stats.heads}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Cruces</p>
                <p className="text-3xl font-bold text-primary">{stats.tails}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
