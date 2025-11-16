import { palabra } from '../../Control-de-voz.js';
import { mazesConfig, levelConfig, buildMaze } from '../config/mazes.config.js';
import { playerConfig, playerMovement } from '../config/player.config.js';

export class Level3Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3Scene' });
        this.level = 3;
        this.showWallsDebug = true;
    }

    preload() {
        this.load.spritesheet(
            playerConfig.sprite.key,
            playerConfig.sprite.path,
            playerConfig.sprite.frameConfig
        );
        this.load.audio(
            playerConfig.sound.key,
            playerConfig.sound.path
        );
        this.load.image('hospitalWall', './Assets/Background/wall.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#8b7355');
        this.walls = this.physics.add.staticGroup();
        buildMaze(this, 'hospitalWall');
        if (this.showWallsDebug) this.drawWallsDebug();
        this.createPlayer();
        this.createAnimations();
        this.createEnemies();
        this.createControls();

        this.levelText = this.add.text(16, 16, `Nivel: ${this.level}`, {
            fontSize: '24px',
            fill: '#fff',
            fontStyle: 'bold'
        });

        this.physics.add.collider(this.jugador, this.walls);
        this.enemies.forEach(enemy => {
            this.physics.add.collider(enemy, this.walls);
            this.physics.add.overlap(this.jugador, enemy, this.hitEnemy, null, this);
        });
        this.physics.add.overlap(this.jugador, this.goal, this.reachGoal, null, this);
    }

    createPlayer() {
        const { startPos } = levelConfig;
        this.jugador = this.add.circle(startPos.x, startPos.y, 15, 0x3498db);
        this.physics.add.existing(this.jugador);
        this.jugador.body.setCollideWorldBounds(true);
        this.sonidoPasos = this.sound.add(playerConfig.sound.key, playerConfig.sound.config);
    }

    createAnimations() {
        Object.entries(playerConfig.animations).forEach(([key, anim]) => {
            if (!this.anims.exists(key)) {
                this.anims.create({
                    key: key,
                    frames: this.anims.generateFrameNumbers(playerConfig.sprite.key, { start: anim.start, end: anim.end }),
                    frameRate: anim.frameRate,
                    repeat: anim.repeat
                });
            }
        });
    }

    createEnemies() {
        this.enemies = [];
        const { startPos, enemySpeedBase, enemySpeedIncrement } = levelConfig;

        for (let i = 0; i < this.level; i++) {
            let validPosition = false;
            let x, y;

            while (!validPosition) {
                x = Phaser.Math.Between(100, 700);
                y = Phaser.Math.Between(100, 500);
                const distance = Phaser.Math.Distance.Between(x, y, startPos.x, startPos.y);

                const testCircle = this.add.circle(x, y, 12);
                this.physics.add.existing(testCircle);
                const overlapping = this.physics.overlap(testCircle, this.walls);
                testCircle.destroy();

                if (!overlapping && distance > 150) {
                    validPosition = true;
                }
            }

            const enemy = this.add.circle(x, y, 12, 0xe74c3c);
            this.physics.add.existing(enemy);
            enemy.body.setCollideWorldBounds(true);
            enemy.speed = enemySpeedBase + (this.level * enemySpeedIncrement);
            this.enemies.push(enemy);
        }
    }

    createControls() {
        this.keys = this.input.keyboard.createCursorKeys();
    }

    drawWallsDebug() {
        if (!this.debugGraphics) this.debugGraphics = this.add.graphics();
        this.debugGraphics.clear();
        this.debugGraphics.lineStyle(2, 0xff0000, 0.8);
        this.walls.getChildren().forEach(w => {
            if (w.getBounds) {
                const b = w.getBounds();
                this.debugGraphics.strokeRect(b.x, b.y, b.width, b.height);
            } else if (w.body) {
                this.debugGraphics.strokeRect(w.body.x, w.body.y, w.body.width, w.body.height);
            }
        });
    }

    update() {
        if (palabra === 'siguiente' && !this.levelCompleted) {
            this.levelCompleted = true;
            this.time.delayedCall(150, () => {
                this.scene.start('FirstRoomScene');
            });
            return;
        }
        // Llamar la función pasando la escena y opcionalmente la palabra
        playerMovement(this, palabra);

        this.enemies.forEach(enemy => {
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.jugador.x, this.jugador.y);
            enemy.body.setVelocity(Math.cos(angle) * enemy.speed, Math.sin(angle) * enemy.speed);
        });
    }

    hitEnemy(jugador, enemy) {
        const { startPos } = levelConfig;
        jugador.x = startPos.x;
        jugador.y = startPos.y;
        jugador.body.setVelocity(0, 0);

        const text = this.add.text(400, 300, '¡Te atraparon!', {
            fontSize: '32px',
            fill: '#e74c3c',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.time.delayedCall(1000, () => {
            text.destroy();
        });
    }

    reachGoal(jugador, goal) {
        if (!this.levelCompleted) {
            this.levelCompleted = true;
            const victory = this.add.text(400, 300, '¡Ganaste todos los niveles!', {
                fontSize: '32px',
                fill: '#2ecc71',
                fontStyle: 'bold',
                backgroundColor: '#000',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5);

            this.physics.pause();

            this.time.delayedCall(3000, () => {
                this.scene.start('FirstRoomScene');
            });
        }
    }
}
