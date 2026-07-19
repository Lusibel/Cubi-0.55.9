const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const warningMessage =
    document.getElementById(
        "warningMessage"
    );

const warningMessage2 =
    document.getElementById(
        "warningMessage2"
    );

function setupCanvas() {
    canvas.width = window.innerWidth - 120;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', setupCanvas);
setupCanvas();

const map = {

    width:5040,
    height:2000,

    texture:"piso",
    tileSize:720

};
const floorTiles = {};

const camera = { x: 0, y: 0 };
let cameraTarget = player;

const vision = {
    radius: 500
};


let grabbing = false;
let keys = 0;
let hasMasterKey = false;
let hasSword = false;
let startTime;
let endTime;
let gameState = "GAME";
let audioDesbloqueado = false;
let checkpoint = null;

let currentBossRoom = null;
let flashAlpha = 0;
let cameraShake = 0;

function startTimer() {
    startTime = new Date().getTime();
}

function stopTimer() {
    endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000;
    localStorage.setItem('endTime', timeTaken);
    window.location.href = 'leaderboard.html';
}
startTimer();

const projectiles = [];

function drawEntity(entity) {
    context.fillStyle = entity.color;
    context.fillRect(entity.x - camera.x, entity.y - camera.y, entity.width, entity.height);
}

function drawVisionDarkness() {

    if (currentBossRoom) {

        context.save();

        context.fillStyle =
            "rgba(0,0,0,0.0)";

        context.fillRect(
            0,
            0,
            canvas.width * ajustes.vision,
            canvas.height * ajustes.vision
        );

        context.restore();

        return;
    }

    const puntos =
        getVisionPolygon();

    context.save();

    context.beginPath();

    context.fillStyle =
        "rgba(0,0,0,0.65)";

    // Pantalla completa
    context.rect(
        0,
        0,
        canvas.width * ajustes.vision,
        canvas.height * ajustes.vision
    );

    // Polígono de visión
    context.moveTo(
        puntos[0].x - camera.x,
        puntos[0].y - camera.y
    );

    for(const p of puntos){

        context.lineTo(
            p.x - camera.x,
            p.y - camera.y
        );

    }

    context.closePath();

    context.fill("evenodd");

    context.restore();

}


function getVisionPolygon(){

    const puntos = [];

    for(let angulo = 0; angulo < 360; angulo += 0.2){

        const punto = castRay(
            angulo * Math.PI / 180
        );

        puntos.push(punto);

    }

    return puntos;

}

function castRay(angulo){

    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;

    const alcance = vision.radius;

    let mejorX = px + Math.cos(angulo) * alcance;
    let mejorY = py + Math.sin(angulo) * alcance;

    let menorDistancia = alcance;

    for(const wall of platforms){

        const choque = rayVsRect(
            px,
            py,
            mejorX,
            mejorY,
            wall
        );

        if(!choque) continue;

        const dx = choque.x - px;
        const dy = choque.y - py;

        const distancia = Math.sqrt(dx*dx + dy*dy);

        if(distancia < menorDistancia){

            menorDistancia = distancia;
            mejorX = choque.x;
            mejorY = choque.y;

        }

    }

    return {
        x: mejorX,
        y: mejorY
    };

}

function rayVsRect(x1, y1, x2, y2, rect){

    const lados = [

        [rect.x, rect.y, rect.x + rect.width, rect.y], // arriba

        [rect.x + rect.width, rect.y,
         rect.x + rect.width, rect.y + rect.height], // derecha

        [rect.x, rect.y + rect.height,
         rect.x + rect.width, rect.y + rect.height], // abajo

        [rect.x, rect.y,
         rect.x, rect.y + rect.height] // izquierda

    ];

    let mejor = null;
    let menor = Infinity;

    for(const lado of lados){

        const choque = lineIntersection(
            x1, y1,
            x2, y2,
            lado[0], lado[1],
            lado[2], lado[3]
        );

        if(!choque) continue;

        const dx = choque.x - x1;
        const dy = choque.y - y1;

        const distancia = Math.sqrt(dx*dx + dy*dy);

        if(distancia < menor){

            menor = distancia;
            mejor = choque;

        }

    }

    return mejor;

}
function lineIntersection(
    x1, y1,
    x2, y2,
    x3, y3,
    x4, y4
){

    const den =
        (x1 - x2) * (y3 - y4) -
        (y1 - y2) * (x3 - x4);

    if (Math.abs(den) < 0.000001) {
        return null;
    }

    const t =
        ((x1 - x3) * (y3 - y4) -
         (y1 - y3) * (x3 - x4)) / den;

    const u =
        ((x1 - x3) * (y1 - y2) -
         (y1 - y3) * (x1 - x2)) / den;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {

        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };

    }

    return null;

}

