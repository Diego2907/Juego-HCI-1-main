import { palabra } from '../../Control-de-voz.js';
import { mazesConfig, levelConfig, buildMaze } from '../config/mazes.config.js';
import { playerConfig, playerMovement } from '../config/player.config.js';
import { enemyConfig, createEnemies, enemyMovement } from '../config/enemy.config.js';

export class Level3Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3Scene' });
        this.level = 3;
    }

    preload() {
        this.load.spritesheet(
            playerConfig.sprite.key,
            playerConfig.sprite.path,
            playerConfig.sprite.frameConfig
        );
        this.load.spritesheet(
            enemyConfig.sprite.key,
            enemyConfig.sprite.path,
            enemyConfig.sprite.frameConfig
        );
        this.load.audio(
            playerConfig.sound.key,
            playerConfig.sound.path
        );
        this.load.image('hospitalWall', './Assets/Background/wall.png');
        this.load.image('ground', './Assets/Background/ground.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#8b7355');
        this.walls = this.physics.add.staticGroup();
        buildMaze(this, 'hospitalWall');
        this.createPlayer();
        this.createAnimations();
        this.createEnemies();
        this.createControls();

        this.levelText = this.add.text(16, 16, `Nivel: ${this.level}`, {
            fontSize: '24px',
            fill: '#000000',
            backgroundColor: '#ffffff',
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
        // Usar la configuración del nivel para la posición inicial
        const { startPos } = levelConfig;

        // Crear el sprite del jugador (igual que en Level1Scene)
        this.jugador = this.physics.add.sprite(startPos.x, startPos.y, playerConfig.sprite.key)
            .setOrigin(playerConfig.origin?.x ?? 0.5, playerConfig.origin?.y ?? 0.5)
            .setCollideWorldBounds(playerConfig.collideWorldBounds ?? true)
            .setScale(playerConfig.scale ?? 1);

        // Ajustar el tamaño del cuerpo para evitar que se quede atrapado
        if (this.jugador.body && this.jugador.width && this.jugador.height) {
            this.jugador.body.setSize(
                this.jugador.width * 0.5,
                this.jugador.height * 0.5
            );
            this.jugador.body.setOffset(
                this.jugador.width * 0.25,
                this.jugador.height * 0.25
            );
        }

        // Sonido de pasos
        this.sonidoPasos = this.sound.add(playerConfig.sound.key, playerConfig.sound.config);
    }

    createAnimations() {
        // Crear animaciones del jugador
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

        // Crear animaciones de enemigos
        Object.entries(enemyConfig.animations).forEach(([key, anim]) => {
            if (!this.anims.exists(key)) {
                this.anims.create({
                    key: key,
                    frames: this.anims.generateFrameNumbers(
                        enemyConfig.sprite.key,
                        { start: anim.start, end: anim.end }
                    ),
                    frameRate: anim.frameRate,
                    repeat: anim.repeat
                });
            }
        });
    }

    createEnemies() {
        // Pasar la configuración de startPos a la escena
        this.startPos = levelConfig.startPos;
        // Usar la función de createEnemies del config
        createEnemies(this, this.level);
    }

    createControls() {
        this.keys = this.input.keyboard.createCursorKeys();
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

        // Movimiento de enemigos (persiguen al jugador)
        this.enemies.forEach(enemy => {
            enemyMovement(this, enemy, this.jugador);
        });
    }

    hitEnemy(jugador) {
        const { startPos } = levelConfig;
        jugador.x = startPos.x;
        jugador.y = startPos.y;
        jugador.body.setVelocity(0, 0);

        // Crear texto de game over
        const text = this.add.text(400, 250, '¡Te atraparon!', {
            fontSize: '40px',
            fill: '#9d2b1fff',
            backgroundColor: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);

        // Crear botón de reinicio (correctamente como texto interactivo)
        const button = this.add.text(400, 320, '¡Ir a inicio!', {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold',
            backgroundColor: '#3498db',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setScrollFactor(2);

        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: '#2980b9' });
        });

        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: '#3498db' });
        });

        button.on('pointerdown', () => {
            this.isResetting = false;
            text.destroy();
            button.destroy();
            this.scene.restart();
        });

        // Auto-reinicio después de 3 segundos
        this.time.delayedCall(3000, () => {
            if (text && text.active) {
                text.destroy();
                button.destroy();
                this.isResetting = false;
            }
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
