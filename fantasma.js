const fantasmas = [];
const ghostTemplates = [

    {
        id:1,
        width:30,
        height:30,

        color:"purple",
        speed:2,
        visionRange:350,
        currentPatrolIndex:0,
        chasing:false,
        dialogShown:false,

        dialogos:[
            {
                nombreFantasma:"Soldado",
                retrato:"img/enemy.png",
                texto:"¡Alto!"
            },
                        {
                nombreFantasma:"Soldado",
                retrato:"img/enemy.png",
                texto:"¡Alto!"
            }
        ]

    },
        {
        id:2,
        width:30,
        height:30,

        color:"purple",
        speed:2,
        visionRange:350,
        currentPatrolIndex:0,
        chasing:false,
        dialogShown:false,

        dialogos:[
            {
                nombreFantasma:"Soldado",
                retrato:"img/enemy.png",
                texto:"¡Alto!"
            },
                        {
                nombreFantasma:"Soldado",
                retrato:"img/enemy.png",
                texto:"¡Alto!"
            }
        ]

    }

];

function drawFantasma(fantasma) {
    drawEntity(fantasma);
}

function updateGhosts() {

    for (const fantasma of fantasmas) {

        updateGhostDialog(
            fantasma
        );

        updateFantasma(
            fantasma
        );

    }

}

function updateFantasma(fantasma) {
    const target = fantasma.patrolPoints[fantasma.currentPatrolIndex];
    const prevX = fantasma.x;
    const prevY = fantasma.y;

    const distX = player.x - fantasma.x;
    const distY = player.y - fantasma.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < fantasma.visionRange && canSeePlayer(fantasma)) {
        fantasma.chasing = true;
    } else {
        fantasma.chasing = false;
    }

if (!checkCollision(fantasma, player)) {

    if (fantasma.chasing) {
        moveTowardsPlayer(fantasma);
    } else {
        patrol(fantasma);
    }

}

    // Colisión con cajas
    boxes.forEach(box => {
        if (checkCollision(fantasma, box)) {
            fantasma.x = prevX;
            fantasma.y = prevY;
        }
    });

    // Colisión con el jugador
if (checkCollision(fantasma, player) && !damageCooldown) {

    fantasma.x = prevX;
    fantasma.y = prevY;

    player.lives--;
    drawLives();

    damageCooldown = true;

    setTimeout(() => {
        damageCooldown = false;
    }, 1000);

    if (player.lives <= 0) {
        resetGame();
    }
}
}

function moveTowardsPlayer(fantasma) {
    const angle = Math.atan2(player.y - fantasma.y, player.x - fantasma.x);
    fantasma.x += Math.cos(angle) * fantasma.speed;
    fantasma.y += Math.sin(angle) * fantasma.speed;
}

function patrol(fantasma) {
    const target = fantasma.patrolPoints[fantasma.currentPatrolIndex];
    const angle = Math.atan2(target.y - fantasma.y, target.x - fantasma.x);

    fantasma.x += Math.cos(angle) * fantasma.speed;
    fantasma.y += Math.sin(angle) * fantasma.speed;

    if (
        Math.abs(fantasma.x - target.x) < 5 &&
        Math.abs(fantasma.y - target.y) < 5
    ) {
        fantasma.currentPatrolIndex =
            (fantasma.currentPatrolIndex + 1) % fantasma.patrolPoints.length;
    }
}

function canSeePlayer(fantasma) {
    for (let i = 0; i < platforms.length; i++) {
        if (lineIntersects(player, fantasma, platforms[i])) {
            return false;
        }
    }
    return true;
}

function lineIntersects(player, fantasma, platform) {
    const left = platform.x;
    const right = platform.x + platform.width;
    const top = platform.y;
    const bottom = platform.y + platform.height;

    const x1 = fantasma.x + fantasma.width / 2;
    const y1 = fantasma.y + fantasma.height / 2;
    const x2 = player.x + player.width / 2;
    const y2 = player.y + player.height / 2;

    if ((x1 < left && x2 < left) || (x1 > right && x2 > right) || (y1 < top && y2 < top) || (y1 > bottom && y2 > bottom)) {
        return false;
    }

    const m = (y2 - y1) / (x2 - x1);
    const yIntercept = y1 - m * x1;

    const intersectionY1 = m * left + yIntercept;
    const intersectionY2 = m * right + yIntercept;
    const intersectionX1 = (top - yIntercept) / m;
    const intersectionX2 = (bottom - yIntercept) / m;

    return (intersectionY1 > top && intersectionY1 < bottom) || (intersectionY2 > top && intersectionY2 < bottom) ||
           (intersectionX1 > left && intersectionX1 < right) || (intersectionX2 > left && intersectionX2 < right);
}

function updateGhostDialog(fantasma) {

    if (
        gameState !== "GAME" ||
        !fantasma.dialogos ||
        fantasma.dialogShown
    ) {
        return;
    }

    const dx = player.x - fantasma.x;
    const dy = player.y - fantasma.y;

    if (
        dx * dx + dy * dy >
        fantasma.visionRange *
        fantasma.visionRange
    ) {
        return;
    }

    if (!canSeePlayer(fantasma)) {
        return;
    }

    fantasma.dialogShown = true;

    cameraTarget = fantasma;

    mostrarDialogo(fantasma);

}