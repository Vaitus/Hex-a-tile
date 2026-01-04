# Development Guide

## Setting Up Development Environment

### 1. Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Start Development

```bash
# Terminal 1: Run the client
bun run dev:client

# The client will build and you can open the HTML file in your browser
# Look for: packages/client/public/index.html
```

## Project Architecture

### Monorepo Structure

This project uses Bun workspaces to manage multiple packages:

- **@hex-a-boom/shared**: Common types and constants
- **@hex-a-boom/client**: Phaser 3 game client
- **@hex-a-boom/server**: Colyseus server (Phase 3)

### Shared Package

Location: `packages/shared/`

Contains all shared code between client and server:

- **types.ts**: TypeScript interfaces and enums
  - `TileType`: Enum of all tile types
  - `TileState`: Tile lifecycle states
  - `PowerUpType`: Available power-ups
  - `Player`, `Tile`, `GameState` interfaces

- **config.ts**: Game configuration constants
  - Map dimensions
  - Tile timing and behavior
  - Player physics constants
  - Power-up settings
  - Control schemes

### Client Package

Location: `packages/client/`

Phaser 3 game implementation:

#### Key Files

**src/index.ts**
- Phaser game configuration
- Scene registration
- Physics setup

**src/scenes/GameScene.ts**
- Main game scene
- Coordinate game loop
- Player and tilemap instantiation
- Input handling
- Win/lose conditions

**src/game/IsometricTilemap.ts**
- Isometric tile rendering
- Tile state management
- Explosion timers
- Screen/tile coordinate conversion
- Tile triggering logic

**src/game/Player.ts**
- Player sprite and physics
- Movement controls
- Death animation
- Visual representation

## Development Workflow

### Adding a New Tile Type

1. Add enum value to `TileType` in `packages/shared/src/types.ts`
2. Add configuration in `TILE_CONFIG` in `packages/shared/src/config.ts`
3. Update tile rendering logic in `IsometricTilemap.renderTile()`
4. Add special behavior in `IsometricTilemap.onPlayerStep()` or `update()`

### Adding a New Power-Up

1. Add enum value to `PowerUpType` in `packages/shared/src/types.ts`
2. Add configuration in `GAME_CONFIG` in `packages/shared/src/config.ts`
3. Create power-up spawning logic
4. Implement collection and effect in `GameScene.ts`
5. Update player state in `Player.ts`

### Adding Local Multiplayer

1. Create multiple `Player` instances in `GameScene.create()`
2. Set up different control schemes from `GAME_CONFIG.CONTROL_SCHEMES`
3. Track all players in `GameScene.update()`
4. Implement win condition (last player alive)

## Debugging

### Enable Physics Debug

In `src/index.ts`, the physics debug is already enabled:

```typescript
physics: {
  default: 'arcade',
  arcade: {
    debug: true, // Shows collision boundaries
  },
}
```

### Common Issues

**Tiles not triggering:**
- Check `screenToTile()` conversion
- Verify player position is within tile bounds
- Ensure `onPlayerStep()` is being called

**Player falling through map:**
- Phaser Arcade Physics doesn't handle isometric collisions automatically
- Manual collision detection is implemented
- Check tile state isn't `DESTROYED`

**Explosion timing issues:**
- Timers use `deltaSeconds` (seconds, not milliseconds)
- Check `update()` is being called every frame
- Verify explosion timer configuration in `TILE_CONFIG`

## Building for Production

```bash
# Build client
bun run build:client

# Output will be in packages/client/dist/
```

## Testing

### Manual Testing Checklist (Phase 1)

- [ ] Player spawns in center of map
- [ ] Arrow keys move player correctly
- [ ] Jumping works with up arrow
- [ ] Stepping on tile triggers TNT transformation
- [ ] Timer counts down from 2.0 to 0.0
- [ ] Tile explodes and turns yellow briefly
- [ ] Tile disappears after explosion
- [ ] Player dies when caught in explosion
- [ ] Death animation plays
- [ ] "You Died" message appears
- [ ] Press R restarts the game
- [ ] Falling off map edge kills player
- [ ] Camera follows player smoothly

## Performance Optimization Tips

1. **Tile Rendering**: Use object pooling for tile graphics
2. **Physics**: Limit physics calculations to active area
3. **Graphics**: Use texture atlases for sprites
4. **Updates**: Only update visible tiles
5. **Networking**: Implement delta compression for state sync (Phase 3)

## Code Style

- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use enums for fixed sets of values
- Keep game logic in shared package when possible
- Comment complex isometric calculations
- Use descriptive variable names

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: description of changes"

# Push to remote
git push origin feature/your-feature-name
```

## Next Steps (Phase 2)

Priority tasks for Phase 2:

1. **Multi-layer tilemap**
   - Extend `IsometricTilemap` to support multiple layers
   - Implement layer switching and falling
   - Update camera to follow layer changes

2. **Additional tile types**
   - Start with Cracked tiles (easier)
   - Then Reinforced (state tracking)
   - Ice, Bounce, Trap (special physics)

3. **Local multiplayer**
   - Create array of players
   - Implement control scheme switching
   - Add player indicators

4. **Power-ups**
   - Create PowerUp class
   - Implement spawning logic
   - Add collection detection
   - Apply effects to players

## Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Bun Documentation](https://bun.sh/docs)
- [Isometric Game Tutorial](https://www.youtube.com/watch?v=04-xT8KoE0s)
- [Colyseus Documentation](https://docs.colyseus.io/) (for Phase 3)
