import Phaser from 'phaser';
import { GAME_CONFIG, TILE_CONFIG, TileType, TileState, Tile } from '@hex-a-boom/shared';

export class IsometricTilemap {
  private scene: Phaser.Scene;
  private width: number;
  private height: number;
  private tiles: Tile[][][] = []; // [layer][y][x]
  private tileGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map();
  private tileTexts: Map<string, Phaser.GameObjects.Text> = new Map();

  constructor(scene: Phaser.Scene, width: number, height: number) {
    this.scene = scene;
    this.width = width;
    this.height = height;
  }

  create() {
    // Initialize tiles for single layer (Phase 1)
    this.tiles[0] = [];
    for (let y = 0; y < this.height; y++) {
      this.tiles[0][y] = [];
      for (let x = 0; x < this.width; x++) {
        const tile: Tile = {
          type: TileType.NORMAL,
          state: TileState.NORMAL,
          position: { x, y, layer: 0 },
          triggerCount: 0,
          explosionTimer: 0,
          isPaused: false,
        };
        this.tiles[0][y][x] = tile;
        this.createTileGraphics(tile);
      }
    }
  }

  private createTileGraphics(tile: Tile) {
    const screenPos = this.tileToScreen(tile.position.x, tile.position.y, tile.position.layer);
    const key = this.getTileKey(tile.position.x, tile.position.y, tile.position.layer);

    // Create graphics for the tile
    const graphics = this.scene.add.graphics();
    graphics.setDepth(tile.position.layer * 1000 + tile.position.y * 10);
    this.tileGraphics.set(key, graphics);

    // Create text for timer display
    const text = this.scene.add.text(screenPos.x, screenPos.y - 10, '', {
      fontSize: '16px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    });
    text.setOrigin(0.5);
    text.setDepth(tile.position.layer * 1000 + tile.position.y * 10 + 1);
    this.tileTexts.set(key, text);

    this.renderTile(tile);
  }

  private renderTile(tile: Tile) {
    const key = this.getTileKey(tile.position.x, tile.position.y, tile.position.layer);
    const graphics = this.tileGraphics.get(key);
    const text = this.tileTexts.get(key);

    if (!graphics || !text) return;

    graphics.clear();

    if (tile.state === TileState.DESTROYED) {
      text.setText('');
      return;
    }

    const screenPos = this.tileToScreen(tile.position.x, tile.position.y, tile.position.layer);
    const tileW = GAME_CONFIG.TILE_WIDTH;
    const tileH = GAME_CONFIG.TILE_HEIGHT;

    // Get color based on tile type
    let color = TILE_CONFIG[tile.type]?.color || 0x8B4513;

    if (tile.state === TileState.TRIGGERED || tile.type === TileType.TNT) {
      color = TILE_CONFIG[TileType.TNT].color;
    } else if (tile.state === TileState.EXPLODING) {
      color = 0xFFFF00; // Yellow for explosion
    }

    // Draw isometric tile (diamond shape)
    graphics.fillStyle(color, 1);
    graphics.beginPath();
    graphics.moveTo(screenPos.x, screenPos.y - tileH / 2); // Top
    graphics.lineTo(screenPos.x + tileW / 2, screenPos.y); // Right
    graphics.lineTo(screenPos.x, screenPos.y + tileH / 2); // Bottom
    graphics.lineTo(screenPos.x - tileW / 2, screenPos.y); // Left
    graphics.closePath();
    graphics.fillPath();

    // Draw outline
    graphics.lineStyle(2, 0x000000, 0.5);
    graphics.strokePath();

    // Update timer text
    if (tile.state === TileState.TRIGGERED && tile.explosionTimer > 0) {
      text.setText(tile.explosionTimer.toFixed(1));
      text.setPosition(screenPos.x, screenPos.y - 10);
    } else {
      text.setText('');
    }
  }

  onPlayerStep(x: number, y: number, layer: number) {
    if (!this.isValidTile(x, y, layer)) return;

    const tile = this.tiles[layer][y][x];
    if (tile.state === TileState.NORMAL) {
      tile.triggerCount++;

      const config = TILE_CONFIG[tile.type];
      if (config && tile.triggerCount >= config.requiredSteps) {
        tile.state = TileState.TRIGGERED;
        tile.explosionTimer = config.explosionTime;
        this.renderTile(tile);
      }
    }
  }

  update(deltaSeconds: number) {
    // Update all triggered tiles
    for (let layer = 0; layer < this.tiles.length; layer++) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const tile = this.tiles[layer][y][x];

          if (tile.state === TileState.TRIGGERED && !tile.isPaused) {
            tile.explosionTimer -= deltaSeconds;

            if (tile.explosionTimer <= 0) {
              tile.state = TileState.EXPLODING;
              this.renderTile(tile);

              // Schedule destruction after a brief explosion animation
              this.scene.time.delayedCall(300, () => {
                tile.state = TileState.DESTROYED;
                this.renderTile(tile);
              });
            } else {
              this.renderTile(tile);
            }
          }
        }
      }
    }
  }

  isTileExploding(x: number, y: number, layer: number): boolean {
    if (!this.isValidTile(x, y, layer)) return false;
    return this.tiles[layer][y][x].state === TileState.EXPLODING;
  }

  tileToScreen(x: number, y: number, layer: number): { x: number; y: number } {
    const tileW = GAME_CONFIG.TILE_WIDTH;
    const tileH = GAME_CONFIG.TILE_HEIGHT;

    // Isometric projection
    const screenX = (x - y) * (tileW / 2) + 400;
    const screenY = (x + y) * (tileH / 2) + 100 - layer * 50;

    return { x: screenX, y: screenY };
  }

  screenToTile(screenX: number, screenY: number): { x: number; y: number } | null {
    const tileW = GAME_CONFIG.TILE_WIDTH;
    const tileH = GAME_CONFIG.TILE_HEIGHT;

    // Reverse isometric projection (for layer 0)
    const adjustedX = screenX - 400;
    const adjustedY = screenY - 100;

    const tileX = Math.floor((adjustedX / (tileW / 2) + adjustedY / (tileH / 2)) / 2);
    const tileY = Math.floor((adjustedY / (tileH / 2) - adjustedX / (tileW / 2)) / 2);

    if (this.isValidTile(tileX, tileY, 0)) {
      return { x: tileX, y: tileY };
    }

    return null;
  }

  private isValidTile(x: number, y: number, layer: number): boolean {
    return (
      layer >= 0 &&
      layer < this.tiles.length &&
      y >= 0 &&
      y < this.height &&
      x >= 0 &&
      x < this.width
    );
  }

  private getTileKey(x: number, y: number, layer: number): string {
    return `${layer}_${y}_${x}`;
  }

  getMapBounds(): { left: number; right: number; top: number; bottom: number } {
    const topLeft = this.tileToScreen(0, 0, 0);
    const topRight = this.tileToScreen(this.width - 1, 0, 0);
    const bottomLeft = this.tileToScreen(0, this.height - 1, 0);
    const bottomRight = this.tileToScreen(this.width - 1, this.height - 1, 0);

    return {
      left: Math.min(topLeft.x, bottomLeft.x) - GAME_CONFIG.TILE_WIDTH / 2,
      right: Math.max(topRight.x, bottomRight.x) + GAME_CONFIG.TILE_WIDTH / 2,
      top: Math.min(topLeft.y, topRight.y) - GAME_CONFIG.TILE_HEIGHT / 2,
      bottom: Math.max(bottomLeft.y, bottomRight.y) + GAME_CONFIG.TILE_HEIGHT / 2,
    };
  }
}