function drawProjectiles(){

    projectiles.forEach(
        projectile=>{

            const img =

                projectile.texture

                ?

                images[
                    textures[
                        projectile.texture
                    ]
                ]

                :

                null;

            if(img){

                context.drawImage(

                    img,

                    projectile.x -
                    camera.x,

                    projectile.y -
                    camera.y,

                    projectile.width,

                    projectile.height

                );

            }
            else{

                context.fillStyle =
                    projectile.color;

                context.fillRect(

                    projectile.x -
                    camera.x,

                    projectile.y -
                    camera.y,

                    projectile.width,

                    projectile.height

                );

            }

        }
    );

}

function drawMapFloor() {

    const tileSize =
        map.tileSize || 64;

    const startX =
        Math.floor(
            camera.x / tileSize
        ) * tileSize;

    const startY =
        Math.floor(
            camera.y / tileSize
        ) * tileSize;

    const endX =
        camera.x +
        canvas.width *
        ajustes.vision +
        tileSize;

    const endY =
        camera.y +
        canvas.height *
        ajustes.vision +
        tileSize;

    for(
        let x = startX;
        x < endX;
        x += tileSize
    ){

        for(
            let y = startY;
            y < endY;
            y += tileSize
        ){

            const key =
                `${x}_${y}`;

            if(
                floorTiles[key] ===
                undefined
            ){

                const random =
                    Math.floor(
                        Math.random() * 4
                    );

                floorTiles[key] = {

                    texture:
                        Math.random() < 0.15
                        ? "piso2"
                        : "piso",

                    flipX:
                        random === 1 ||
                        random === 3,

                    flipY:
                        random === 2 ||
                        random === 3

                };

            }

            const tile =
                floorTiles[key];

            const img =
                images[
                    textures[
                        tile.texture
                    ]
                ];

            if(!img)
                continue;

            context.save();

            context.translate(

                x -
                camera.x +
                tileSize / 2,

                y -
                camera.y +
                tileSize / 2

            );

            context.scale(

                tile.flipX
                    ? -1
                    : 1,

                tile.flipY
                    ? -1
                    : 1

            );

            context.drawImage(

                img,

                -tileSize / 2,
                -tileSize / 2,

                tileSize,
                tileSize

            );

            context.restore();

        }

    }

}



function update() {

    if (gameState === "CONSEJO")
        return;
    if (gameState === "CUTSCENE") {

        updateCamera();
        return;
    }

    updatePlayerMovement();
    updateGrab();
    updateGhosts();
    updateBossRooms();
    updateVision();
    checkObjectCollisions();
    updatePlayerCombat();
    updatePlayerAnimation();
    updateBosses();
    updateProjectiles();
    updateWarnings();
    updateCamera();

}

function updateWarnings() {

    const masterDoor =
        objects.find(
            o => o.type === "masterDoor"
        );

    warningMessage.style.display =
        masterDoor &&
        isNear(player, masterDoor)
            ? "block"
            : "none";

    warningMessage2.style.display =
        boxes.some(
            box => isNear(player, box)
        )
            ? "block"
            : "none";

}

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function checkObjectCollisions() {

    for (
        let i = objects.length - 1;
        i >= 0;
        i--
    ) {

        const object =
            objects[i];

        if (
            !checkCollision(
                player,
                object
            )
        ) {
            continue;
        }

        handleObjectCollision(
            object,
            i
        );
    }
}

function handleObjectCollision(
    object,
    index
) {

    switch (object.type) {

        case "key":
            collectKey(index);
            break;

        case "masterKey":
            collectMasterKey(index);
            break;

        case "door":
            openDoor(index);
            break;

        case "masterDoor":

            if (hasMasterKey) {
                stopTimer();
            }

            break;

        case "sword":
            collectSword(index);
            break;

        case "checkpoint":
            activateCheckpoint(object);
            break;
    }

}

