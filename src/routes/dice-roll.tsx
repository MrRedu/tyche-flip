import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dice-roll')({
  component: DiceRollPage,
})

function DiceRollPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/30">
      Dice Roll / The Dice of Destiny / Lanzar el dado
    </div>
  )
}
