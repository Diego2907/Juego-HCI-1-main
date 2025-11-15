export const level2SceneConfig = {
    background: {
        key: 'level2Background',
        path: '../Assets/Background/escenario2.png',
        position: { x: 420, y: 261 },
        origin: { x: 0.5, y: 0.5 },
        scale: 1.5
    },
    player: { initialPosition: { x: 100, y: 300 } },
    enemies: [],
    completion: {
        type: 'position',
        xThresholdOffset: 50
    }
};
