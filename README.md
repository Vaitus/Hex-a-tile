# Hex-A-Boom 💣

A multiplayer isometric survival platformer where the ground literally explodes beneath your feet!

## 🎮 Game Concept

Players compete on a multi-layer isometric tilemap. When a player steps on a tile, it transforms into TNT and explodes after a delay. Players must avoid explosions and be the last one standing in fast-paced 1-3 minute matches.

## 🏗️ Tech Stack

- **Runtime**: Bun (for both development and server)
- **Frontend**: TypeScript + Phaser 3 (isometric game engine)
- **Backend**: TypeScript + Colyseus (multiplayer game server)
- **Architecture**: Monorepo with shared types

## 📁 Project Structure

```
hex-a-boom/
├── packages/
│   ├── shared/          # Shared types, constants, and game logic
│   │   └── src/
│   │       ├── types.ts      # Game state interfaces and enums
│   │       ├── config.ts     # Game configuration and constants
│   │       └── index.ts      # Package exports
│   │
│   ├── client/          # Phaser 3 game client
│   │   ├── public/
│   │   │   └── index.html    # Game HTML page
│   │   └── src/
│   │       ├── index.ts           # Phaser game initialization
│   │       ├── scenes/
│   │       │   └── GameScene.ts   # Main game scene
│   │       └── game/
│   │           ├── IsometricTilemap.ts  # Tile rendering and logic
│   │           └── Player.ts             # Player controls and physics
│   │
│   └── server/          # Colyseus game server (Phase 3)
│       └── (coming soon)
│
└── package.json         # Workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher

### Installation

```bash
# Install dependencies
bun install

# Run the client in development mode
bun run dev:client
```

Then open the generated `index.html` in your browser.

## 🎯 Current Status: Phase 1 - Local Prototype ✅

### Implemented Features

- ✅ Monorepo setup with Bun workspaces
- ✅ Isometric tilemap rendering (single layer)
- ✅ Single player movement with keyboard (Arrow keys)
- ✅ Normal tile → TNT → explosion → disappear mechanic
- ✅ Basic player death when caught in explosion
- ✅ Death animation and restart functionality (Press R)

### Controls

- **Arrow Keys**: Move player
- **Up Arrow**: Jump
- **R**: Restart after death

### How to Play

1. Move your character around the isometric map
2. Stepping on tiles triggers them to become TNT
3. TNT tiles show a countdown timer (2.0 seconds for normal tiles)
4. Avoid explosions or you'll die!
5. Don't fall off the edge of the map

## 📋 Implementation Phases

### Phase 1 - Local Prototype ✅ (CURRENT)
- [x] Set up monorepo with Bun workspaces
- [x] Isometric tilemap rendering (single layer)
- [x] Single player movement with keyboard
- [x] Normal tile → TNT → explosion → disappear mechanic
- [x] Basic player death when caught in explosion

### Phase 2 - Full Local Game (NEXT)
- [ ] Multi-layer tilemap with falling between layers
- [ ] All tile types implemented:
  - [ ] Cracked - explodes after 1 second
  - [ ] Reinforced - requires 2 steps to activate
  - [ ] Ice - slippery movement
  - [ ] Bounce - springs player upward to layer above
  - [ ] Trap - looks normal but explodes instantly
- [ ] 2-4 local players with split controls
  - [ ] WASD (Player 1)
  - [ ] Arrow Keys (Player 2)
  - [ ] IJKL (Player 3)
  - [ ] Numpad (Player 4)
- [ ] Win condition detection (last standing)
- [ ] Basic UI: player indicators, countdown, winner announcement
- [ ] Power-up spawning and collection:
  - [ ] Shield - survive one explosion
  - [ ] Speed boost - 3 second faster movement
  - [ ] Double jump - one extra jump
  - [ ] Freeze - pause nearby explosion timers

### Phase 3 - Online Multiplayer
- [ ] Colyseus server setup with Bun
- [ ] Game state schema for synchronization
- [ ] Room creation and joining (codes + public queue)
- [ ] Client-side prediction with server reconciliation
- [ ] Handle player disconnection gracefully
- [ ] Lobby UI: room browser, create game, join by code
- [ ] Support up to 8 players online

### Phase 4 - Polish
- [ ] Sound effects and music
- [ ] Particle effects for explosions
- [ ] Player customization (colors/simple skins)
- [ ] Match statistics
- [ ] Spectator mode for eliminated players

## 🎨 Game Mechanics

### Tile Types

| Tile | Explosion Time | Special Properties |
|------|----------------|-------------------|
| Normal | 2.0s | Standard tile |
| Cracked | 1.0s | Already damaged |
| Reinforced | 2.0s | Requires 2 steps to activate |
| Ice | 2.0s | Slides player in movement direction |
| Bounce | 2.0s | Springs player to layer above |
| Trap | Instant | Looks like normal, explodes immediately |

### Power-Ups

| Power-Up | Duration | Effect |
|----------|----------|--------|
| Shield | Until hit | Survive one explosion |
| Speed Boost | 3.0s | 1.5x movement speed |
| Double Jump | One use | Extra jump ability |
| Freeze | 2.0s | Pause nearby explosion timers |

## 🛠️ Development

### Available Scripts

```bash
# Development
bun run dev:client     # Run client with hot reload
bun run dev:server     # Run server with hot reload (Phase 3)

# Building
bun run build:client   # Build client for production
bun run build:server   # Build server for production

# Production
bun run start:server   # Start production server (Phase 3)
```

### Adding New Features

1. Shared types and constants go in `packages/shared/src/`
2. Client game logic goes in `packages/client/src/game/`
3. Phaser scenes go in `packages/client/src/scenes/`
4. Server logic will go in `packages/server/src/` (Phase 3)

## 🏗️ Architecture Details

### Isometric Tilemap

The game uses an isometric (2.5D) projection:
- Tiles are rendered as diamond shapes
- Screen coordinates are calculated from tile grid coordinates
- Multiple layers support vertical gameplay

### Player Physics

- Phaser Arcade Physics for movement and collisions
- Custom isometric collision detection with tiles
- Smooth camera following

### Game State

All game state is managed through shared TypeScript interfaces:
- Player positions, velocities, and status
- Tile states and explosion timers
- Power-up locations and effects

## 🎯 Technical Goals

- Maintain 60fps on client
- Server tick rate: 20Hz (Phase 3)
- Input delay compensation
- Smooth interpolation for remote players
- Server-authoritative validation for online play

## 📝 Notes

- Focus on playability over visual polish initially
- Test each phase thoroughly before moving to the next
- Server-side validation prevents cheating in online play
- Simple test maps used for development

## 🤝 Contributing

This is a Phase 1 prototype. Contributions welcome as the project progresses!

## 📄 License

MIT

---

Built with [Bun](https://bun.sh) and [Phaser 3](https://phaser.io)