function updateVision() {

    vision.radius =
        currentBossRoom &&
        quedanJefesActivos(currentBossRoom)
            ? 1000
            : 500;

}

function updateProjectiles() {

    for (
        let i = projectiles.length - 1;
        i >= 0;
        i--
    ) {

        const projectile =
            projectiles[i];

moveProjectile(projectile);

if (
    handlePlayerProjectileCollision(
        projectile,
        i
    )
) {
    continue;
}

if (
    handleBossProjectileCollision(
        projectile,
        i
    )
) {
    continue;
}

if (
    removeProjectileIfOutOfBounds(
        projectile,
        i
    )
) {
    continue;
}

        }

}
function moveProjectile(projectile) {

    projectile.x +=
        projectile.speedX ?? 0;

    projectile.y +=
        projectile.speedY ?? 0;

}
function handlePlayerProjectileCollision(
    projectile,
    index
) {

    if (
        !checkCollision(
            player,
            projectile
        )
    ) {
        return false;
    }

    // Parry
    if (
        player.parrying &&
        !projectile.fromPlayer
    ) {

        player.parrying = false;

        projectile.fromPlayer = true;

        projectile.color = "cyan";

        projectile.speedX *= -1.5;
        projectile.speedY *= -1.5;

        return true;
    }

    // Daño al jugador
    if (!projectile.fromPlayer) {

        projectiles.splice(
            index,
            1
        );

        player.lives--;

        drawLives();

        if (
            player.lives <= 0
        ) {
            resetGame();
        }

        return true;
    }

    return false;
}
function handleBossProjectileCollision(
    projectile,
    index
) {

    if (!projectile.fromPlayer) {
        return false;
    }

    for (const boss of bosses) {

        if (boss.invulnerable) {
            continue;
        }

        if (
            !checkCollision(
                projectile,
                boss
            )
        ) {
            continue;
        }

        const damage = 50;

        boss.hp = Math.max(
            0,
            boss.hp - damage
        );

        registerBossDamage(
            boss,
            damage
        );

        updateBossBar(
            boss
        );

        if (boss.hp <= 0) {
            killBoss(boss);
        }

        projectiles.splice(
            index,
            1
        );

        return true;
    }

    return false;
}
function removeProjectileIfOutOfBounds(
    projectile,
    index
) {

    if (

        projectile.x < 0 ||
        projectile.x > map.width ||
        projectile.y < 0 ||
        projectile.y > map.height

    ) {

        projectiles.splice(
            index,
            1
        );

        return true;
    }

    return false;
}

function guardarCheckpoint() {

    checkpoint = {

        x: player.x,
        y: player.y,

        lives: player.lives,

        keys,
        hasMasterKey,
        hasSword,

        objects: JSON.parse(JSON.stringify(objects)),
        bosses: JSON.parse(JSON.stringify(bosses)),
        bossRooms: JSON.parse(JSON.stringify(bossRooms)),
        boxes: JSON.parse(JSON.stringify(boxes)),

    };

}

function cargarCheckpoint() {

    if (!checkpoint) return;

    player.x = checkpoint.x;
    player.y = checkpoint.y;

    player.lives = checkpoint.lives;

    keys = checkpoint.keys;
    hasMasterKey = checkpoint.hasMasterKey;
    
    hasSword = checkpoint.hasSword;
    if (hasSword) {

    document.getElementById("attackButton").style.display = "block";

} else {

    document.getElementById("attackButton").style.display = "none";

}

    drawLives();
objects.length = 0;
objects.push(...JSON.parse(JSON.stringify(checkpoint.objects)));
bosses.length = 0;
bosses.push(...JSON.parse(JSON.stringify(checkpoint.bosses)));
bossRooms.length = 0;
boxes.length = 0;
boxes.push(...JSON.parse(JSON.stringify(checkpoint.boxes)));
bossRooms.push(...JSON.parse(JSON.stringify(checkpoint.bossRooms)));
document.getElementById("bossBars").innerHTML = "";

if (hasSword) {

    document.getElementById("attackButton").style.display = "block";

} else {

    document.getElementById("attackButton").style.display = "none";

}

if (bossMusic) {

    bossMusic.pause();
    bossMusic.currentTime = 0;
    bossMusic = null;

}

cameraTarget = player;

currentBossRoom = null;

}


