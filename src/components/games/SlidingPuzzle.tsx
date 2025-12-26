"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface SlidingPuzzleProps {
  imageUrl: string;
  onComplete: () => void;
  gridSize?: number;
}

interface Tile {
  index: number;
  position: number;
  isEmpty: boolean;
}

export const SlidingPuzzle: React.FC<SlidingPuzzleProps> = ({
  imageUrl,
  onComplete,
  gridSize = 3,
}) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const totalTiles = gridSize * gridSize;
    const initialTiles: Tile[] = [];

    for (let i = 0; i < totalTiles; i++) {
      initialTiles.push({
        index: i,
        position: i,
        isEmpty: i === totalTiles - 1,
      });
    }

    // Shuffle
    const shuffled = shuffleTiles(initialTiles);
    setTiles(shuffled);
    setMoves(0);
    setIsComplete(false);
  };

  const shuffleTiles = (tiles: Tile[]) => {
    const shuffled = [...tiles];
    
    // Perform random valid moves to ensure solvable puzzle
    for (let i = 0; i < 100; i++) {
      const emptyIndex = shuffled.findIndex(t => t.isEmpty);
      const validMoves = getValidMoves(emptyIndex, gridSize);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      
      // Swap
      const temp = shuffled[emptyIndex];
      shuffled[emptyIndex] = shuffled[randomMove];
      shuffled[randomMove] = temp;
    }

    return shuffled;
  };

  const getValidMoves = (emptyIndex: number, gridSize: number) => {
    const moves = [];
    const row = Math.floor(emptyIndex / gridSize);
    const col = emptyIndex % gridSize;

    if (row > 0) moves.push(emptyIndex - gridSize); // Up
    if (row < gridSize - 1) moves.push(emptyIndex + gridSize); // Down
    if (col > 0) moves.push(emptyIndex - 1); // Left
    if (col < gridSize - 1) moves.push(emptyIndex + 1); // Right

    return moves;
  };

  const handleTileClick = (clickedIndex: number) => {
    if (isComplete) return;

    const emptyIndex = tiles.findIndex(t => t.isEmpty);
    const validMoves = getValidMoves(emptyIndex, gridSize);

    if (validMoves.includes(clickedIndex)) {
      const newTiles = [...tiles];
      const temp = newTiles[emptyIndex];
      newTiles[emptyIndex] = newTiles[clickedIndex];
      newTiles[clickedIndex] = temp;

      setTiles(newTiles);
      setMoves(moves + 1);

      // Check if solved
      const solved = newTiles.every((tile, index) => tile.index === index);
      if (solved) {
        setIsComplete(true);
        onComplete();
      }
    }
  };

  const tileSize = 400 / gridSize;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-lg font-semibold">Moves: {moves}</div>
      <div 
        className="relative bg-gray-200 rounded-lg overflow-hidden"
        style={{ width: 400, height: 400 }}
      >
        {tiles.map((tile, index) => {
          const row = Math.floor(tile.index / gridSize);
          const col = tile.index % gridSize;

          return (
            <div
              key={index}
              onClick={() => handleTileClick(index)}
              className={`absolute cursor-pointer transition-all duration-200 border border-gray-300 ${
                tile.isEmpty ? 'opacity-0' : 'hover:opacity-80'
              }`}
              style={{
                width: tileSize,
                height: tileSize,
                left: (index % gridSize) * tileSize,
                top: Math.floor(index / gridSize) * tileSize,
                backgroundImage: tile.isEmpty ? 'none' : `url(${imageUrl})`,
                backgroundSize: `${400}px ${400}px`,
                backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
              }}
            />
          );
        })}
      </div>
      <Button onClick={initializePuzzle} variant="outline">
        Reset Puzzle
      </Button>
    </div>
  );
};
