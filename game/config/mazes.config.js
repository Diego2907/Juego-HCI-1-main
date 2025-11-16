// import '.Assets/Background/Tile_07.png' as hospitalWall;

export const mazesConfig = {
    1: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1],
        [1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,0,1,0,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,1,0,0,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    2: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    3: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1],
        [1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,1,1,0,1,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,1,0,1],
        [1,0,1,1,1,0,1,1,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
};

export const levelConfig = {
    tileSize: 55,
    playerSpeed: 200,
    enemySpeedBase: 80,
    enemySpeedIncrement: 20,
    startPos: { x: 50, y: 120}
};

export function buildMaze(scene, wallImage, level) {
    // Allow calling with an explicit level or fallback to scene.level
    const useLevel = typeof level !== 'undefined' ? level : (scene && scene.level);
    if (!useLevel) throw new Error('buildMaze: level not provided and scene.level is undefined');

    const maze = mazesConfig[useLevel];
    const { tileSize } = levelConfig;

    // Ensure scene.walls exists (allow caller to create it earlier if desired)
    if (!scene.walls) {
        scene.walls = scene.physics.add.staticGroup();
    }

    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const x = col * tileSize + tileSize / 2;
            const y = row * tileSize + tileSize / 2;

            if (maze[row][col] === 1) {
                // Create an image for the wall using the provided key
                const wall = scene.add.image(x, y, wallImage);
                wall.displayWidth = tileSize;
                wall.displayHeight = tileSize;

                // Add static physics body to the image and add to the group's children
                scene.physics.add.existing(wall, true);
                scene.walls.add(wall);

            } else if (maze[row][col] === 2) {
                // Goal
                scene.goal = scene.add.circle(x, y, 20, 0x2ecc71);
                scene.physics.add.existing(scene.goal, true);
            }
        }
    }
}