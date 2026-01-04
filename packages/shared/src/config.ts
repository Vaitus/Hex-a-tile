export const GAME_CONFIG = {
  // Map dimensions
  MAP_WIDTH: 15,
  MAP_HEIGHT: 10,
  MAP_LAYERS: 2,

  // Tile settings
  TILE_WIDTH: 64,
  TILE_HEIGHT: 32,

  // Timing
  NORMAL_TILE_EXPLOSION_TIME: 2.0, // seconds
  CRACKED_TILE_EXPLOSION_TIME: 1.0, // seconds
  TRAP_TILE_EXPLOSION_TIME: 0.0, // instant

  // Player settings
  PLAYER_MOVE_SPEED: 200, // pixels per second
  PLAYER_JUMP_VELOCITY: -400,
  PLAYER_SIZE: 32,
  GRAVITY: 800,

  // Power-up settings
  SHIELD_DURATION: Infinity, // lasts until hit
  SPEED_BOOST_DURATION: 3.0, // seconds
  SPEED_BOOST_MULTIPLIER: 1.5,
  FREEZE_DURATION: 2.0, // seconds
  FREEZE_RADIUS: 2, // tiles

  // Game settings
  MAX_LOCAL_PLAYERS: 4,
  MAX_ONLINE_PLAYERS: 8,
  MATCH_DURATION: 180, // 3 minutes in seconds
  SERVER_TICK_RATE: 20, // Hz

  // Control schemes for local multiplayer
  CONTROL_SCHEMES: [
    { left: 'A', right: 'D', jump: 'W', down: 'S' }, // WASD
    { left: 'ArrowLeft', right: 'ArrowRight', jump: 'ArrowUp', down: 'ArrowDown' }, // Arrows
    { left: 'J', right: 'L', jump: 'I', down: 'K' }, // IJKL
    { left: 'Numpad4', right: 'Numpad6', jump: 'Numpad8', down: 'Numpad5' }, // Numpad
  ],

  // Player colors
  PLAYER_COLORS: [
    '#FF6B6B', // Red
    '#4ECDC4', // Cyan
    '#FFE66D', // Yellow
    '#A8E6CF', // Green
    '#FF8B94', // Pink
    '#C7CEEA', // Purple
    '#FFDAC1', // Orange
    '#B4A7D6', // Lavender
  ],
};

export const TILE_CONFIG = {
  [TileType.NORMAL]: {
    explosionTime: GAME_CONFIG.NORMAL_TILE_EXPLOSION_TIME,
    requiredSteps: 1,
    color: 0x8B4513,
  },
  [TileType.CRACKED]: {
    explosionTime: GAME_CONFIG.CRACKED_TILE_EXPLOSION_TIME,
    requiredSteps: 1,
    color: 0x654321,
  },
  [TileType.REINFORCED]: {
    explosionTime: GAME_CONFIG.NORMAL_TILE_EXPLOSION_TIME,
    requiredSteps: 2,
    color: 0x808080,
  },
  [TileType.ICE]: {
    explosionTime: GAME_CONFIG.NORMAL_TILE_EXPLOSION_TIME,
    requiredSteps: 1,
    color: 0x87CEEB,
    slippery: true,
  },
  [TileType.BOUNCE]: {
    explosionTime: GAME_CONFIG.NORMAL_TILE_EXPLOSION_TIME,
    requiredSteps: 1,
    color: 0xFF69B4,
    bounceForce: 600,
  },
  [TileType.TRAP]: {
    explosionTime: GAME_CONFIG.TRAP_TILE_EXPLOSION_TIME,
    requiredSteps: 1,
    color: 0x8B4513, // looks like normal
  },
  [TileType.TNT]: {
    color: 0xFF4500,
  },
};

export { TileType };
