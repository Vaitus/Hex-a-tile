import Phaser from 'phaser';
import { GAME_CONFIG } from '@hex-a-boom/shared';

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private color: string;
  private isAlive: boolean = true;
  private graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, color: string) {
    this.scene = scene;
    this.color = color;

    // Create a simple colored circle for the player
    this.graphics = scene.add.graphics();
    this.renderPlayerGraphics();

    // Generate a texture from the graphics
    this.graphics.generateTexture('player-' + color, GAME_CONFIG.PLAYER_SIZE, GAME_CONFIG.PLAYER_SIZE);
    this.graphics.destroy();

    // Create sprite with physics
    this.sprite = scene.physics.add.sprite(x, y, 'player-' + color);
    this.sprite.setCollideWorldBounds(false);
    this.sprite.setBounce(0);
    this.sprite.setDepth(10000); // Always on top
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

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, deltaSeconds: number) {
    if (!this.isAlive) return;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Horizontal movement
    if (cursors.left?.isDown) {
      body.setVelocityX(-GAME_CONFIG.PLAYER_MOVE_SPEED);
    } else if (cursors.right?.isDown) {
      body.setVelocityX(GAME_CONFIG.PLAYER_MOVE_SPEED);
    } else {
      body.setVelocityX(0);
    }

    // Jump
    if (cursors.up?.isDown && body.touching.down) {
      body.setVelocityY(GAME_CONFIG.PLAYER_JUMP_VELOCITY);
    }
  }

  die() {
    if (!this.isAlive) return;

    this.isAlive = false;
    this.sprite.setTint(0x666666);
    this.sprite.setAlpha(0.5);

    // Play death animation
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y + 200,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        // Show "You Died" message
        const text = this.scene.add.text(
          this.scene.cameras.main.centerX,
          this.scene.cameras.main.centerY,
          'YOU DIED!\nPress R to restart',
          {
            fontSize: '48px',
            color: '#ff0000',
            stroke: '#000',
            strokeThickness: 6,
            align: 'center',
          }
        );
        text.setOrigin(0.5);
        text.setScrollFactor(0);
        text.setDepth(100000);

        // Add restart functionality
        this.scene.input.keyboard?.once('keydown-R', () => {
          this.scene.scene.restart();
        });
      },
    });
  }
}
