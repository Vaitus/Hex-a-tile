import Phaser from 'phaser';
import { GAME_CONFIG, TileType, TILE_CONFIG } from '@hex-a-boom/shared';
import { IsometricTilemap } from './IsometricTilemap';

export interface ControlScheme {
  left: string;
  right: string;
  jump: string;
  down: string;
}

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public playerId: number;
  public currentLayer: number = 1; // Start on upper layer
  public isAlive: boolean = true;

  // Power-ups
  public hasShield: boolean = false;
  public speedBoostTimer: number = 0;
  public doubleJumpAvailable: boolean = false;
  public freezeTimer: number = 0;

  private scene: Phaser.Scene;
  private color: string;
  private controlScheme: ControlScheme;
  private graphics: Phaser.GameObjects.Graphics;
  private shieldGraphics?: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;

  // Ice tile mechanics
  private onIceTile: boolean = false;
  private iceVelocityX: number = 0;

  // Jump tracking
  private hasJumped: boolean = false;
  private canDoubleJump: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    playerId: number,
    color: string,
    controlScheme: ControlScheme
  ) {
    this.scene = scene;
    this.playerId = playerId;
    this.color = color;
    this.controlScheme = controlScheme;

    // Create a simple colored circle for the player
    this.graphics = scene.add.graphics();
    this.renderPlayerGraphics();

    // Generate a texture from the graphics
    const textureKey = 'player-' + playerId;
    this.graphics.generateTexture(textureKey, GAME_CONFIG.PLAYER_SIZE, GAME_CONFIG.PLAYER_SIZE);
    this.graphics.destroy();

    // Create sprite with physics
    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setCollideWorldBounds(false);
    this.sprite.setBounce(0);
    this.sprite.setDepth(10000 + playerId); // Stack players

    // Create name label
    this.nameText = scene.add.text(0, 0, `P${playerId + 1}`, {
      fontSize: '14px',
      color: this.color,
      stroke: '#000',
      strokeThickness: 3,
      fontStyle: 'bold',
    });
    this.nameText.setOrigin(0.5);
    this.nameText.setDepth(10001 + playerId);
  }

  private renderPlayerGraphics() {
    const radius = GAME_CONFIG.PLAYER_SIZE / 2 - 2;
    const centerX = GAME_CONFIG.PLAYER_SIZE / 2;
    const centerY = GAME_CONFIG.PLAYER_SIZE / 2;

    // Draw player as a circle
    this.graphics.fillStyle(parseInt(this.color.replace('#', '0x')), 1);
    this.graphics.fillCircle(centerX, centerY, radius);

    // Draw outline
    this.graphics.lineStyle(2, 0x000000, 1);
    this.graphics.strokeCircle(centerX, centerY, radius);

    // Draw eyes
    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillCircle(centerX - 6, centerY - 4, 4);
    this.graphics.fillCircle(centerX + 6, centerY - 4, 4);

    this.graphics.fillStyle(0x000000, 1);
    this.graphics.fillCircle(centerX - 6, centerY - 4, 2);
    this.graphics.fillCircle(centerX + 6, centerY - 4, 2);
  }

  update(
    keys: Map<string, Phaser.Input.Keyboard.Key>,
    deltaSeconds: number,
    tilemap: IsometricTilemap
  ) {
    if (!this.isAlive) return;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Update power-up timers
    this.updatePowerUps(deltaSeconds, tilemap);

    // Get current tile position
    const playerTilePos = this.getCurrentTilePosition(tilemap);

    // Check tile interactions
    if (playerTilePos) {
      this.handleTileInteraction(playerTilePos, tilemap, body);
    }

    // Movement
    this.handleMovement(keys, body);

    // Update name label position
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 30);

    // Update shield visual
    this.updateShieldVisual();
  }

  private handleMovement(keys: Map<string, Phaser.Input.Keyboard.Key>, body: Phaser.Physics.Arcade.Body) {
    const leftKey = keys.get(this.controlScheme.left);
    const rightKey = keys.get(this.controlScheme.right);
    const jumpKey = keys.get(this.controlScheme.jump);

    let moveSpeed = GAME_CONFIG.PLAYER_MOVE_SPEED;

    // Apply speed boost
    if (this.speedBoostTimer > 0) {
      moveSpeed *= GAME_CONFIG.SPEED_BOOST_MULTIPLIER;
    }

    // Horizontal movement
    if (this.onIceTile) {
      // Ice tile: slippery movement
      if (leftKey?.isDown) {
        this.iceVelocityX = Math.max(this.iceVelocityX - 10, -moveSpeed);
      } else if (rightKey?.isDown) {
        this.iceVelocityX = Math.min(this.iceVelocityX + 10, moveSpeed);
      } else {
        // Gradual deceleration on ice
        this.iceVelocityX *= 0.95;
        if (Math.abs(this.iceVelocityX) < 5) this.iceVelocityX = 0;
      }
      body.setVelocityX(this.iceVelocityX);
    } else {
      // Normal movement
      if (leftKey?.isDown) {
        body.setVelocityX(-moveSpeed);
        this.iceVelocityX = -moveSpeed; // Store for ice tiles
      } else if (rightKey?.isDown) {
        body.setVelocityX(moveSpeed);
        this.iceVelocityX = moveSpeed; // Store for ice tiles
      } else {
        body.setVelocityX(0);
        this.iceVelocityX = 0;
      }
    }

    // Jump mechanics
    const isOnGround = body.touching.down;

    if (isOnGround) {
      this.hasJumped = false;
      if (this.doubleJumpAvailable) {
        this.canDoubleJump = true;
      }
    }

    if (jumpKey?.isDown && !this.hasJumped) {
      if (isOnGround) {
        // First jump
        body.setVelocityY(GAME_CONFIG.PLAYER_JUMP_VELOCITY);
        this.hasJumped = true;
      } else if (this.canDoubleJump) {
        // Double jump
        body.setVelocityY(GAME_CONFIG.PLAYER_JUMP_VELOCITY);
        this.canDoubleJump = false;
        this.doubleJumpAvailable = false; // Consume double jump power-up
      }
    }

    if (jumpKey?.isUp) {
      this.hasJumped = false;
    }
  }

  private handleTileInteraction(
    tilePos: { x: number; y: number; layer: number },
    tilemap: IsometricTilemap,
    body: Phaser.Physics.Arcade.Body
  ) {
    const tile = tilemap.getTileAt(tilePos.x, tilePos.y, tilePos.layer);
    if (!tile) return;

    // Check if standing on tile
    const isOnGround = body.touching.down;

    if (isOnGround) {
      // Trigger tile
      tilemap.onPlayerStep(tilePos.x, tilePos.y, tilePos.layer);

      // Handle special tile types
      switch (tile.type) {
        case TileType.ICE:
          this.onIceTile = true;
          break;

        case TileType.BOUNCE:
          // Spring player upward
          if (tilePos.layer < GAME_CONFIG.MAP_LAYERS - 1) {
            const bounceForce = TILE_CONFIG[TileType.BOUNCE].bounceForce || 600;
            body.setVelocityY(-bounceForce);
            this.currentLayer = tilePos.layer + 1;
          }
          this.onIceTile = false;
          break;

        default:
          this.onIceTile = false;
          break;
      }

      // Check if tile is destroyed below player - fall to lower layer
      if (tilemap.isTileDestroyed(tilePos.x, tilePos.y, tilePos.layer)) {
        if (tilePos.layer > 0) {
          this.currentLayer = tilePos.layer - 1;
        }
      }
    }
  }

  private updatePowerUps(deltaSeconds: number, tilemap: IsometricTilemap) {
    // Speed boost timer
    if (this.speedBoostTimer > 0) {
      this.speedBoostTimer -= deltaSeconds;
      if (this.speedBoostTimer <= 0) {
        this.speedBoostTimer = 0;
      }
    }

    // Freeze timer
    if (this.freezeTimer > 0) {
      this.freezeTimer -= deltaSeconds;
      if (this.freezeTimer <= 0) {
        this.freezeTimer = 0;
        // Unfreeze tiles
        const tilePos = this.getCurrentTilePosition(tilemap);
        if (tilePos) {
          tilemap.unpauseTilesInRadius(
            tilePos.x,
            tilePos.y,
            tilePos.layer,
            GAME_CONFIG.FREEZE_RADIUS
          );
        }
      }
    }
  }

  private getCurrentTilePosition(tilemap: IsometricTilemap): { x: number; y: number; layer: number } | null {
    // Use screen-to-tile conversion with current layer
    const screenTile = tilemap.screenToTile(this.sprite.x, this.sprite.y);
    if (screenTile) {
      return { x: screenTile.x, y: screenTile.y, layer: this.currentLayer };
    }
    return null;
  }

  applyShield() {
    this.hasShield = true;
  }

  applySpeedBoost() {
    this.speedBoostTimer = GAME_CONFIG.SPEED_BOOST_DURATION;
  }

  applyDoubleJump() {
    this.doubleJumpAvailable = true;
    this.canDoubleJump = false; // Will be set to true when landing
  }

  applyFreeze(tilemap: IsometricTilemap) {
    this.freezeTimer = GAME_CONFIG.FREEZE_DURATION;
    const tilePos = this.getCurrentTilePosition(tilemap);
    if (tilePos) {
      tilemap.pauseTilesInRadius(tilePos.x, tilePos.y, tilePos.layer, GAME_CONFIG.FREEZE_RADIUS);
    }
  }

  private updateShieldVisual() {
    if (this.hasShield) {
      if (!this.shieldGraphics) {
        this.shieldGraphics = this.scene.add.graphics();
        this.shieldGraphics.setDepth(this.sprite.depth - 1);
      }

      this.shieldGraphics.clear();
      this.shieldGraphics.lineStyle(3, 0x00ffff, 0.7);
      this.shieldGraphics.strokeCircle(this.sprite.x, this.sprite.y, 20);
    } else if (this.shieldGraphics) {
      this.shieldGraphics.destroy();
      this.shieldGraphics = undefined;
    }
  }

  takeDamage(): boolean {
    if (this.hasShield) {
      this.hasShield = false;
      return false; // Shield absorbed the damage
    }
    return true; // Player takes damage
  }

  die() {
    if (!this.isAlive) return;

    this.isAlive = false;
    this.sprite.setTint(0x666666);
    this.sprite.setAlpha(0.5);
    this.nameText.setAlpha(0.5);

    if (this.shieldGraphics) {
      this.shieldGraphics.destroy();
      this.shieldGraphics = undefined;
    }

    // Play death animation
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y + 200,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
    });

    this.scene.tweens.add({
      targets: this.nameText,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
    });
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
    if (this.shieldGraphics) {
      this.shieldGraphics.destroy();
    }
  }
}
