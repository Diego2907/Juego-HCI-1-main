export class IntroScene2 extends Phaser.Scene {
  constructor() {
    super({ key: "IntroScene2" });
  }

  preload() {
    this.load.image(
      "siguienteButton",
      "../assets/IntroScene/siguienteBoton.png"
    );

    this.load.image("mochila", "../assets/IntroScene/backpack.png");
    this.load.audio(
      "narracionIntroScene2",
      "../assets/sounds/IntroScene/introSceneAudio2.m4a"
    );
  }

  create() {
    let fullText = "Lo bueno es que encontraste esto en tu mochila...";
    let displayedText = "";
    let index = 0;

    let texto = this.add.text(100, 100, "", { fontSize: "32px", fill: "#fff" });

    this.narracionIntro2 = this.sound.add("narracionIntroScene2");

    this.time.addEvent({
      delay: 50,
      callback: () => {
        if (index === 0) {
          this.narracionIntro2.play({
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

    this.add.image(700, 400, "mochila").setDisplaySize(280, 150);

    this.time.addEvent({
      //Agregar el boton de manera progresiva
      delay: 4000,
      callback: () => {
        let siguienteButton = this.add
          .image(750, 600, "siguienteButton")
          .setDisplaySize(280, 150)
          .setInteractive({ cursor: "pointer" });

        siguienteButton.on("pointerdown", () => {
          this.scene.start("FirstRoomScene");
          console.log("Boton clickeado");
        });
      },
    });
  }
}
