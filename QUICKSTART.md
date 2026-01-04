# Quick Start Guide

Get Hex-A-Boom running in 3 minutes!

## 🚀 Installation (30 seconds)

```bash
# 1. Install Bun (if you haven't already)
curl -fsSL https://bun.sh/install | bash

# 2. Clone and setup
cd Hex-a-tile
bun install
```

## 🎮 Running the Game (10 seconds)

```bash
# Build and start the development server
bun run dev:client

# Open your browser to http://localhost:3000
```

Or open `packages/client/public/index.html` directly after building:

```bash
cd packages/client
bun run build
# Open public/index.html in your browser
```

## 🎯 How to Play

### Objective
**Be the last one standing!** Don't get caught in explosions or fall off the map.

### Controls
- **←→ Arrow Keys**: Move left/right
- **↑ Arrow Key**: Jump
- **R Key**: Restart after death

### Game Rules

1. **Stepping on tiles makes them explode**
   - Normal tiles turn into TNT when you step on them
   - A timer appears showing countdown (2.0 seconds)
   - Tile explodes, turns yellow briefly, then disappears

2. **Avoid explosions**
   - If you're on an exploding tile, you die
   - Watch the timers and move to safe ground

3. **Don't fall off**
   - Falling off the edge of the map = death
   - Missing tiles create gaps you can fall through

4. **When you die**
   - Death animation plays
   - "YOU DIED" message appears
   - Press **R** to restart

### Tips for Survival

- 🏃 **Keep moving** - Standing still is death
- 👀 **Watch the timers** - Plan your path ahead
- 🎯 **Use the whole map** - Don't corner yourself
- ⏱️ **2 second rule** - You have 2 seconds after stepping on a tile
- 🦘 **Jump wisely** - You can jump over small gaps

## 🛠️ Development Mode

### File Structure (What You Need to Know)

```
Hex-a-tile/
├── packages/
│   ├── shared/       # Game rules and constants
│   │   └── src/
│   │       ├── config.ts   # Tweak game settings here!
│   │       └── types.ts    # Game data structures
│   │
│   └── client/       # The game itself
│       └── src/
│           ├── index.ts           # Phaser setup
│           ├── scenes/
│           │   └── GameScene.ts   # Main game logic
│           └── game/
│               ├── IsometricTilemap.ts  # Map rendering
│               └── Player.ts            # Player controls
│
└── README.md         # Full documentation
```

### Quick Tweaks

**Make tiles explode faster/slower:**
```typescript
// In packages/shared/src/config.ts
NORMAL_TILE_EXPLOSION_TIME: 1.0,  // Change from 2.0 to 1.0
```

**Make player move faster:**
```typescript
// In packages/shared/src/config.ts
PLAYER_MOVE_SPEED: 300,  // Change from 200 to 300
```

**Make player jump higher:**
```typescript
// In packages/shared/src/config.ts
PLAYER_JUMP_VELOCITY: -600,  // Change from -400 to -600 (more negative = higher)
```

**Change map size:**
```typescript
// In packages/shared/src/config.ts
MAP_WIDTH: 20,   // Change from 15
MAP_HEIGHT: 15,  // Change from 10
```

**After making changes:**
```bash
# Rebuild the client
cd packages/client
bun run build

# Refresh your browser
```

## 🐛 Something Not Working?

### Game won't start
```bash
# Try reinstalling
rm -rf node_modules bun.lockb
bun install
```

### Black screen
- Check browser console (F12) for errors
- Make sure you built the client: `bun run build:client`

### Tiles not appearing
- Clear browser cache and refresh
- Check that Phaser loaded: look for "Phaser v3.70" in console

### Player not moving
- Click on the game canvas first
- Make sure you're using **Arrow keys** (not WASD in Phase 1)

### More help
- See TROUBLESHOOTING.md for detailed solutions
- Check browser console (F12) for error messages

## 📚 Next Steps

### Learn More
- **README.md** - Full game documentation and roadmap
- **DEVELOPMENT.md** - Architecture and development guide
- **TROUBLESHOOTING.md** - Common issues and solutions

### Current Phase: Phase 1 ✅
Single player prototype with core mechanics

### Coming Next: Phase 2
- Multiple layers you can fall through
- More tile types (Ice, Bounce, Trap, etc.)
- 2-4 player local multiplayer
- Power-ups (Shield, Speed Boost, etc.)

### Future Phases
- **Phase 3**: Online multiplayer (up to 8 players)
- **Phase 4**: Polish, effects, customization

## 🎉 Have Fun!

The game is playable right now! Try to survive as long as possible.

**Challenge yourself:**
- How long can you survive?
- Can you destroy all the tiles?
- How few tiles can you leave standing?

**Pro tip:** Try to create patterns where tiles explode in a chain reaction! 💥
