export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  preload() {
    this.load.image("background", "./Assets/Background/MenuPrincipal.jpg");
    this.load.image("buttonStart", "./Assets/Background/buttonStart.png");
  }

  create() {
    let bg = this.add.image(0, 0, "background").setOrigin(0, 0);
    bg.setDisplaySize(window.innerWidth, window.innerHeight);

    let buttonStart = this.add
      .image(750, 500, "buttonStart")
      .setDisplaySize(280, 150)
      .setInteractive({ cursor: "pointer" });

    buttonStart.on("pointerdown", () => {
      console.log("Clickeaste el boton");
      this.scene.start("IntroScene");
    });
  }
}
