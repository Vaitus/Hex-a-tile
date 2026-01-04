# Changelog

All notable changes to Hex-A-Boom will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-04

### Added - Phase 1: Local Prototype ✅

#### Project Setup
- Monorepo structure using Bun workspaces
- Three packages: shared, client, server
- TypeScript configuration across all packages
- Development documentation (README, DEVELOPMENT, TROUBLESHOOTING)

#### Shared Package (@hex-a-boom/shared)
- Core type definitions:
  - `TileType` enum (Normal, Cracked, Reinforced, Ice, Bounce, Trap, TNT, Empty)
  - `TileState` enum (Normal, Triggered, Exploding, Destroyed)
  - `PowerUpType` enum (Shield, Speed, DoubleJump, Freeze)
  - `Player`, `Tile`, `PowerUp`, `GameState` interfaces
- Game configuration constants:
  - Map dimensions and tile sizes
  - Explosion timings for different tile types
  - Player physics settings (speed, jump, gravity)
  - Power-up durations and effects
  - Control schemes for local multiplayer (4 players)
  - Player color palette
- Tile configuration with properties for each tile type

#### Client Package (@hex-a-boom/client)
- Phaser 3 game setup:
  - Game configuration (1280x720, Arcade Physics)
  - Auto-scaling with centered viewport
  - Debug mode enabled for development
- Main GameScene:
  - Scene initialization and game loop
  - Player spawning at map center
  - Keyboard input handling (Arrow keys)
  - Camera follow system
  - Death detection (explosion and falling)
  - Map bounds checking
- IsometricTilemap system:
  - 15x10 tile grid (single layer for Phase 1)
  - Isometric diamond rendering
  - Tile state management (Normal → Triggered → Exploding → Destroyed)
  - Explosion countdown timers (2.0s for normal tiles)
  - Visual timer display on triggered tiles
  - Screen ↔ Tile coordinate conversion
  - Tile triggering on player step
  - Automatic tile destruction after explosion
  - Color coding by tile state
- Player system:
  - Circular player sprite with face
  - Arcade physics integration
  - Smooth movement controls
  - Jump mechanics
  - Death animation (fade and fall)
  - Restart functionality (Press R)
  - "You Died" message overlay
- Development server with hot reload

#### Documentation
- Comprehensive README with:
  - Game concept and mechanics
  - Project structure overview
  - Quick start guide
  - Phase roadmap
  - Controls and how to play
- Development guide with:
  - Setup instructions
  - Architecture details
  - Common development tasks
  - Debugging tips
  - Performance optimization
  - Testing checklist
- Troubleshooting guide with:
  - Installation issues
  - Runtime problems
  - Performance solutions
  - Browser compatibility
- Changelog for version tracking

#### Developer Experience
- .gitignore for clean repository
- Bun workspace configuration
- Build scripts and development server
- TypeScript strict mode enabled
- Hot reload support

### Game Mechanics (Phase 1)

#### Working Features
- ✅ Isometric tilemap rendering
- ✅ Player movement (left/right)
- ✅ Jumping
- ✅ Tile triggering on player contact
- ✅ TNT transformation visual
- ✅ Explosion countdown (2.0s timer)
- ✅ Tile explosion animation
- ✅ Tile destruction
- ✅ Player death in explosion
- ✅ Player death from falling off map
- ✅ Death animation and restart
- ✅ Smooth camera following

### Planned Features

#### Phase 2 - Full Local Game (Next)
- Multi-layer tilemap (2-3 layers)
- Additional tile types (Cracked, Reinforced, Ice, Bounce, Trap)
- 2-4 local multiplayer with different control schemes
- Win condition (last player standing)
- Power-up system
- UI overlays (player indicators, timer, winner)

#### Phase 3 - Online Multiplayer
- Colyseus server implementation
- Room system (create, join by code, public matchmaking)
- State synchronization
- Client-side prediction
- Up to 8 players online
- Disconnect handling

#### Phase 4 - Polish
- Sound effects and music
- Particle effects
- Player customization
- Match statistics
- Spectator mode

## [Unreleased]

### Planned for v0.2.0 (Phase 2)
- Multi-layer tilemap system
- Layer-to-layer falling mechanics
- All 6 tile types functional
- 4-player local multiplayer
- Power-up spawning and collection
- Match timer and winner detection
- Player UI indicators

---

## Version History

- **v0.1.0** - Phase 1 Complete: Local single-player prototype with core mechanics
- **v0.2.0** - Phase 2 (Planned): Full local multiplayer game
- **v0.3.0** - Phase 3 (Planned): Online multiplayer support
- **v1.0.0** - Phase 4 (Planned): Polished release with all features
