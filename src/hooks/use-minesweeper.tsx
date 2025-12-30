import { useCallback, useEffect, useState } from 'react'

export type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborCount: number
}

export type GameState = 'playing' | 'won' | 'lost'

export function useMinesweeper(initialSize: number, initialMines: number) {
  const [gridSize, setGridSize] = useState(initialSize)
  const [mineCount, setMineCount] = useState(initialMines)
  const [grid, setGrid] = useState<Array<Array<Cell>>>([])
  const [gameState, setGameState] = useState<GameState>('playing')
  const [isFlagging, setIsFlagging] = useState(false)

  const initGrid = useCallback((size: number, mines: number) => {
    // 1. Crear grid vacío
    const newGrid: Array<Array<Cell>> = Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborCount: 0,
          })),
      )

    // 2. Colocar minas
    let placedMines = 0
    while (placedMines < mines) {
      const r = Math.floor(Math.random() * size)
      const c = Math.floor(Math.random() * size)
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true
        placedMines++
      }
    }

    // 3. Calcular vecinos
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newGrid[r][c].isMine) continue
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr,
              nc = c + dc
            if (
              nr >= 0 &&
              nr < size &&
              nc >= 0 &&
              nc < size &&
              newGrid[nr][nc].isMine
            ) {
              count++
            }
          }
        }
        newGrid[r][c].neighborCount = count
      }
    }

    setGrid(newGrid)
    setGameState('playing')
  }, [])

  // Reiniciar cuando cambian los ajustes básicos
  useEffect(() => {
    initGrid(gridSize, mineCount)
  }, [gridSize, mineCount, initGrid])

  const revealCell = (r: number, c: number) => {
    if (
      gameState !== 'playing' ||
      grid[r][c].isRevealed ||
      grid[r][c].isFlagged
    )
      return

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))

    // Si toca mina -> Perder
    if (newGrid[r][c].isMine) {
      newGrid.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isMine) cell.isRevealed = true
        }),
      )
      setGrid(newGrid)
      setGameState('lost')
      return
    }

    // Función recursiva para expandir áreas vacías
    const revealRecursive = (row: number, col: number) => {
      if (
        row < 0 ||
        row >= gridSize ||
        col < 0 ||
        col >= gridSize ||
        newGrid[row][col].isRevealed ||
        newGrid[row][col].isFlagged
      )
        return

      newGrid[row][col].isRevealed = true

      if (newGrid[row][col].neighborCount === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            revealRecursive(row + dr, col + dc)
          }
        }
      }
    }

    revealRecursive(r, c)

    // Comprobar victoria
    const hasWon = newGrid.every((row) =>
      row.every((cell) => cell.isMine || cell.isRevealed),
    )
    setGrid(newGrid)
    if (hasWon) setGameState('won')
  }

  const toggleFlag = (r: number, c: number) => {
    if (gameState !== 'playing' || grid[r][c].isRevealed) return
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged
    setGrid(newGrid)
  }

  return {
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
    resetGame: () => initGrid(gridSize, mineCount),
  }
}
