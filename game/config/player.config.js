export const playerConfig = {
    sprite: {
        key: 'jugador',
        path: '../Assets/Personaje principal/Personaje_caminando.png',
        frameConfig: {
            frameWidth: 113/7, //? 113 los pixeles de ancho de la imagen divididos en 7 frames
            frameHeight: 216/7 //? 216 los pixeles de alto de la imagen divididos en 7 frames 
        }
    },
    defaultPosition: {
        x: 400,
        y: 300
    },
    scale: 2.5,
    origin: { x: 0, y: 1 },
    collideWorldBounds: true,
    animations: {
        'jugador-camina-abajo': {
            start: 0,
            end: 6,
            frameRate: 17,
            repeat: 1
        },
        'jugador-camina-derecha': {
            start: 28,
            end: 34,
            frameRate: 17,
            repeat: 1
        },
        'jugador-camina-izquierda': {
            start: 14,
            end: 20,
            frameRate: 17,
            repeat: 1
        },
        'jugador-camina-arriba': {
            start: 42,
            end:48,
            frameRate: 17,
            repeat: 1
        }

        //?Tamaño de la imagen 113px x 216px
    },
    sound: {
        key: 'pasosJugador',
        path: '../Assets/sounds/pisadas.mp3',
        config: {
            volume: 0.025,
            loop: false,
            rate: 2
        }
    },
    controls: {
        movement: {
            up: 'up',
            down: 'down',
            left: 'left',
            right: 'right'
        }
    },
    speed: 5,
    
    // Mapeo de direcciones para movimiento
    directions: {
        izquierda: { 
            anim: 'jugador-camina-izquierda', 
            axis: 'x', 
            delta: -1 
        },
        derecha: { 
            anim: 'jugador-camina-derecha', 
            axis: 'x', 
            delta: 1 
        },
        arriba: { 
            anim: 'jugador-camina-arriba', 
            axis: 'y', 
            delta: -1 
        },
        abajo: { 
            anim: 'jugador-camina-abajo', 
            axis: 'y', 
            delta: 1 
        }
    }
};

/**
 * Maneja el movimiento del jugador basado en teclas o comandos de voz
 * @param {Phaser.Scene} scene - La escena de Phaser actual
 * @param {string|null} palabra - Comando de voz opcional (izquierda, derecha, arriba, abajo, para)
 */

export function playerMovement(scene, palabra = null) {
    const { jugador, keys, sonidoPasos } = scene;
    const { speed, directions } = playerConfig;

    // Determinar la dirección del movimiento
    let direction = null;
    
    if (keys.left.isDown || palabra === "izquierda") {
        direction = 'izquierda';
    } else if (keys.right.isDown || palabra === "derecha") {
        direction = 'derecha';
    } else if (keys.up.isDown || palabra === "arriba") {
        direction = 'arriba';
    } else if (keys.down.isDown || palabra === "abajo") {
        direction = 'abajo';
    }

    // Ejecutar movimiento si hay dirección
    if (direction) {
        const { anim, axis, delta } = directions[direction];
        
        // Reproducir animación
        jugador.anims.play(anim, true);
        
        // Mover jugador
        jugador[axis] += delta * speed;
        
        // Reproducir sonido de pasos
        if (!sonidoPasos.isPlaying) {
            sonidoPasos.play();
        }
    } else {
        // Detener animación cuando no hay movimiento
        jugador.anims.stop();
        jugador.setFrame(0);
    }
}