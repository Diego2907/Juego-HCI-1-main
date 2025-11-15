const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let palabra = "";
if (!SpeechRecognition) {
    alert('Este navegador no soporta reconocimiento de voz.');
} 

const voz = new SpeechRecognition();
    voz.lang = "es-MX";
    voz.continuous = false; 
    voz.interimResults = false;


voz.onresult = (event) => {
    palabra= event.results[0][0].transcript.trim().toLowerCase();
    console.log("Palabra reconocida:", palabra);
 };

voz.onend = () => {
// reinicia siempre que quieras que siga escuchando
    if (autoEscucha) voz.start();
};

let autoEscucha = false;

document.getElementById("StartBtn").addEventListener("click", () => {
                autoEscucha = true;
                voz.start();
 });

document.getElementById("StopBtn").addEventListener("click", () => {
                autoEscucha = false;
                voz.stop();
});

export { palabra };