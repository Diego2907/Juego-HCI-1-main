import { getPalabra, clearPalabra } from '../../Control-de-voz.js';
import { firstRoomConfig } from '../config/firstRoomScene.config.js';
import { playerConfig, playerMovement } from '../config/player.config.js';

export class FirstRoomScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FirstRoomScene' });
    }

    preload() {
        this.load.image(
            firstRoomConfig.background.key,
            firstRoomConfig.background.path
        );
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
        this.createBackground();
        this.createPlayer();
        this.createAnimations();
        this.createControls();
        this.createInstructions();
        this.completionTriggered = false;
    }

    createBackground() {
        this.add.image(
            firstRoomConfig.background.position.x,
            firstRoomConfig.background.position.y,
            firstRoomConfig.background.key
        )
            .setOrigin(
                firstRoomConfig.background.origin.x,
                firstRoomConfig.background.origin.y
            )
            .setScale(firstRoomConfig.background.scale);
    }

    createPlayer() {
        // Obtener posición inicial del jugador
        const playerX = firstRoomConfig.player.initialPosition.x || playerConfig.defaultPosition.x;
        const playerY = firstRoomConfig.player.initialPosition.y || playerConfig.defaultPosition.y;

        // Crear el sprite del jugador
        this.jugador = this.physics.add.sprite(playerX, playerY, playerConfig.sprite.key)
            .setOrigin(playerConfig.origin.x, playerConfig.origin.y)
            .setCollideWorldBounds(playerConfig.collideWorldBounds)
            .setScale(playerConfig.scale);

        // Configurar el sonido de pasos
        this.sonidoPasos = this.sound.add(
            playerConfig.sound.key,
            playerConfig.sound.config
        );


    }

    createAnimations() {
        // Crear todas las animaciones del jugador
        Object.entries(playerConfig.animations).forEach(([key, anim]) => {
            // Evitar crear animaciones duplicadas
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

    createControls() {
        this.keys = this.input.keyboard.createCursorKeys();
    }

    createInstructions() {
        this.add.text(400, 450, 'Presiona la tecla [Espacio] para jugar, o di la palabra "Inicio"', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    update() {
        if (getPalabra() === 'inicio' || this.keys.space.isDown) {
            this.completionTriggered = true;
            this.time.delayedCall(150, () => {
                this.scene.start('Level1Scene');
            });
            clearPalabra();
            return;
        }
        // Llamar la función pasando la escena y opcionalmente la palabra
        playerMovement(this, getPalabra());
         
    }
}