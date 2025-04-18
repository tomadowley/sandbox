import { PlayerData, TerritoryData } from '../types';

export const initialPlayers: PlayerData[] = [
  {
    id: 0,
    name: 'Player 1',
    color: '#FF5733',
    position: { x: 100, y: 650 },
    velocity: { x: 0, y: 0 },
    isJumping: false,
    jumpPower: 15
  },
  {
    id: 1,
    name: 'Player 2',
    color: '#33FF57',
    position: { x: 300, y: 650 },
    velocity: { x: 0, y: 0 },
    isJumping: false,
    jumpPower: 15
  },
  {
    id: 2,
    name: 'Player 3',
    color: '#3357FF',
    position: { x: 500, y: 650 },
    velocity: { x: 0, y: 0 },
    isJumping: false,
    jumpPower: 15
  },
  {
    id: 3,
    name: 'Player 4',
    color: '#F033FF',
    position: { x: 700, y: 650 },
    velocity: { x: 0, y: 0 },
    isJumping: false,
    jumpPower: 15
  }
];

export const initialTerritories: TerritoryData[] = [
  // North America
  {
    id: 0,
    name: 'Alaska',
    x: 50,
    y: 100,
    width: 100,
    height: 80,
    ownerId: 0,
    adjacent: [1, 2, 6]
  },
  {
    id: 1,
    name: 'Alberta',
    x: 150,
    y: 100,
    width: 100,
    height: 80,
    ownerId: 0,
    adjacent: [0, 2, 3, 7]
  },
  {
    id: 2,
    name: 'Central America',
    x: 150,
    y: 180,
    width: 100,
    height: 80,
    ownerId: 0,
    adjacent: [0, 1, 3, 8]
  },
  {
    id: 3,
    name: 'Eastern US',
    x: 250,
    y: 100,
    width: 100,
    height: 80,
    ownerId: 0,
    adjacent: [1, 2, 7, 8]
  },
  
  // Europe
  {
    id: 4,
    name: 'Western Europe',
    x: 400,
    y: 100,
    width: 100,
    height: 80,
    ownerId: 1,
    adjacent: [5, 9, 10]
  },
  {
    id: 5,
    name: 'Northern Europe',
    x: 500,
    y: 100,
    width: 100,
    height: 80,
    ownerId: 1,
    adjacent: [4, 10, 11]
  },
  
  // Asia
  {
    id: 6,
    name: 'Ural',
    x: 50,
    y: 300,
    width: 100,
    height: 80,
    ownerId: 2,
    adjacent: [0, 7, 12]
  },
  {
    id: 7,
    name: 'Siberia',
    x: 150,
    y: 300,
    width: 100,
    height: 80,
    ownerId: 2,
    adjacent: [1, 3, 6, 12]
  },
  {
    id: 8,
    name: 'China',
    x: 250,
    y: 300,
    width: 100,
    height: 80,
    ownerId: 2,
    adjacent: [2, 3, 9, 13]
  },
  {
    id: 9,
    name: 'India',
    x: 350,
    y: 300,
    width: 100,
    height: 80,
    ownerId: 2,
    adjacent: [4, 8, 10, 13]
  },
  
  // Africa
  {
    id: 10,
    name: 'North Africa',
    x: 450,
    y: 300,
    width: 100,
    height: 80,
    ownerId: 3,
    adjacent: [4, 5, 9, 11]
  },
  {
    id: 11,
    name: 'East Africa',
    x: 550,
    y: 300,
    width: 100,
    height: 80,
    ownerId: 3,
    adjacent: [5, 10, 14]
  },
  
  // Australia
  {
    id: 12,
    name: 'Western Australia',
    x: 150,
    y: 450,
    width: 100,
    height: 80,
    ownerId: 3,
    adjacent: [6, 7, 13]
  },
  {
    id: 13,
    name: 'Eastern Australia',
    x: 250,
    y: 450,
    width: 100,
    height: 80,
    ownerId: 3,
    adjacent: [8, 9, 12]
  },
  {
    id: 14,
    name: 'New Guinea',
    x: 550,
    y: 450,
    width: 100,
    height: 80,
    ownerId: 0,
    adjacent: [11]
  }
];