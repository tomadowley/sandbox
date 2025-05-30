import React, { createContext, useContext, useReducer, ReactNode } from "react";

export type Player = { name: string; score: number };
export type Phase = "setup" | "reveal" | "discussion" | "voting" | "results";

export interface GameState {
  players: Player[];
  currentRound: number;
  currentWord: string;
  impostorIndex: number | null;
  phase: Phase;
  votes: number[]; // Index by player; value is index of voted player
  revealIndex: number; // Which player's turn for word reveal
}

type GameAction =
  | { type: "ADD_PLAYER"; name: string }
  | { type: "START_GAME"; word: string; impostorIndex: number }
  | { type: "NEXT_PLAYER_REVEAL" }
  | { type: "FINISH_REVEALS" }
  | { type: "START_DISCUSSION" }
  | { type: "CAST_VOTE"; voter: number; votedFor: number }
  | { type: "FINISH_VOTING" }
  | { type: "NEXT_ROUND"; word: string; impostorIndex: number }
  | { type: "RESET_GAME" };

const defaultState: GameState = {
  players: [],
  currentRound: 1,
  currentWord: "",
  impostorIndex: null,
  phase: "setup",
  votes: [],
  revealIndex: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_PLAYER":
      if (state.players.length >= 4) return state;
      return {
        ...state,
        players: [...state.players, { name: action.name, score: 0 }],
      };
    case "START_GAME":
      return {
        ...state,
        currentRound: 1,
        phase: "reveal",
        currentWord: action.word,
        impostorIndex: action.impostorIndex,
        votes: new Array(state.players.length).fill(-1),
        revealIndex: 0,
      };
    case "NEXT_PLAYER_REVEAL":
      return {
        ...state,
        revealIndex: state.revealIndex + 1,
      };
    case "FINISH_REVEALS":
      return {
        ...state,
        phase: "discussion",
        revealIndex: 0,
      };
    case "START_DISCUSSION":
      return {
        ...state,
        phase: "discussion",
      };
    case "CAST_VOTE":
      const votes = [...state.votes];
      votes[action.voter] = action.votedFor;
      return { ...state, votes };
    case "FINISH_VOTING":
      return { ...state, phase: "results" };
    case "NEXT_ROUND":
      return {
        ...state,
        currentRound: state.currentRound + 1,
        phase: "reveal",
        currentWord: action.word,
        impostorIndex: action.impostorIndex,
        votes: new Array(state.players.length).fill(-1),
        revealIndex: 0,
      };
    case "RESET_GAME":
      return { ...defaultState };
    default:
      return state;
  }
}

interface GameContextType extends GameState {
  addPlayer: (name: string) => void;
  startGame: (word: string, impostorIndex: number) => void;
  nextPlayerReveal: () => void;
  finishReveals: () => void;
  startDiscussion: () => void;
  castVote: (voter: number, votedFor: number) => void;
  finishVoting: () => void;
  nextRound: (word: string, impostorIndex: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, defaultState);

  const addPlayer = (name: string) => dispatch({ type: "ADD_PLAYER", name });
  const startGame = (word: string, impostorIndex: number) =>
    dispatch({ type: "START_GAME", word, impostorIndex });
  const nextPlayerReveal = () => dispatch({ type: "NEXT_PLAYER_REVEAL" });
  const finishReveals = () => dispatch({ type: "FINISH_REVEALS" });
  const startDiscussion = () => dispatch({ type: "START_DISCUSSION" });
  const castVote = (voter: number, votedFor: number) =>
    dispatch({ type: "CAST_VOTE", voter, votedFor });
  const finishVoting = () => dispatch({ type: "FINISH_VOTING" });
  const nextRound = (word: string, impostorIndex: number) =>
    dispatch({ type: "NEXT_ROUND", word, impostorIndex });
  const resetGame = () => dispatch({ type: "RESET_GAME" });

  return (
    <GameContext.Provider
      value={{
        ...state,
        addPlayer,
        startGame,
        nextPlayerReveal,
        finishReveals,
        startDiscussion,
        castVote,
        finishVoting,
        nextRound,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
};