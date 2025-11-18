import { getPalabra, clearPalabra } from "../../Control-de-voz.js";

export class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: "IntroScene" });
  }

  preload() {
    this.load.image("lyingOnGround", "../assets/IntroScene/lyingOnGround.png");
    this.load.image(
      "siguienteButton",
      "../assets/IntroScene/siguienteBoton.png"
    );
    this.load.audio(
      "introSceneAudio",
      "../assets/sounds/IntroScene/introSceneAudio.m4a"
    );
  }

  create() {
    this.add
      .rectangle(
        0,
        0,
        this.sys.game.config.width,
        this.sys.game.config.height,
        0x000000
      )
      .setOrigin(0, 0);

    this.introNarracion = this.sound.add("introSceneAudio");

    let fullText = "Acabas de despertar en un hospital abandonado...";
    let displayedText = "";
    let index = 0;

    let texto = this.add.text(100, 100, "", { fontSize: "32px", fill: "#fff" });

    this.time.addEvent({
      delay: 50,
      callback: () => {
        if (index === 0) {
          this.introNarracion.play({
            loop: false,
            volume: 0.5,
          });
        }

        displayedText += fullText[index];
        texto.setText(displayedText);
        index++;
      },
      repeat: fullText.length - 1,
    });

    this.add.image(750, 350, "lyingOnGround").setDisplaySize(380, 250);

    this.time.addEvent({
      //Agregar el boton de manera progresiva
      delay: 4000,
      callback: () => {
        let siguienteButton = this.add
          .image(750, 600, "siguienteButton")
          .setDisplaySize(280, 150)
          .setInteractive({ cursor: "pointer" });

        siguienteButton.on("pointerdown", () => {
          console.log("Boton clickeado");
          this.scene.start("IntroScene2");
        });
      },
    });
  }

   update() {
    if (getPalabra() === 'siguiente') {
      this.scene.start('IntroScene2');
      clearPalabra();
    }
  }
}
