import { palabra } from '../../Control-de-voz.js';
import { mazesConfig, levelConfig } from '../config/mazes.config.js';
import { playerConfig , playerMovement} from '../config/player.config.js';

export class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });
        this.level = 2;
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
    }

    create() {
        this.cameras.main.setBackgroundColor('#8b7355');
        this.walls = this.physics.add.staticGroup();
        this.buildMaze();
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

    buildMaze() {
        const maze = mazesConfig[this.level];
        const { tileSize } = levelConfig;

        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                const x = col * tileSize + tileSize / 2;
                const y = row * tileSize + tileSize / 2;

                if (maze[row][col] === 1) {
                    const wall = this.add.rectangle(x, y, tileSize, tileSize, 0x34495e).setOrigin(0.5);
                    // Añadir cuerpo físico estático para la pared
                    this.physics.add.existing(wall, true);
                    if (wall.body && wall.body.setSize) wall.body.setSize(tileSize, tileSize);
                    this.walls.add(wall);
                } else if (maze[row][col] === 2) {
                    this.goal = this.add.circle(x, y, 20, 0x2ecc71);
                    this.physics.add.existing(this.goal, true);
                }
            }
        }
    }

    createPlayer() {
        // const { startPos } = levelConfig;
        // this.jugador = this.add.circle(startPos.x, startPos.y, 15, 0x3498db);
        // this.physics.add.existing(this.jugador);
        // this.jugador.body.setCollideWorldBounds(true);
        // this.sonidoPasos = this.sound.add(playerConfig.sound.key, playerConfig.sound.config);
        // // Gráfico para visualizar la hitbox del jugador
        // this.playerHitbox = this.add.graphics();
        // this.playerHitbox.setDepth(10);



        if (this.jugador.body) {
            const b = this.jugador.body;
            this.playerHitbox.fillStyle(0xffff00, 0.12);
            this.playerHitbox.fillRect(b.x, b.y, b.width, b.height);
            this.playerHitbox.lineStyle(2, 0xffff00, 0.9);
            this.playerHitbox.strokeRect(b.x, b.y, b.width, b.height);
        }
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
                this.scene.start('Level3Scene');
            });
            return;
        }
        
        // Llamar la función pasando la escena y opcionalmente la palabra
        playerMovement(this, palabra);

        // Actualizar la máscara/hitbox visual para que siga al jugador
        if (this.playerHitbox && this.jugador && this.jugador.body) {
            const b = this.jugador.body;
            this.playerHitbox.clear();
            this.playerHitbox.fillStyle(0xffff00, 0.12);
            this.playerHitbox.fillRect(b.x, b.y, b.width, b.height);
            this.playerHitbox.lineStyle(2, 0xffff00, 0.9);
            this.playerHitbox.strokeRect(b.x, b.y, b.width, b.height);
        }
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
            this.scene.start('Level3Scene');
        }
    }
}
