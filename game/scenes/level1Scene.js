import { palabra } from '../../Control-de-voz.js';
import { level1SceneConfig } from '../config/level1Scene.config.js';
import { mazesConfig, levelConfig, buildMaze } from '../config/mazes.config.js';
import { playerConfig, playerMovement } from '../config/player.config.js';

export class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
        this.level = 1;
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
        // Inicializar flag de nivel completado
        this.levelCompleted = false;

        // Fondo del nivel
        this.cameras.main.setBackgroundColor('#8b7355');

        // Crear grupo de paredes
        this.walls = this.physics.add.staticGroup();

        // Construir laberinto usando la función reutilizable importada
        buildMaze(this, 'hospitalWall');

        // Crear jugador
        this.createPlayer();

        // Crear animaciones
        this.createAnimations();

        // Crear enemigos
        this.createEnemies();

        // Crear controles
        this.createControls();

        // Texto del nivel
        this.levelText = this.add.text(16, 16, `Nivel: ${this.level}`, {
            fontSize: '24px',
            fill: '#000000',
            backgroundColor: '#ffffff',
            fontStyle: 'bold'
        });

        // Colisiones
        this.physics.add.collider(this.jugador, this.walls);
        this.enemies.forEach(enemy => {
            this.physics.add.collider(enemy, this.walls);
            this.physics.add.overlap(this.jugador, enemy, this.hitEnemy, null, this);
        });

        // Verificar que la meta exista antes de agregar overlap
        if (this.goal) {
            this.physics.add.overlap(this.jugador, this.goal, this.reachGoal, null, this);
        }
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
        Object.entries(playerConfig.animations).forEach(([key, anim]) => {
            if (!this.anims.exists(key)) {
                this.anims.create({
                    key: key,
                    frames: this.anims.generateFrameNumbers(
                        playerConfig.sprite.key,
                        { start: anim.start, end: anim.end }
                    ),
                    frameRate: anim.frameRate,
                    repeat: anim.repeat
                });
            }
        });
    }

    createEnemies() {
        this.enemies = [];
        const { startPos, enemySpeedBase, enemySpeedIncrement } = levelConfig;

        // Crear tantos enemigos como el nivel
        for (let i = 0; i < this.level; i++) {
            let validPosition = false;
            let x, y;

            while (!validPosition) {
                x = Phaser.Math.Between(100, 700);
                y = Phaser.Math.Between(100, 500);

                const distance = Phaser.Math.Distance.Between(x, y, startPos.x, startPos.y);

                // Verificar que no haya colisión con paredes
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

    hitEnemy(jugador, enemy) {
        // Evitar múltiples triggers
        if (this.isResetting) return;
        this.isResetting = true;

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

            // Detener al jugador
            jugador.body.setVelocity(0, 0);

            // Mostrar mensaje de éxito
            const text = this.add.text(400, 300, '¡Nivel Completado!', {
                fontSize: '32px',
                fill: '#2ecc71',
                fontStyle: 'bold'
            }).setOrigin(0.5).setScrollFactor(0);

            // Cambiar al siguiente nivel después de 1.5 segundos
            this.time.delayedCall(1500, () => {
                this.scene.start('Level2Scene');
            });
        }
    }

    update() {

        if (palabra === 'siguiente' && !this.levelCompleted || this.keys.space.isDown ) {
            this.levelCompleted = true;
            this.time.delayedCall(150, () => {
                this.scene.start('Level2Scene');
            });
            return;
        }
        // Solo actualizar si el nivel no está completado y no estamos reseteando
        if (!this.levelCompleted && !this.isResetting) {
            // Llamar la función pasando la escena y opcionalmente la palabra
            playerMovement(this, palabra);

            // Movimiento de enemigos (persiguen al jugador)
            this.enemies.forEach(enemy => {
                const angle = Phaser.Math.Angle.Between(
                    enemy.x, enemy.y,
                    this.jugador.x, this.jugador.y
                );

                enemy.body.setVelocity(
                    Math.cos(angle) * enemy.speed,
                    Math.sin(angle) * enemy.speed
                );
            });
        }
    }
}