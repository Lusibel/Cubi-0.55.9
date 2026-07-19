document.getElementById("settingsButton")
.addEventListener("click", abrirAjustes);
document.getElementById("visionMas").onclick = () => {

    if (ajustes.vision < 2.0) {

        ajustes.vision += 0.1;

    }

    guardarAjustes();
    aplicarVision();

};

document.getElementById("visionMenos").onclick = () => {

if (ajustes.vision > 0.2) {

    ajustes.vision -= 0.1;

}

    guardarAjustes();
    aplicarVision();

};

const ajustes = {

    vision: 1.8,
    dialogScale: 0.5,
    joystickScale: 1,
    joystickOpacity: 0.6,
    hiuScale: 1,
    musicVolume: 0.5,
    sfxVolume: 0.5,

};


function cargarAjustes() {

    const datos = localStorage.getItem("ajustes");

    if (datos) {

        Object.assign(
            ajustes,
            JSON.parse(datos)
        );

    }

    if (ajustes.vision === undefined) {

        ajustes.vision = 0.5;
        guardarAjustes();

    }

}

function guardarAjustes() {

    localStorage.setItem(
        "ajustes",
        JSON.stringify(ajustes)
    );

}

function abrirAjustes() {

    const menu = document.getElementById("settingsMenu");

    if (menu.style.display === "block") {

        menu.style.display = "none";

    } else {

        menu.style.display = "block";

    }

}


function aplicarVision() {

    document.getElementById("visionValor").textContent =
        ajustes.vision.toFixed(1);

}


function aplicarEscalaDialogo() {

    document.getElementById("dialogoValor").textContent =
        ajustes.dialogScale.toFixed(1);

    const dialogo = document.getElementById("dialogBox");

    dialogo.style.transformOrigin = "bottom center";

    dialogo.style.transform =
        `translateX(-50%) scale(${ajustes.dialogScale})`;

}
function aplicarEscalaJoystick() {

    document.getElementById("joystickValor").textContent =
        ajustes.joystickScale.toFixed(1);

    document.getElementById("joystick").style.transform =
        `scale(${ajustes.joystickScale})`;

}

function aplicarOpacidadJoystick() {

    document.getElementById("opacidadValor").textContent =
        ajustes.joystickOpacity.toFixed(1);

    document.getElementById("joystick").style.opacity =
        ajustes.joystickOpacity;

}

function aplicarEscalaHIU() {

    document.getElementById("hiuValor").textContent =
        ajustes.hiuScale.toFixed(1);

    // Vidas del jugador
    const vidas = document.getElementById("playerLives");

    vidas.style.transform =
        `scale(${ajustes.hiuScale})`;

    vidas.style.transformOrigin = "top left";

    // Barras de los jefes
    const bossBars = document.getElementById("bossBars");

    bossBars.style.transformOrigin = "top right";

    bossBars.style.transform =
        `translateY(10px) scale(${ajustes.hiuScale})`;

    // Mensaje de victoria
    const victoryText = document.getElementById("victoryText");

if (victoryText) {

    victoryText.style.transformOrigin = "top center";
    victoryText.style.setProperty(
    "--hiuScale",
    ajustes.hiuScale
);

}


}

function cambiarPantallaCompleta() {

    if (!document.fullscreenElement) {

        document.documentElement.requestFullscreen();

    } else {

        document.exitFullscreen();

    }

}
function restaurarAjustes(){

    Object.assign(ajustes, {

        vision:1.8,
        dialogScale:0.5,
        joystickScale:1.0,
        joystickOpacity:0.6,
        hiuScale:0.5,
        musicVolume:0.5,
        sfxVolume:1

    });

    guardarAjustes();

    aplicarVision();
    aplicarEscalaDialogo();
    aplicarEscalaJoystick();
    aplicarOpacidadJoystick();
    aplicarEscalaHIU();
    aplicarEscalaMenu();
    aplicarEscalaConsejo();
    aplicarVolumen();

}

function aplicarEscalaMenu() {

    const menu = document.getElementById("playerMenu");

    const escala = Math.min(
        window.innerWidth / 1280
    );

    menu.style.transformOrigin = "center center";

    menu.style.transform =
        `translate(-50%, -50%) scale(${escala})`;

    const equipmentInfo = document.getElementById("equipmentInfo");

    equipmentInfo.style.transformOrigin = "center center";

    equipmentInfo.style.transform =
        `scale(${escala})`;

}

function aplicarEscalaConsejo() {

    const escala = Math.min(
        window.innerWidth / 1280
    );

    window.escalaConsejo = escala;

}


function aplicarVolumen() {

}

loadTextures();

cargarAjustes();

aplicarVision();
aplicarEscalaDialogo();
aplicarEscalaJoystick();
aplicarOpacidadJoystick();
aplicarEscalaHIU();
aplicarEscalaMenu();
aplicarEscalaConsejo();
aplicarVolumen();

document.getElementById("joystickMas").onclick = () => {

    if (ajustes.joystickScale < 2.0) {

        ajustes.joystickScale += 0.1;

    }

    guardarAjustes();
    aplicarEscalaJoystick();

};

document.getElementById("joystickMenos").onclick = () => {

    if (ajustes.joystickScale > 0.5) {

        ajustes.joystickScale -= 0.1;

    }

    guardarAjustes();
    aplicarEscalaJoystick();

};

document.getElementById("opacidadMas").onclick = () => {

    if (ajustes.joystickOpacity < 1.0) {

        ajustes.joystickOpacity =
    Number((ajustes.joystickOpacity + 0.1).toFixed(1));

    }

    guardarAjustes();
    aplicarOpacidadJoystick();

};

document.getElementById("opacidadMenos").onclick = () => {

    if (ajustes.joystickOpacity > 0.2) {

        ajustes.joystickOpacity =
    Number((ajustes.joystickOpacity - 0.1).toFixed(1));

    }

    guardarAjustes();
    aplicarOpacidadJoystick();

};

document.getElementById("dialogoMas").onclick = () => {

    if (ajustes.dialogScale < 2.0) {

        ajustes.dialogScale =
            Number((ajustes.dialogScale + 0.1).toFixed(1));

    }

    guardarAjustes();
    aplicarEscalaDialogo();

};

document.getElementById("dialogoMenos").onclick = () => {

    if (ajustes.dialogScale > 0.5) {

        ajustes.dialogScale =
            Number((ajustes.dialogScale - 0.1).toFixed(1));

    }

    guardarAjustes();
    aplicarEscalaDialogo();

};

document.getElementById("hiuMas").onclick = () => {

    if (ajustes.hiuScale < 2.0) {

        ajustes.hiuScale =
            Number((ajustes.hiuScale + 0.1).toFixed(1));

    }

    guardarAjustes();
    aplicarEscalaHIU();

};

document.getElementById("hiuMenos").onclick = () => {

    if (ajustes.hiuScale > 0.5) {

        ajustes.hiuScale =
            Number((ajustes.hiuScale - 0.1).toFixed(1));

    }

    guardarAjustes();
    aplicarEscalaHIU();

};

document.getElementById("fullscreenButton").onclick =
    cambiarPantallaCompleta;
document.getElementById("fullscreenButton").onclick =
    cambiarPantallaCompleta;

document.addEventListener("fullscreenchange", () => {

    const boton = document.getElementById("fullscreenButton");

    boton.textContent = document.fullscreenElement
        ? "Salir"
        : "Activar";

});

document.getElementById(
    "resetSettingsButton"
).onclick =
    restaurarAjustes;

window.addEventListener("resize", aplicarEscalaMenu);
window.addEventListener("resize", aplicarEscalaConsejo);