function resetGame() {
    if (checkpoint) {

    cargarCheckpoint();

} else {

    window.location.reload();
}
}

function applyCameraShake() {

    if (cameraShake <= 0) {
        return;
    }

    camera.x +=
        (Math.random() - 0.5) *
        cameraShake;

    camera.y +=
        (Math.random() - 0.5) *
        cameraShake;

    cameraShake *= 0.95;

    if (cameraShake < 0.5) {
        cameraShake = 0;
    }

}

function updateCamera() {

    const visible =
        getVisibleCameraSize();

    if (currentBossRoom) {

        updateBossRoomCamera(
            visible.width,
            visible.height
        );

    } else {

        updateFollowCamera(
            visible.width,
            visible.height
        );

    }

    applyCameraShake();

}

function updateBossRoomCamera(
    visibleWidth,
    visibleHeight
) {

    const targetX =
        currentBossRoom.cameraX -
        visibleWidth / 2;

    const targetY =
        currentBossRoom.cameraY -
        visibleHeight / 2;

    camera.x +=
        (targetX - camera.x) * 0.08;

    camera.y +=
        (targetY - camera.y) * 0.08;

}
function updateFollowCamera(
    visibleWidth,
    visibleHeight
) {

    const offsetX =
        cameraTarget.width
            ? cameraTarget.width / 2
            : 0;

    const offsetY =
        cameraTarget.height
            ? cameraTarget.height / 2
            : 0;

    const targetX =
        cameraTarget.x -
        visibleWidth / 2 +
        offsetX;

    const targetY =
        cameraTarget.y -
        visibleHeight / 2 +
        offsetY;

    camera.x +=
        (targetX - camera.x) * 0.08;

    camera.y +=
        (targetY - camera.y) * 0.08;

    camera.x = Math.max(
        0,
        Math.min(
            map.width - visibleWidth,
            camera.x
        )
    );

    camera.y = Math.max(
        0,
        Math.min(
            map.height - visibleHeight,
            camera.y
        )
    );

}
function getVisibleCameraSize() {

    return {

        width:
            canvas.width *
            ajustes.vision,

        height:
            canvas.height *
            ajustes.vision

    };

}

function flashScreen() {

    flashAlpha = 1;

}
function shakeCamera(intensidad = 12) {

    cameraShake = intensidad;

}

function isNear(entity1, entity2, range = 150) {
    const dx = entity1.x + entity1.width / 2 - (entity2.x + entity2.width / 2);
    const dy = entity1.y + entity1.height / 2 - (entity2.y + entity2.height / 2);
return dx * dx + dy * dy < range * range;
}
function dentroDeVision(entity){

    const cx = entity.x + entity.width / 2;
    const cy = entity.y + entity.height / 2;

    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;

    const dx = cx - px;
    const dy = cy - py;

    if(Math.sqrt(dx * dx + dy * dy) > vision.radius){
        return false;
    }

    for(const wall of platforms){

        if(lineaChocaRecta(px, py, cx, cy, wall)){
            return false;
        }

    }

    return true;

}

function lineaChocaRecta(x1, y1, x2, y2, rect){

    const pasos = 30;

    for(let i = 0; i <= pasos; i++){

        const t = i / pasos;

        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;

        if(
            x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height
        ){
            return true;
        }

    }

    return false;

}

function showCheckpointText() {

    const texto = document.getElementById("checkpointText");

    texto.style.opacity = "1";

    clearTimeout(texto.timer);

    texto.timer = setTimeout(() => {

        texto.style.opacity = "0";

    }, 2000);

}

function gameLoop() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.scale(1 / ajustes.vision, 1 / ajustes.vision);

drawMapFloor();
drawDecorations();
drawPlatforms();

drawObjects();
drawBoxes();

fantasmas.forEach(fantasma => {
    if (dentroDeVision(fantasma)) {
        drawFantasma(fantasma);
    }
});
bosses.forEach(boss => {
    if (dentroDeVision(boss)) {
        drawBoss(boss);
    }
});

drawBossDoors();
drawProjectiles();
drawPlayer();

drawVisionDarkness();
context.restore();
update();

if (gameState === "CONSEJO") {
    drawConsejo();
}

requestAnimationFrame(gameLoop);
}

gameLoop();
