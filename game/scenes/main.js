import { MenuScene } from "./menuScene.js";
import { IntroScene } from "./IntroScene.js";
import { IntroScene2 } from "./IntroScene2.js";
import { FirstRoomScene } from "./firstRoomScene.js";
import { Level1Scene } from "./level1Scene.js";
import { Level2Scene } from "./level2Scene.js";
import { Level3Scene } from "./level3Scene.js";
import { display } from "../config/display.config.js";

const config = {
  type: Phaser.AUTO,
  width: display.width,
  height: display.height,
  scene: [MenuScene, IntroScene, IntroScene2, FirstRoomScene, Level1Scene, Level2Scene, Level3Scene],
  physics: {
    default: "arcade"
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
