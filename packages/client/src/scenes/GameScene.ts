import Phaser from 'phaser';
import { GAME_CONFIG, TILE_CONFIG, TileType, TileState } from '@hex-a-boom/shared';
import { IsometricTilemap } from '../game/IsometricTilemap';
import { Player } from '../game/Player';

export class GameScene extends Phaser.Scene {
  private tilemap!: IsometricTilemap;
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Create isometric tilemap
    this.tilemap = new IsometricTilemap(this, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
    this.tilemap.create();

    // Create player
    const startX = GAME_CONFIG.MAP_WIDTH / 2;
    const startY = GAME_CONFIG.MAP_HEIGHT / 2;
    const screenPos = this.tilemap.tileToScreen(startX, startY, 0);

    this.player = new Player(this, screenPos.x, screenPos.y, '#FF6B6B');

    // Set up input
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Camera setup
    this.cameras.main.setBounds(
      -400,
      -400,
      GAME_CONFIG.MAP_WIDTH * GAME_CONFIG.TILE_WIDTH + 800,
      GAME_CONFIG.MAP_HEIGHT * GAME_CONFIG.TILE_HEIGHT + 800
    );
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
  }

  update(time: number, delta: number) {
    const deltaSeconds = delta / 1000;

    // Update player
    this.player.update(this.cursors, deltaSeconds);

    // Check tile collision
    const playerTilePos = this.tilemap.screenToTile(
      this.player.sprite.x,
      this.player.sprite.y
    );

    if (playerTilePos) {
      this.tilemap.onPlayerStep(playerTilePos.x, playerTilePos.y, 0);
    }

    // Update tilemap (explosion timers, etc.)
    this.tilemap.update(deltaSeconds);

    // Check if player is in explosion
    if (playerTilePos && this.tilemap.isTileExploding(playerTilePos.x, playerTilePos.y, 0)) {
      this.player.die();
    }

    // Check if player fell off the map
    const bounds = this.tilemap.getMapBounds();
    if (
      this.player.sprite.y > bounds.bottom + 200 ||
      this.player.sprite.x < bounds.left - 200 ||
      this.player.sprite.x > bounds.right + 200
    ) {
      this.player.die();
    }
  }
}
