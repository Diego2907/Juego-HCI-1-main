export class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: "TutorialScene" });
  }

  preload() {
    this.load.image(
      "siguienteButton",
      "../assets/IntroScene/siguienteBoton.png"
    );
    this.load.image(
      "teclas",
      "../assets/IntroScene/teclas.png"
    );

    this.load.audio(
      "tutorialAudio",
      "../assets/sounds/IntroScene/tutorial.mp3"
    );
  }

  create() {
    let fullText = `
      Pero antes, debes saber cómo moverte por aquí. 
      Presiona las teclas (arriba, abajo, izquierda, derecha) 
      para moverte por los pasillos. 
      También puedes decir las palabras de las teclas 
      para moverte... ¡Mucha suerte!
    `;
    let displayedText = "";
    let index = 0;

    let texto = this.add.text(100, 100, "", { fontSize: "32px", fill: "#fff" });

    this.narracionIntro2 = this.sound.add("tutorialAudio");

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

    // this.add.image(700, 400, "mochila").setDisplaySize(280, 150);

    this.time.addEvent({
      //Agregar el boton de manera progresiva
      delay: 5000,
      callback: () => {
        let siguienteButton = this.add
          .image(750, 600, "siguienteButton")
          .setDisplaySize(280, 150)
          .setInteractive({ cursor: "pointer" });

        this.add
          .image(750, 600, "teclas")
          .setDisplaySize(300, 150)
          .setOrigin(0.5, 2);

        siguienteButton.on("pointerdown", () => {
          this.scene.start("FirstRoomScene");   
        });
      },
    });
  }
}
