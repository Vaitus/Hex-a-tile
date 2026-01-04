export enum TileType {
  NORMAL = 'normal',
  CRACKED = 'cracked',
  REINFORCED = 'reinforced',
  ICE = 'ice',
  BOUNCE = 'bounce',
  TRAP = 'trap',
  TNT = 'tnt',
  EMPTY = 'empty'
}

export enum TileState {
  NORMAL = 'normal',
  TRIGGERED = 'triggered',
  EXPLODING = 'exploding',
  DESTROYED = 'destroyed'
}

export enum PowerUpType {
  SHIELD = 'shield',
  SPEED = 'speed',
  DOUBLE_JUMP = 'double_jump',
  FREEZE = 'freeze'
}

export interface Position {
  x: number;
  y: number;
  layer: number;
}

export interface Tile {
  type: TileType;
  state: TileState;
  position: Position;
  triggerCount: number; // for reinforced tiles
  explosionTimer: number; // seconds until explosion
  isPaused: boolean; // for freeze power-up
}

export interface Player {
  id: string;
  position: Position;
  velocity: { x: number; y: number };
  isAlive: boolean;
  hasShield: boolean;
  speedBoost: number; // remaining seconds
  doubleJumpAvailable: boolean;
  color: string;
  controlScheme: number; // 0-3 for local multiplayer
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  position: Position;
  active: boolean;
}

export interface GameState {
  players: Map<string, Player>;
  tiles: Tile[][][]; // [layer][y][x]
  powerUps: PowerUp[];
  gameTime: number;
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner: string | null;
}
