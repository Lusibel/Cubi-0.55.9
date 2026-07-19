const imagenesConsejos = {};
const consejos = {

    primeraSalaJefe: {

        visto: false,

        paginas: [

            {
                titulo: "ENTRASTE A LA SALA DEL JEFE",
                imagen: "img/puertas.png",
                texto: "Las puertas sean bloqueado derrota al jefe para poder salir."
            },
            {
                titulo: "COMBATE",
                imagen: "img/combate.png",
                texto: "El jefe no te atacara hasta que tu lo golpes con tu arma recoje la espada del suelo y usa el botón rojo para atacarlo acercate a el y esquiva sus ataques."
            },

            {
                titulo: "MUERTE",
                imagen: "img/muerte.png",
                texto: "Tienes 3 puntos de vida son los puntos rojos de la parte superior izquierda si los pierdes regresaras al último punto de control."
            },
            {
                titulo: "DERROTA AL JEFE",
                imagen: "img/ganar.png",
                texto: "Termina con el jefe para seguir avanzando no pierdas tantas vidas las necesitaras."
            }

        ]

    }

};

let npcPendiente = null;
let consejoActual = null;

let paginaActual = 0;

function mostrarConsejo(id) {

    if (!consejos[id]) return;

    if (consejos[id].visto) return;

    if (gameState === "CONSEJO") return;

    consejoActual = consejos[id];

    paginaActual = 0;

    gameState = "CONSEJO";

}

function drawWrappedText(texto, x, y, maxWidth, lineHeight) {

    const palabras = texto.split(" ");

    let linea = "";

    for (let i = 0; i < palabras.length; i++) {

        const prueba = linea + palabras[i] + " ";

        if (
            context.measureText(prueba).width > maxWidth &&
            linea !== ""
        ) {

            context.fillText(linea, x, y);

            linea = palabras[i] + " ";

            y += lineHeight;

        } else {

            linea = prueba;

        }

    }

    context.fillText(linea, x, y);

}

function drawConsejo() {

    if (!consejoActual) return;

    const pagina = consejoActual.paginas[paginaActual];
    const s = window.escalaConsejo || 1;

    // Fondo oscuro
    context.fillStyle = "rgba(0,0,0,0.6)";
    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Ventana
    const w = 700 * s;
    const h = 500 * s;

    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    context.fillStyle = "#202020";
    context.fillRect(x, y, w, h);

    context.strokeStyle = "white";
    context.lineWidth = 3;
    context.strokeRect(x, y, w, h);

    // Título
    context.fillStyle = "white";
    context.font = `bold ${30 * s}px Arial`;
    context.textAlign = "center";

    context.fillText(
        pagina.titulo,
        x + w / 2,
        y + 40 * s
    );

    // Imagen
    const img = imagenesConsejos[pagina.imagen];

    if (img && img.complete && img.naturalWidth > 0) {

        context.drawImage(
            img,
            x + 40 * s,
            y + 60 * s,
            620 * s,
            240 * s
        );

    } else {

        context.fillStyle = "#444";

        context.fillRect(
            x + 40 * s,
            y + 60 * s,
            620 * s,
            240 * s
        );

    }

    // Texto
    context.fillStyle = "white";
    context.font = `${24 * s}px Arial`;
    context.textAlign = "left";

    drawWrappedText(
        pagina.texto,
        x + 40 * s,
        y + 340 * s,
        620 * s,
        32 * s
    );

    // Botón Atrás
    if (paginaActual > 0) {

        context.fillStyle = "#3A3A3A";

        context.fillRect(
            x + 20 * s,
            y + 445 * s,
            100 * s,
            40 * s
        );

        context.strokeStyle = "white";

        context.strokeRect(
            x + 20 * s,
            y + 445 * s,
            100 * s,
            40 * s
        );

        context.fillStyle = "white";
        context.font = `${22 * s}px Arial`;
        context.textAlign = "center";

        context.fillText(
            "◀ Atrás",
            x + 70 * s,
            y + 472 * s
        );

    }

    // Número de página
    context.font = `${20 * s}px Arial`;

    context.fillText(
        (paginaActual + 1) + " / " + consejoActual.paginas.length,
        x + w / 2,
        y + 470 * s
    );

}

function siguientePaginaConsejo() {

    if (!consejoActual) return;

    paginaActual++;

    if (paginaActual >= consejoActual.paginas.length) {

        consejoActual.visto = true;
        
        consejoActual = null;

if (npcPendiente) {

    const npc = npcPendiente;
    npcPendiente = null;

    mostrarDialogo(npc);

} else {

    gameState = "GAME";

}


    }

}

function cargarImagenConsejo(ruta) {

    if (imagenesConsejos[ruta]) return;

    const img = new Image();

    img.src = ruta;

    imagenesConsejos[ruta] = img;

}
for (const consejo in consejos) {

    consejos[consejo].paginas.forEach(pagina => {

        cargarImagenConsejo(pagina.imagen);

    });

}

window.addEventListener("pointerdown", (e) => {

    if (gameState !== "CONSEJO") return;
    const rect = canvas.getBoundingClientRect();

const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
const my = (e.clientY - rect.top) * (canvas.height / rect.height);

const s = window.escalaConsejo || 1;

const w = 700 * s;
const h = 500 * s;


    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    // Botón Atrás

if (
    paginaActual > 0 &&
    mx >= x + 20 * s &&
    mx <= x + 120 * s &&
    my >= y + 445 * s &&
    my <= y + 485 * s
) {

    paginaActual--;

    return;

}

    // Cualquier otro toque avanza
    siguientePaginaConsejo();

});
