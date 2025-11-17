export const enemyConfig = {
    sprite: {
        key: 'rata',
        path: '../Assets/Personaje principal/rata.png',
        frameConfig: {
            frameWidth: 256/8,
            frameHeight: 480/15 
        }
    },
    scale: 3,
    origin: { x: 0.5, y: 0.5 },
    collideWorldBounds: true,
    animations: {
        'rata-camina-abajo': {
            start: 48,
            end: 53,
            frameRate: 17,
            repeat: -1
        },
        'rata-camina-izquierda': {
            start: 64,
            end: 69,
            frameRate: 17,
            repeat: -1
        },
        'rata-camina-arriba': {
            start: 56,
            end: 61,
            frameRate: 17,
            repeat: -1
        }
    },
    speed: 80,
    speedIncrement: 20
};

/**
 * Crea enemigos para la escena
 * @param {Phaser.Scene} scene - La escena de Phaser actual
 * @param {number} level - El nivel actual (determina cantidad de enemigos)
 */
export function createEnemies(scene, level) {
    scene.enemies = [];
    const { startPos } = scene;

    for (let i = 0; i < level; i++) {
        let validPosition = false;
        let x, y;

        while (!validPosition) {
            x = Phaser.Math.Between(100, 700);
            y = Phaser.Math.Between(100, 500);

            const distance = Phaser.Math.Distance.Between(x, y, startPos.x, startPos.y);

            // Verificar que no haya colisión con paredes
            const testCircle = scene.add.circle(x, y, 12);
            scene.physics.add.existing(testCircle);
            const overlapping = scene.physics.overlap(testCircle, scene.walls);
            testCircle.destroy();

            if (!overlapping && distance > 150) {
                validPosition = true;
            }
        }

        // Crear sprite de rata en lugar de círculo
        const enemy = scene.physics.add.sprite(x, y, enemyConfig.sprite.key)
            .setOrigin(enemyConfig.origin.x, enemyConfig.origin.y)
            .setCollideWorldBounds(enemyConfig.collideWorldBounds)
            .setScale(enemyConfig.scale);

        // Ajustar hitbox
        if (enemy.body && enemy.width && enemy.height) {
            enemy.body.setSize(
                enemy.width * 0.5,
                enemy.height * 0.5
            );
            enemy.body.setOffset(
                enemy.width * 0.25,
                enemy.height * 0.25
            );
        }

        enemy.speed = enemyConfig.speed + (level * enemyConfig.speedIncrement);
        scene.enemies.push(enemy);
    }
}

/**
 * Maneja el movimiento del enemigo hacia el jugador
 * @param {Phaser.Scene} scene - La escena de Phaser actual
 * @param {Phaser.Physics.Arcade.Sprite} enemy - El enemigo a controlar
 * @param {Phaser.Physics.Arcade.Sprite} target - El objetivo (jugador)
 */
export function enemyMovement(scene, enemy, target) {
    if (!enemy || !target) return;

    const { speed: baseSpeed, animations } = enemyConfig;

    // Calcular ángulo hacia el objetivo
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, target.x, target.y);
    
    // Establecer velocidad
    enemy.body.setVelocity(Math.cos(angle) * enemy.speed, Math.sin(angle) * enemy.speed);

    // Determinar dirección para animación
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    
    let direction = 'derecha';
    if (Math.abs(dy) > Math.abs(dx)) {
        direction = dy > 0 ? 'abajo' : 'arriba';
    } else {
        direction = dx > 0 ? 'derecha' : 'izquierda';
    }

    let animKey;

    switch (direction) {
        case 'izquierda':
            animKey = 'rata-camina-izquierda';
            enemy.setFlipX(false); // Nos aseguramos que no esté volteado
            break;
            
        case 'derecha':
            animKey = 'rata-camina-izquierda'; // <<< ¡Usamos la anim de la izquierda!
            enemy.setFlipX(true);  // <<< ¡Y la volteamos horizontalmente!
            break;
            
        case 'arriba':
            animKey = 'rata-camina-arriba';
            enemy.setFlipX(false); // Reseteamos el flip
            break;
            
        case 'abajo':
            animKey = 'rata-camina-abajo';
            enemy.setFlipX(false); // Reseteamos el flip
            break;
    }

    if (enemy.anims && typeof enemy.anims.play === 'function') {
        enemy.anims.play(animKey, true);
    }
}
