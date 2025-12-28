import { Link, createFileRoute } from '@tanstack/react-router'
import { CircleDot, Coins } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            <span className="text-primary">TycheFlip</span> MiniGames
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            ¡Elige tu juego favorito y prueba tu suerte!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/flip-coin" className="block group">
            <Card className="h-full transition-all hover:scale-105 hover:border-primary bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Coins className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl">{`Tyche’s Coin Flip`}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Lanza la moneda y elige cara o cruz. ¿Tendrás suerte?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Jugar Ahora
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/roulette" className="block group">
            <Card className="h-full transition-all hover:scale-105 hover:border-primary bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <CircleDot className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl">Wheel of Fate</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Gira la ruleta y apuesta a tu número de la suerte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Jugar Ahora
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dice-roll" className="block group !hidden">
            <Card className="h-full transition-all hover:scale-105 hover:border-primary bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <CircleDot className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl">
                    The Dice of Destiny
                  </CardTitle>
                </div>
                <CardDescription className="text-base">
                  Tira el dado y apuesta a tu numero de la suerte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Jugar Ahora
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
