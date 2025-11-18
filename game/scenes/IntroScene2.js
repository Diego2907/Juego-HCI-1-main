import { getPalabra, clearPalabra } from "../../Control-de-voz.js";
export class IntroScene2 extends Phaser.Scene {
  constructor() {
    super({ key: "IntroScene2" });
  }

  preload() {
    this.load.image(
      "siguienteButton",
      "../assets/IntroScene/siguienteBoton.png"
    );

    this.load.audio(
      "historia",
      "../assets/sounds/IntroScene/Historia.mp3"
    );
  }

  create() {
    let fullText = `
      El hospital es un caos. El experimento... 
      se salió de control. La inyección convirtió a las ratas 
      en gigantescas bestias hambrientas. ¡Se están comiendo 
      a los científicos! Los gritos resuenan en los pasillos. 
      Tienes que encontrar a alguien... 
      ¡quien sea! ¡Busca una salida y sal de aquí AHORA!
    `;
    let displayedText = "";
    let index = 0;

    let texto = this.add.text(100, 100, "", { fontSize: "32px", fill: "#fff" });

    this.narracionIntro2 = this.sound.add("historia");

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

    this.time.addEvent({
      //Agregar el boton de manera progresiva
      delay: 10000,
      callback: () => {
        let siguienteButton = this.add
          .image(750, 600, "siguienteButton")
          .setDisplaySize(280, 150)
          .setInteractive({ cursor: "pointer" });

        siguienteButton.on("pointerdown", () => {
          this.scene.start("TutorialScene");
          console.log("Boton clickeado");
        });
      },
    });
  }

  update() {
    if (getPalabra() === 'siguiente') {
      this.scene.start('TutorialScene');
      clearPalabra();
    }
  }
}
