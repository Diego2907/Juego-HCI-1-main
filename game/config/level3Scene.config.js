export const level3SceneConfig = {
    background: {
        key: 'level3Background',
        path: '../Assets/Background/escenario3.png',
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
