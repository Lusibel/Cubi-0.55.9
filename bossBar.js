const bossBars = document.getElementById("bossBars");

let bossMusic = null;
let victoryMusic = null;
let bossHitSound = null;

// Mostrar la barra del jefe
function showBossBar(boss) {

    if (document.getElementById("bossBar" + boss.id)) return;

    const barra = document.createElement("div");
    barra.className = "bossHpBar";
    barra.id = "bossBar" + boss.id;
    
    barra.style.transform =
    `scale(${ajustes.hudScale})`;

    barra.innerHTML = `
        <div class="bossName">${boss.nombre}</div>
        <div class="bossHpBarBg">
            <div class="bossHpBarInner"></div>
        </div>
    `;

    bossBars.appendChild(barra);

}

// Actualizar la vida
function updateBossBar(boss) {

    const barra = document.querySelector(
        "#bossBar" + boss.id + " .bossHpBarInner"
    );

    if (!barra) return;

    const porcentaje = (boss.hp / boss.hpMax) * 100;

    barra.style.width = porcentaje + "%";

}

// Ocultar la barra
function hideBossBar(boss) {

    const barra = document.getElementById("bossBar" + boss.id);

    if (barra) {

        barra.remove();

    }

}

// Animación de entrada
function animateBossBar(boss, iniciarMusica = true){

    showBossBar(boss);

    if(iniciarMusica){

        if (bossMusic) {
            bossMusic.pause();
            bossMusic.currentTime = 0;
        }

        bossMusic = new Audio(boss.music);
        bossMusic.loop = true;
        bossMusic.volume = 0.5;
        bossMusic.play();

        victoryMusic = new Audio(boss.victoryMusic);
        bossHitSound = new Audio(boss.hitSound);
    }

    boss.invulnerable = true;

    const barra = document.querySelector(
        "#bossBar" + boss.id + " .bossHpBarInner"
    );

    barra.style.transition = "none";
    barra.style.width = "0%";

    setTimeout(() => {

        barra.style.transition = "width 2s linear";
        barra.style.width = "100%";

        setTimeout(() => {

            boss.invulnerable = false;
            barra.style.transition = "width .3s";

            updateBossBar(boss);

        }, 2000);

    }, 50);
}


// Mensaje de victoria
function showVictoryText() {
    
    if (document.querySelectorAll(".bossHpBar").length > 0) {
    return;
}

    if (bossMusic) {

        bossMusic.pause();
        bossMusic.currentTime = 0;

    }

    if (victoryMusic) {

        victoryMusic.play();

    }

    const texto = document.getElementById("victoryText");
    
    setTimeout(() => {

    texto.style.display = "block";

    aplicarEscalaHIU();

},300);

    setTimeout(() => {

        texto.style.display = "none";

    },6300);

}

function canDamageBoss(boss) {
    return !boss.invulnerable && boss.hp > 0;
}

function playBossHit() {

    if (!bossHitSound) return;

    bossHitSound.currentTime = 0;
    bossHitSound.play();

}
function flashScreen() {

    const flash = document.getElementById("flashScreen");

    flash.style.transition = "none";
    flash.style.opacity = "1";

    setTimeout(() => {

        flash.style.transition = "opacity .8s";
        flash.style.opacity = "0";

    }, 30);

}

function startBossFight() {

    bosses.forEach(boss => {

        const dx = player.x - boss.x;
        const dy = player.y - boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let playerInSight = true;

        platforms.forEach(platform => {

            const intersectX =
                player.x > platform.x &&
                player.x < platform.x + platform.width;

            const intersectY =
                player.y > platform.y &&
                player.y < platform.y + platform.height;

            if (intersectX && intersectY) {
                playerInSight = false;
            }

        });

        if (distance <= boss.attackRange && playerInSight) {

            if (!boss.fightStarted) {

                boss.fightStarted = true;
                animateBossBar(boss);

            }

        }

    });

}

