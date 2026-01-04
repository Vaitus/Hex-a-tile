import Phaser from 'phaser';
import { GAME_CONFIG, PowerUpType } from '@hex-a-boom/shared';
import { IsometricTilemap } from '../game/IsometricTilemap';
import { Player, ControlScheme } from '../game/Player';
import { PowerUp } from '../game/PowerUp';
import { GameUI } from '../game/GameUI';

export class GameScene extends Phaser.Scene {
  private tilemap!: IsometricTilemap;
  private players: Player[] = [];
  private powerUps: PowerUp[] = [];
  private gameUI!: GameUI;
  private keys: Map<string, Phaser.Input.Keyboard.Key> = new Map();

  private gameStarted: boolean = false;
  private gameEnded: boolean = false;
  private powerUpSpawnTimer: number = 0;
  private readonly POWER_UP_SPAWN_INTERVAL = 15; // seconds

  // Configuration
  private numPlayers: number = 2; // Default to 2 players

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { numPlayers?: number }) {
    this.numPlayers = data.numPlayers || 2;
    this.numPlayers = Math.min(Math.max(this.numPlayers, 1), GAME_CONFIG.MAX_LOCAL_PLAYERS);
  }

  create() {
    // Create isometric tilemap
    this.tilemap = new IsometricTilemap(this, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
    this.tilemap.create();

    // Create players
    this.createPlayers();

    // Set up input
    this.setupInput();

    // Create UI
    this.gameUI = new GameUI(this);

    // Camera setup - follow center of all players
    this.cameras.main.setBounds(
      -400,
      -400,
      GAME_CONFIG.MAP_WIDTH * GAME_CONFIG.TILE_WIDTH + 800,
      GAME_CONFIG.MAP_HEIGHT * GAME_CONFIG.TILE_HEIGHT + 800
    );

    // Show start countdown
    this.gameUI.showGameStart(this.numPlayers);

    // Start game after countdown
    this.time.delayedCall(4000, () => {
      this.gameStarted = true;
    });
  }

  private createPlayers() {
    // Starting positions spread across the map
    const startPositions = [
      { x: 3, y: 3 },   // Top-left
      { x: GAME_CONFIG.MAP_WIDTH - 4, y: 3 }, // Top-right
      { x: 3, y: GAME_CONFIG.MAP_HEIGHT - 4 }, // Bottom-left
      { x: GAME_CONFIG.MAP_WIDTH - 4, y: GAME_CONFIG.MAP_HEIGHT - 4 }, // Bottom-right
    ];

    for (let i = 0; i < this.numPlayers; i++) {
      const startPos = startPositions[i % startPositions.length];
      const screenPos = this.tilemap.tileToScreen(startPos.x, startPos.y, 1); // Start on layer 1

      const player = new Player(
        this,
        screenPos.x,
        screenPos.y,
        i,
        GAME_CONFIG.PLAYER_COLORS[i],
        GAME_CONFIG.CONTROL_SCHEMES[i]
      );

      this.players.push(player);
    }
  }

  private setupInput() {
    // Collect all unique keys from all control schemes
    const allKeys = new Set<string>();

    for (let i = 0; i < this.numPlayers; i++) {
      const scheme = GAME_CONFIG.CONTROL_SCHEMES[i];
      allKeys.add(scheme.left);
      allKeys.add(scheme.right);
      allKeys.add(scheme.jump);
      allKeys.add(scheme.down);
    }

    // Create key objects for all unique keys
    allKeys.forEach((keyName) => {
      const key = this.input.keyboard?.addKey(keyName);
      if (key) {
        this.keys.set(keyName, key);
      }
    });
  }

  update(time: number, delta: number) {
    if (!this.gameStarted || this.gameEnded) return;

    const deltaSeconds = delta / 1000;

    // Update tilemap (explosion timers, etc.)
    this.tilemap.update(deltaSeconds);

    // Update all players
    this.players.forEach((player) => {
      player.update(this.keys, deltaSeconds, this.tilemap);
      this.checkPlayerCollisions(player);
    });

    // Update camera to follow all alive players
    this.updateCamera();

    // Update UI
    this.gameUI.updateTimer(deltaSeconds);
    this.gameUI.updatePlayerStatus(this.players);

    // Spawn power-ups
    if (this.gameStarted) {
      this.powerUpSpawnTimer += deltaSeconds;
      if (this.powerUpSpawnTimer >= this.POWER_UP_SPAWN_INTERVAL) {
        this.spawnPowerUp();
        this.powerUpSpawnTimer = 0;
      }
    }

    // Check power-up collection
    this.checkPowerUpCollection();

    // Check win condition
    this.checkWinCondition();
  }

  private checkPlayerCollisions(player: Player) {
    if (!player.isAlive) return;

    const playerTilePos = this.getCurrentTilePosition(player);

    if (playerTilePos) {
      // Check if player is in explosion
      if (this.tilemap.isTileExploding(playerTilePos.x, playerTilePos.y, playerTilePos.layer)) {
        if (player.takeDamage()) {
          player.die();
        }
      }

      // Check if player fell off the map or is on a destroyed tile with no tile below
      const isOnDestroyedTile = this.tilemap.isTileDestroyed(
        playerTilePos.x,
        playerTilePos.y,
        playerTilePos.layer
      );

      if (isOnDestroyedTile) {
        // Check if there's a tile below to fall to
        let hasGroundBelow = false;
        for (let layer = playerTilePos.layer - 1; layer >= 0; layer--) {
          if (!this.tilemap.isTileDestroyed(playerTilePos.x, playerTilePos.y, layer)) {
            hasGroundBelow = true;
            player.currentLayer = layer;
            break;
          }
        }

        // If no ground below and falling fast, player dies
        if (!hasGroundBelow && player.sprite.body) {
          const body = player.sprite.body as Phaser.Physics.Arcade.Body;
          if (body.velocity.y > 300) {
            player.die();
          }
        }
      }
    }

    // Check if player fell off the map completely
    const bounds = this.tilemap.getMapBounds();
    if (
      player.sprite.y > bounds.bottom + 200 ||
      player.sprite.x < bounds.left - 200 ||
      player.sprite.x > bounds.right + 200
    ) {
      player.die();
    }
  }

  private getCurrentTilePosition(player: Player): { x: number; y: number; layer: number } | null {
    const screenTile = this.tilemap.screenToTile(player.sprite.x, player.sprite.y);
    if (screenTile) {
      return { x: screenTile.x, y: screenTile.y, layer: player.currentLayer };
    }
    return null;
  }

  private updateCamera() {
    // Find center point of all alive players
    const alivePlayers = this.players.filter((p) => p.isAlive);

    if (alivePlayers.length === 0) return;

    let centerX = 0;
    let centerY = 0;

    alivePlayers.forEach((player) => {
      centerX += player.sprite.x;
      centerY += player.sprite.y;
    });

    centerX /= alivePlayers.length;
    centerY /= alivePlayers.length;

    // Smoothly pan camera to center
    this.cameras.main.scrollX += (centerX - this.cameras.main.width / 2 - this.cameras.main.scrollX) * 0.1;
    this.cameras.main.scrollY += (centerY - this.cameras.main.height / 2 - this.cameras.main.scrollY) * 0.1;
  }

  private spawnPowerUp() {
    // Find a random valid tile position
    let attempts = 0;
    let validPosition = false;
    let tileX = 0;
    let tileY = 0;
    let layer = 1; // Spawn on upper layer

    while (!validPosition && attempts < 50) {
      tileX = Math.floor(Math.random() * GAME_CONFIG.MAP_WIDTH);
      tileY = Math.floor(Math.random() * GAME_CONFIG.MAP_HEIGHT);

      if (this.tilemap.canStandOnTile(tileX, tileY, layer)) {
        validPosition = true;
      }

      attempts++;
    }

    if (!validPosition) return;

    // Random power-up type
    const types = [PowerUpType.SHIELD, PowerUpType.SPEED, PowerUpType.DOUBLE_JUMP, PowerUpType.FREEZE];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const screenPos = this.tilemap.tileToScreen(tileX, tileY, layer);
    const powerUp = new PowerUp(this, screenPos.x, screenPos.y - 30, randomType);

    this.powerUps.push(powerUp);

    // Auto-remove power-up after 20 seconds if not collected
    this.time.delayedCall(20000, () => {
      const index = this.powerUps.indexOf(powerUp);
      if (index >= 0 && powerUp.isActive) {
        powerUp.destroy();
        this.powerUps.splice(index, 1);
      }
    });
  }

  private checkPowerUpCollection() {
    this.powerUps = this.powerUps.filter((powerUp) => {
      if (!powerUp.isActive) return false;

      const powerUpPos = powerUp.getPosition();

      // Check collision with any alive player
      for (const player of this.players) {
        if (!player.isAlive) continue;

        const distance = Phaser.Math.Distance.Between(
          player.sprite.x,
          player.sprite.y,
          powerUpPos.x,
          powerUpPos.y
        );

        if (distance < 30) {
          // Collect power-up
          this.applyPowerUp(player, powerUp.type);
          powerUp.collect();
          return false; // Remove from array
        }
      }

      return true; // Keep in array
    });
  }

  private applyPowerUp(player: Player, type: PowerUpType) {
    switch (type) {
      case PowerUpType.SHIELD:
        player.applyShield();
        break;
      case PowerUpType.SPEED:
        player.applySpeedBoost();
        break;
      case PowerUpType.DOUBLE_JUMP:
        player.applyDoubleJump();
        break;
      case PowerUpType.FREEZE:
        player.applyFreeze(this.tilemap);
        break;
    }
  }

  private checkWinCondition() {
    const alivePlayers = this.players.filter((p) => p.isAlive);

    // Game ends when 0 or 1 players remain, or time runs out
    if (
      (alivePlayers.length <= 1 && this.players.length > 1) ||
      this.gameUI.isTimeUp()
    ) {
      if (!this.gameEnded) {
        this.gameEnded = true;
        this.endGame(alivePlayers.length === 1 ? alivePlayers[0] : null);
      }
    }
  }

  private endGame(winner: Player | null) {
    // Stop all players
    this.players.forEach((player) => {
      if (player.sprite.body) {
        const body = player.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);
      }
    });

    // Show winner
    this.gameUI.showWinner(winner);
  }
}
