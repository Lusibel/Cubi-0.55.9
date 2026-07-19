const playerMenu =
    document.getElementById("playerMenu");

const playerMenuButton =
    document.getElementById("playerMenuButton");

playerMenuButton.onclick = () => {

    if (playerMenu.style.display === "block") {

        playerMenu.style.display = "none";

    } else {
        
    actualizarEstado();
actualizarObjetos();
actualizarEquipo();


    playerMenu.style.display = "block";

}

};
const tabs = document.querySelectorAll(".playerTab");

tabs.forEach(tab => {

    tab.onclick = () => {

        tabs.forEach(t => t.classList.remove("active"));

        tab.classList.add("active");

        document.querySelectorAll(".tabContent").forEach(content => {

            content.style.display = "none";

        });

        const id = tab.dataset.tab + "Tab";

        document.getElementById(id).style.display = "block";

    };

});

function actualizarObjetos() {

    const lista = document.getElementById("itemsList");
    const panel = document.getElementById("itemDescription");

    lista.innerHTML = "";
    panel.style.display = "none";
    panel.innerHTML = "";

    const objetos = [

        {
            tiene: keys > 0,
            cantidad: keys,
            nombre: "Llave",
            descripcion: "Abre una puerta común.",
            icono: "https://img.icons8.com/ios-filled/50/ffffff/key.png"
        },

        {
            tiene: hasMasterKey,
            nombre: "Llave del jefe",
            descripcion: "Abre la puerta del jefe.",
            icono: "https://img.icons8.com/?size=100&id=7wzJJ5uOWmzN&format=png&color=FFFFFF"
        }

    ];

    objetos.forEach(obj => {

        if (!obj.tiene) return;

        lista.innerHTML += `
            <div class="itemRow"
            onclick="mostrarDescripcion('${obj.nombre}','${obj.descripcion}')">

                <img src="${obj.icono}">

                <span>
                    ${obj.nombre}
                    ${obj.cantidad !== undefined ? " x" + obj.cantidad : ""}
                </span>

            </div>
        `;

    });

}

function actualizarEquipo() {

    const lista = document.getElementById("equipmentList");

    lista.innerHTML = "";

    const equipo = [

        {
            tiene: hasSword,
            nombre: "Espada",
            descripcion: "Una espada sencilla, creo que podría hacerle daño a un jefe con esto pero a un guardia no estoy tan seguro.",
            icono: "https://img.icons8.com/ios-filled/50/ffffff/sword.png"
        }

        // Aquí podrás agregar más equipo

        /*
        {
            tiene: hasArmor,
            nombre: "Armadura",
            descripcion: "Reduce el daño recibido.",
            icono: "armadura.png"
        }
        */

    ];

    equipo.forEach(eq => {

        if (!eq.tiene) return;

        lista.innerHTML += `
            <div class="itemRow"
            onclick="mostrarEquipo(
            '${eq.nombre}',
            '${eq.icono}',
            '${eq.descripcion}'
            )">

                <img src="${eq.icono}">

                <span>${eq.nombre}</span>

            </div>
        `;

    });

}

function actualizarEstado(){

    document.getElementById("statLives").textContent =
        player.lives + " / 3";

    document.getElementById("statKeys").textContent =
        keys;

    document.getElementById("statMasterKey").textContent =
        hasMasterKey ? "SÍ" : "NO";

    document.getElementById("statCheckpoint").textContent =
        checkpoint ? "ACTIVO" : "NINGUNO";

    document.getElementById("statWeapon").textContent =
        hasSword ? "ESPADA" : "NINGUNA";

    // Mostrar siempre el icono de vidas
    document.getElementById("livesIcon").style.display = "block";

    // Mostrar solo cuando corresponda
    document.getElementById("weaponIcon").style.display = hasSword ? "block" : "none";

    document.getElementById("keysIcon").style.display = keys > 0 ? "block" : "none";

    document.getElementById("masterKeyIcon").style.display = hasMasterKey ? "block" : "none";

    document.getElementById("checkpointIcon").style.display = checkpoint ? "block" : "none";

}

function showItemText(nombre, tipo){

    const texto = document.getElementById("itemText");

    texto.textContent =
        `${nombre} ha sido añadido a ${tipo}`;

    texto.style.opacity = "1";

    clearTimeout(texto.timer);

    texto.timer = setTimeout(() => {

        texto.style.opacity = "0";

    }, 2000);

}


function mostrarDescripcion(nombre, descripcion){

    const panel = document.getElementById("itemDescription");

    panel.innerHTML =
        "<b>" + nombre + "</b><br>" + descripcion;

    panel.style.display = "block";
}

function mostrarEquipo(nombre, icono, descripcion){

    document.getElementById("equipmentInfoTitle").textContent = nombre;

    document.getElementById("equipmentInfoImage").innerHTML =
        `<img src="${icono}">`;

    document.getElementById("equipmentInfoText").textContent =
        descripcion;

    equipmentInfo.style.display = "block";

}

const equipmentInfo =
document.getElementById("equipmentInfo");

const equipmentInfoContent =
document.getElementById("equipmentInfoContent");

equipmentInfo.addEventListener("click", (e) => {

    // Solo cerrar si se tocó el fondo,
    // no la ventana.

    if (e.target === equipmentInfo) {

        equipmentInfo.style.display = "none";

    }

});

