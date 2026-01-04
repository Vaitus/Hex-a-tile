# Troubleshooting Guide

## Installation Issues

### NPM Registry 401 Errors

**Problem**: Getting 401 Unauthorized when running `bun install`

**Solution**:
```bash
# Clear Bun cache
rm -rf ~/.bun/install/cache

# Try installing again
bun install

# If still failing, check network/proxy settings
# Or try using npm instead:
npm install
```

### Workspace Resolution Errors

**Problem**: `@hex-a-boom/shared` not found

**Solution**:
```bash
# Make sure you're in the root directory
cd /path/to/hex-a-boom

# Reinstall dependencies
rm -rf node_modules
rm bun.lockb
bun install
```

## Runtime Issues

### Game Won't Start

**Checklist**:
1. Did you run `bun install`?
2. Did you build the client with `bun run build:client`?
3. Is the server running with `bun run dev:client`?
4. Check browser console for errors

### Black Screen

**Problem**: Game loads but shows black screen

**Possible Causes**:
1. Phaser failed to initialize
2. WebGL not supported in browser
3. JavaScript errors preventing scene creation

**Solution**:
```bash
# Check browser console (F12)
# Look for WebGL errors

# Try forcing Canvas mode instead of WebGL
# In src/index.ts, change:
type: Phaser.CANVAS,  // instead of Phaser.AUTO
```

### Tiles Not Rendering

**Problem**: Map is empty, no tiles visible

**Debug Steps**:
1. Check browser console for errors
2. Verify `IsometricTilemap.create()` is being called
3. Check if graphics are being created in `createTileGraphics()`
4. Verify tile positions with debug logging:

```typescript
// In IsometricTilemap.createTileGraphics()
console.log('Creating tile at', tile.position, 'screen pos:', screenPos);
```

### Player Not Moving

**Problem**: Player visible but doesn't respond to controls

**Debug Steps**:
1. Check if cursors are being created: `console.log(this.cursors)`
2. Verify physics is enabled: check `player.sprite.body`
3. Make sure `update()` is being called every frame
4. Check if player is alive: `console.log(this.player.isAlive)`

### Tiles Not Triggering

**Problem**: Walking on tiles doesn't make them explode

**Debug Steps**:
1. Check `screenToTile()` conversion is working
2. Add debug logging in `onPlayerStep()`:

```typescript
// In GameScene.update()
if (playerTilePos) {
  console.log('Player at tile:', playerTilePos);
  this.tilemap.onPlayerStep(playerTilePos.x, playerTilePos.y, 0);
}
```

3. Verify tile state changes in `IsometricTilemap.onPlayerStep()`

### Explosion Timer Not Counting Down

**Problem**: Timer shows 2.0 but never decreases

**Debug Steps**:
1. Verify `delta` parameter in update is correct
2. Check `deltaSeconds` calculation: `delta / 1000`
3. Add logging: `console.log('Delta:', deltaSeconds, 'Timer:', tile.explosionTimer)`
4. Make sure tiles aren't paused: `tile.isPaused === false`

## Performance Issues

### Low FPS / Stuttering

**Causes and Solutions**:

1. **Too many graphics objects**
   - Solution: Implement object pooling for tiles
   - Only render visible tiles

2. **Physics debug enabled**
   - Solution: Disable debug in production
   ```typescript
   physics: {
     arcade: {
       debug: false, // Set to false
     }
   }
   ```

3. **Browser performance**
   - Try different browser (Chrome usually fastest)
   - Close other tabs
   - Disable browser extensions

### Memory Leaks

**Problem**: Game slows down over time

**Solution**:
- Destroy graphics when tiles are destroyed
- Clean up tweens and timers
- Remove event listeners properly

```typescript
// In IsometricTilemap, add cleanup method
destroy() {
  this.tileGraphics.forEach(g => g.destroy());
  this.tileTexts.forEach(t => t.destroy());
  this.tileGraphics.clear();
  this.tileTexts.clear();
}
```

## Development Issues

### Hot Reload Not Working

**Problem**: Changes don't appear without manual restart

**Solution**:
```bash
# Use watch mode instead
bun run watch

# In another terminal
bun run server.ts

# Manually refresh browser after changes
```

### TypeScript Errors

**Problem**: Type errors in IDE but code runs

**Solution**:
```bash
# Rebuild TypeScript definitions
bun run build

# Restart TypeScript server in IDE
# VS Code: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

### Shared Package Not Updating

**Problem**: Changes to shared package don't appear in client

**Solution**:
```bash
# From root directory
rm -rf node_modules
rm bun.lockb
bun install

# Or reinstall just the workspace
cd packages/client
rm -rf node_modules
cd ../..
bun install
```

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+ (Best performance)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ IE 11 (Not supported)

### Mobile Support

Phase 1 is desktop only. Mobile support planned for Phase 4.

## Common Error Messages

### "Cannot read property 'body' of undefined"

**Cause**: Trying to access physics body before it's created

**Solution**: Make sure sprite is created with `this.physics.add.sprite()`

### "Maximum call stack size exceeded"

**Cause**: Infinite recursion, usually in coordinate conversion

**Solution**: Check `tileToScreen()` and `screenToTile()` implementations

### "Scene not found: GameScene"

**Cause**: Scene not registered in Phaser config

**Solution**: Verify scene is in config.scene array:
```typescript
scene: [GameScene],
```

## Getting Help

If you're still stuck:

1. Check browser console for errors (F12)
2. Enable Phaser debug rendering
3. Add console.log statements to track execution
4. Create a minimal reproduction
5. Check DEVELOPMENT.md for architecture details

## Reporting Bugs

When reporting issues, include:

1. Bun version: `bun --version`
2. Browser and version
3. Operating system
4. Error messages (full stack trace)
5. Steps to reproduce
6. Expected vs actual behavior
