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

## 🎯 Current Status: Phase 2 - Full Local Game ✅

### Implemented Features

- ✅ Multi-layer isometric tilemap (2 layers with falling mechanics)
- ✅ All 6 tile types working:
  - Normal (2s explosion)
  - Cracked (1s explosion)
  - Reinforced (requires 2 steps)
  - Ice (slippery movement)
  - Bounce (springs to upper layer)
  - Trap (instant explosion, disguised as normal)
- ✅ 2-4 player local multiplayer
- ✅ Split control schemes (WASD, Arrows, IJKL, Numpad)
- ✅ All 4 power-ups implemented:
  - Shield (blocks one explosion)
  - Speed Boost (3s of 1.5x speed)
  - Double Jump (one extra jump)
  - Freeze (pauses nearby timers for 2s)
- ✅ Win condition (last player standing or time up)
- ✅ Full game UI (player status, match timer, winner screen)
- ✅ 3-minute match timer with countdown
- ✅ Game start countdown

### Controls

**Player 1 (WASD)**
- **A/D**: Move left/right
- **W**: Jump
- **S**: (reserved)

**Player 2 (Arrow Keys)**
- **←/→**: Move left/right
- **↑**: Jump
- **↓**: (reserved)

**Player 3 (IJKL)**
- **J/L**: Move left/right
- **I**: Jump
- **K**: (reserved)

**Player 4 (Numpad)**
- **4/6**: Move left/right
- **8**: Jump
- **5**: (reserved)

**General**
- **R**: Restart after match ends

### How to Play

1. **Objective**: Be the last player standing!
2. **Movement**: Avoid explosions and other players
3. **Tiles**: Each tile type has special properties:
   - Normal: Standard 2s timer
   - Cracked: Faster 1s timer (has crack marks)
   - Reinforced: Needs 2 steps (has grid pattern)
   - Ice: Slippery! (has snowflake pattern)
   - Bounce: Launches you up (has spring coils)
   - Trap: Explodes instantly (no visual warning!)
4. **Power-ups**: Collect floating icons for temporary abilities
5. **Layers**: Fall through destroyed tiles to lower layer
6. **Winning**: Survive longer than opponents or be last alive

## 📋 Implementation Phases

### Phase 1 - Local Prototype ✅
- [x] Set up monorepo with Bun workspaces
- [x] Isometric tilemap rendering (single layer)
- [x] Single player movement with keyboard
- [x] Normal tile → TNT → explosion → disappear mechanic
- [x] Basic player death when caught in explosion

### Phase 2 - Full Local Game ✅ (CURRENT)
- [x] Multi-layer tilemap with falling between layers
- [x] All tile types implemented:
  - [x] Cracked - explodes after 1 second
  - [x] Reinforced - requires 2 steps to activate
  - [x] Ice - slippery movement
  - [x] Bounce - springs player upward to layer above
  - [x] Trap - looks normal but explodes instantly
- [x] 2-4 local players with split controls
  - [x] WASD (Player 1)
  - [x] Arrow Keys (Player 2)
  - [x] IJKL (Player 3)
  - [x] Numpad (Player 4)
- [x] Win condition detection (last standing)
- [x] Basic UI: player indicators, countdown, winner announcement
- [x] Power-up spawning and collection:
  - [x] Shield - survive one explosion
  - [x] Speed boost - 3 second faster movement
  - [x] Double jump - one extra jump
  - [x] Freeze - pause nearby explosion timers

### Phase 3 - Online Multiplayer (NEXT)
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
