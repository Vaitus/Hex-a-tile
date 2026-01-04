import Phaser from 'phaser';
import { PowerUpType, GAME_CONFIG } from '@hex-a-boom/shared';

export class PowerUp {
  public sprite: Phaser.GameObjects.Graphics;
  public type: PowerUpType;
  public id: string;
  public isActive: boolean = true;
  private scene: Phaser.Scene;
  private icon: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType) {
    this.scene = scene;
    this.type = type;
    this.id = `powerup_${Date.now()}_${Math.random()}`;

    // Create graphics
    this.sprite = scene.add.graphics();
    this.sprite.setPosition(x, y);
    this.sprite.setDepth(9000);

    // Draw power-up based on type
    this.renderPowerUp();

    // Create icon text
    this.icon = scene.add.text(x, y, this.getPowerUpIcon(), {
      fontSize: '20px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    });
    this.icon.setOrigin(0.5);
    this.icon.setDepth(9001);

    // Floating animation
    scene.tweens.add({
      targets: [this.sprite, this.icon],
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Rotation animation
    scene.tweens.add({
      targets: this.icon,
      angle: 360,
      duration: 3000,
      repeat: -1,
      ease: 'Linear',
    });
  }

  private renderPowerUp() {
    const radius = 16;
    let color: number;

    switch (this.type) {
      case PowerUpType.SHIELD:
        color = 0x00ffff; // Cyan
        break;
      case PowerUpType.SPEED:
        color = 0xffff00; // Yellow
        break;
      case PowerUpType.DOUBLE_JUMP:
        color = 0xff00ff; // Magenta
        break;
      case PowerUpType.FREEZE:
        color = 0x00ff00; // Green
        break;
      default:
        color = 0xffffff;
    }

    // Draw outer glow
    this.sprite.fillStyle(color, 0.3);
    this.sprite.fillCircle(0, 0, radius + 4);

    // Draw main circle
    this.sprite.fillStyle(color, 0.8);
    this.sprite.fillCircle(0, 0, radius);

    // Draw outline
    this.sprite.lineStyle(2, 0xffffff, 1);
    this.sprite.strokeCircle(0, 0, radius);
  }

  private getPowerUpIcon(): string {
    switch (this.type) {
      case PowerUpType.SHIELD:
        return '🛡️';
      case PowerUpType.SPEED:
        return '⚡';
      case PowerUpType.DOUBLE_JUMP:
        return '⬆️';
      case PowerUpType.FREEZE:
        return '❄️';
      default:
        return '?';
    }
  }

  collect() {
    if (!this.isActive) return;

    this.isActive = false;

    // Play collection animation
    this.scene.tweens.add({
      targets: [this.sprite, this.icon],
      scale: 1.5,
      alpha: 0,
      duration: 300,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.destroy();
      },
    });
  }

  destroy() {
    this.sprite.destroy();
    this.icon.destroy();
  }

  getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }
}
