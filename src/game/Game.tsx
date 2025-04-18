import React, { useState, useEffect, useRef } from 'react';
import GameMap from './components/GameMap';
import Player from './components/Player';
import Territory from './components/Territory';
import Instructions from './components/Instructions';
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

  const [showInstructions, setShowInstructions] = useState(true);
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

  const endMovementPhase = () => {
    setGameState(prevState => ({
      ...prevState,
      phase: 'ATTACK',
    }));
  };

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
    
    if (gameState.phase === 'ATTACK') {
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
          targetTerritory: territoryId
        }));
      }
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

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Get territory count for current player
  const currentPlayerTerritoryCount = gameState.territories.filter(
    t => t.ownerId === gameState.currentPlayerIndex
  ).length;

  return (
    <div className="game-container" ref={gameContainerRef}>
      {showInstructions && (
        <Instructions onClose={toggleInstructions} />
      )}
      
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
          <p>Territories: {currentPlayerTerritoryCount}</p>
          <button className="button help-button" onClick={toggleInstructions}>
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </button>
        </div>
        
        <div className="controls">
          {gameState.phase === 'MOVEMENT' && (
            <button className="button" onClick={endMovementPhase}>
              End Movement
            </button>
          )}
          
          {gameState.phase === 'ATTACK' && gameState.selectedTerritory !== null && gameState.targetTerritory !== null && (
            <button className="button attack-button" onClick={executeAttack}>
              Attack
            </button>
          )}
          
          {gameState.phase === 'ATTACK' && (
            <button className="button" onClick={() => setGameState(prev => ({ ...prev, phase: 'FORTIFY' }))}>
              Skip Attack
            </button>
          )}
          
          {gameState.phase === 'FORTIFY' && (
            <button className="button end-turn-button" onClick={endTurn}>
              End Turn
            </button>
          )}
          
          {gameState.gameOver && (
            <div className="game-over-message">
              <h2>Game Over!</h2>
              <p>{gameState.winner !== null && gameState.players[gameState.winner].name} wins!</p>
              <button className="button" onClick={resetGame}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;