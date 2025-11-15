export const level1SceneConfig = {
    background: {
        key: 'escenario1',
        path: '../Assets/Background/escenario principal terror.png',
        position: { x: 420, y: 261 },
        origin: { x: 0.5, y: 0.5 },
        scale: 1.5
    },
    player: { initialPosition: { x: 15, y: 15 } },
    completion: {
        type: 'position',
        xThresholdOffset: 50
    }
};
