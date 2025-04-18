import React, { useState, useEffect, useRef } from 'react';
import GameMap from './components/GameMap';
import Player from './components/Player';
import Territory from './components/Territory';
import { PlayerData, GameState, TerritoryData } from './types';
import { initialTerritories, initialPlayers } from './data/gameData';
import { handleCollisions, updatePlayerPosition } from './utils/physics';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentPlayerIndex: 0,
    phase: 'MOVEMENT', // MOVEMENT, ATTACK, FORTIFY
    selectedTerritory: null,
    targetTerritory: null,
    territories: initialTerritories,
    players: initialPlayers,
    gameOver: false,
    winner: null,
  });

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());

  // Set up key listeners for player movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      if (gameState.phase === 'MOVEMENT') {
        setGameState(prevState => {
          const currentPlayer = prevState.players[prevState.currentPlayerIndex];
          const updatedPlayers = [...prevState.players];
          
          // Update player position based on key presses
          updatedPlayers[prevState.currentPlayerIndex] = updatePlayerPosition(
            currentPlayer,
            keysPressed.current,
            prevState.territories
          );

          // Check for territory captures
          const updatedTerritories = handleCollisions(
            updatedPlayers[prevState.currentPlayerIndex],
            prevState.territories,
            prevState.currentPlayerIndex
          );

          return {
            ...prevState,
            players: updatedPlayers,
            territories: updatedTerritories,
          };
        });
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameState.phase]);

  // Check for win condition
  useEffect(() => {
    const playerTerritories = gameState.territories.reduce((acc, territory) => {
      if (territory.ownerId !== null) {
        acc[territory.ownerId] = (acc[territory.ownerId] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    // Player wins if they control all territories
    const totalTerritories = gameState.territories.length;
    for (let i = 0; i < gameState.players.length; i++) {
      if (playerTerritories[i] === totalTerritories) {
        setGameState(prev => ({
          ...prev,
          gameOver: true,
          winner: i,
        }));
        break;
      }
    }
  }, [gameState.territories]);

  const endTurn = () => {
    setGameState(prevState => ({
      ...prevState,
      currentPlayerIndex: (prevState.currentPlayerIndex + 1) % prevState.players.length,
      phase: 'MOVEMENT',
      selectedTerritory: null,
      targetTerritory: null,
    }));
  };

  const handleTerritorySelect = (territoryId: number) => {
    const territory = gameState.territories.find(t => t.id === territoryId);
    
    if (territory && territory.ownerId === gameState.currentPlayerIndex) {
      // Select own territory
      setGameState(prev => ({
        ...prev,
        selectedTerritory: territoryId,
        targetTerritory: null
      }));
    } else if (gameState.selectedTerritory !== null && territory) {
      // Attack adjacent territory
      setGameState(prev => ({
        ...prev,
        targetTerritory: territoryId,
        phase: 'ATTACK'
      }));
    }
  };

  const executeAttack = () => {
    if (gameState.selectedTerritory === null || gameState.targetTerritory === null) return;
    
    const attacker = gameState.territories.find(t => t.id === gameState.selectedTerritory);
    const defender = gameState.territories.find(t => t.id === gameState.targetTerritory);
    
    if (!attacker || !defender) return;
    
    // Simple attack logic: 60% chance of success
    const attackSuccess = Math.random() > 0.4;
    
    if (attackSuccess) {
      // Update territory ownership
      setGameState(prev => ({
        ...prev,
        territories: prev.territories.map(t => 
          t.id === defender.id 
            ? { ...t, ownerId: prev.currentPlayerIndex } 
            : t
        ),
        phase: 'FORTIFY'
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        phase: 'FORTIFY'
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentPlayerIndex: 0,
      phase: 'MOVEMENT',
      selectedTerritory: null,
      targetTerritory: null,
      territories: initialTerritories,
      players: initialPlayers,
      gameOver: false,
      winner: null,
    });
  };

  return (
    <div className="game-container" ref={gameContainerRef}>
      <GameMap>
        {gameState.territories.map(territory => (
          <Territory
            key={territory.id}
            territory={territory}
            isSelected={territory.id === gameState.selectedTerritory}
            isTargeted={territory.id === gameState.targetTerritory}
            onClick={() => handleTerritorySelect(territory.id)}
            playerColor={territory.ownerId !== null ? gameState.players[territory.ownerId].color : 'gray'}
          />
        ))}
        
        {gameState.players.map((player, index) => (
          <Player
            key={index}
            player={player}
            isCurrentPlayer={index === gameState.currentPlayerIndex}
          />
        ))}
      </GameMap>
      
      <div className="ui-overlay">
        <div className="player-info">
          <h3>Current Player: {gameState.players[gameState.currentPlayerIndex].name}</h3>
          <p>Phase: {gameState.phase}</p>
          <p>Territories: {
            gameState.territories.filter(t => t.ownerId === gameState.currentPlayerIndex).length
          }</p>
        </div>
        
        <div className="controls">
          {gameState.phase === 'ATTACK' && (
            <button className="button" onClick={executeAttack}>
              Attack
            </button>
          )}
          
          {gameState.phase === 'FORTIFY' && (
            <button className="button" onClick={endTurn}>
              End Turn
            </button>
          )}
          
          {gameState.gameOver && (
            <>
              <div className="game-over-message">
                <h2>Game Over!</h2>
                <p>{gameState.winner !== null && gameState.players[gameState.winner].name} wins!</p>
                <button className="button" onClick={resetGame}>
                  Play Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;