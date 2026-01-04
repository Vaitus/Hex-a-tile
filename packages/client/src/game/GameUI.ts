import Phaser from 'phaser';
import { Player } from './Player';
import { GAME_CONFIG } from '@hex-a-boom/shared';

export class GameUI {
  private scene: Phaser.Scene;
  private timerText!: Phaser.GameObjects.Text;
  private playerStatusContainer!: Phaser.GameObjects.Container;
  private matchTimer: number = GAME_CONFIG.MATCH_DURATION;
  private playerStatusTexts: Map<number, Phaser.GameObjects.Text> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create() {
    // Create match timer
    this.timerText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      20,
      this.formatTime(this.matchTimer),
      {
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 4,
        fontStyle: 'bold',
      }
    );
    this.timerText.setOrigin(0.5, 0);
    this.timerText.setScrollFactor(0);
    this.timerText.setDepth(100000);

    // Create player status container
    this.playerStatusContainer = this.scene.add.container(10, 10);
    this.playerStatusContainer.setScrollFactor(0);
    this.playerStatusContainer.setDepth(100000);
  }

  updateTimer(deltaSeconds: number) {
    this.matchTimer -= deltaSeconds;
    if (this.matchTimer < 0) this.matchTimer = 0;

    this.timerText.setText(this.formatTime(this.matchTimer));

    // Change color when time is low
    if (this.matchTimer < 30) {
      this.timerText.setColor('#ff0000');
    } else if (this.matchTimer < 60) {
      this.timerText.setColor('#ffff00');
    } else {
      this.timerText.setColor('#ffffff');
    }
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  updatePlayerStatus(players: Player[]) {
    // Clear existing status texts
    this.playerStatusTexts.forEach((text) => text.destroy());
    this.playerStatusTexts.clear();
    this.playerStatusContainer.removeAll(true);

    let yOffset = 0;
    players.forEach((player, index) => {
      const statusText = this.scene.add.text(0, yOffset, '', {
        fontSize: '16px',
        color: player.isAlive ? GAME_CONFIG.PLAYER_COLORS[player.playerId] : '#666666',
        stroke: '#000',
        strokeThickness: 3,
      });

      let status = `P${player.playerId + 1}`;

      if (player.isAlive) {
        const effects: string[] = [];
        if (player.hasShield) effects.push('🛡️');
        if (player.speedBoostTimer > 0) effects.push('⚡');
        if (player.doubleJumpAvailable) effects.push('⬆️');
        if (player.freezeTimer > 0) effects.push('❄️');

        if (effects.length > 0) {
          status += ' ' + effects.join(' ');
        }
      } else {
        status += ' ☠️ DEAD';
      }

      statusText.setText(status);
      this.playerStatusContainer.add(statusText);
      this.playerStatusTexts.set(player.playerId, statusText);

      yOffset += 25;
    });
  }

  showWinner(winner: Player | null) {
    let text: string;
    let color: string;

    if (winner) {
      text = `PLAYER ${winner.playerId + 1} WINS!`;
      color = GAME_CONFIG.PLAYER_COLORS[winner.playerId];
    } else {
      text = 'DRAW!';
      color = '#ffffff';
    }

    const winnerText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      text,
      {
        fontSize: '64px',
        color: color,
        stroke: '#000',
        strokeThickness: 8,
        fontStyle: 'bold',
        align: 'center',
      }
    );
    winnerText.setOrigin(0.5);
    winnerText.setScrollFactor(0);
    winnerText.setDepth(100001);
    winnerText.setAlpha(0);

    // Fade in animation
    this.scene.tweens.add({
      targets: winnerText,
      alpha: 1,
      scale: { from: 0.5, to: 1 },
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Show restart message
    const restartText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY + 80,
      'Press R to restart',
      {
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 4,
        align: 'center',
      }
    );
    restartText.setOrigin(0.5);
    restartText.setScrollFactor(0);
    restartText.setDepth(100001);

    // Add restart functionality
    this.scene.input.keyboard?.once('keydown-R', () => {
      this.scene.scene.restart();
    });
  }

  showGameStart(playerCount: number) {
    const startText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      `${playerCount} PLAYERS\nREADY...`,
      {
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 6,
        fontStyle: 'bold',
        align: 'center',
      }
    );
    startText.setOrigin(0.5);
    startText.setScrollFactor(0);
    startText.setDepth(100001);

    // Countdown
    let countdown = 3;
    const timer = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        if (countdown > 0) {
          startText.setText(`${countdown}`);
          countdown--;
        } else {
          startText.setText('GO!');
          this.scene.time.delayedCall(500, () => {
            startText.destroy();
          });
        }
      },
      repeat: 3,
    });
  }

  isTimeUp(): boolean {
    return this.matchTimer <= 0;
  }

  destroy() {
    this.timerText.destroy();
    this.playerStatusContainer.destroy();
    this.playerStatusTexts.forEach((text) => text.destroy());
    this.playerStatusTexts.clear();
  }
}
