let damageCooldown = false;

const playerSprites = {

    downIdle: new Image(),
    downWalk1: new Image(),
    downWalk2: new Image(),

    upIdle: new Image(),
    upWalk1: new Image(),
    upWalk2: new Image(),

    sideIdle: new Image(),
    sideWalk1: new Image(),
    sideWalk2: new Image(),

    attack1: new Image(),
    attack2: new Image()

};


playerSprites.downIdle.src =
    "player/downIdle.png";
    
playerSprites.downWalk1.src =
    "player/downWalk1.png";

playerSprites.downWalk2.src =
    "player/downWalk2.png";
    
playerSprites.upIdle.src =
    "player/upIdle.png";

playerSprites.upWalk1.src =
    "player/upWalk1.png";

playerSprites.upWalk2.src =
    "player/upWalk2.png";
    
playerSprites.sideIdle.src =
    "player/sideIdle.png";
    
playerSprites.sideWalk1.src =
    "player/sideWalk1.png";

playerSprites.sideWalk2.src =
    "player/sideWalk2.png";

playerSprites.attack1.src =
    "player/attack1.png";

playerSprites.attack2.src =
    "player/attack2.png";
    
const player = {

    x:300,
    y:100,

    width:60,
    height:60,


    speed:5,

    lives:3,
    
    moving:false,

attacking:false,

animationFrame:0,

animationTimer:0,
facing:1,
direction:"down",
lastDirection:"down",

    charging:false,
    isChargeAttack:false,
    chargedReleased:false,


    chargeTime:0,
    maxCharge:2000,
    chargeGlow:0,
    parrying:false,
parryTimer:0,
parryDuration:250

};

function drawPlayer(){

    if(player.chargeGlow > 0){

        context.save();

        context.globalAlpha =
            player.chargeGlow * 0.7;

        context.shadowBlur =
            20 +
            player.chargeGlow * 40;

        context.shadowColor =
            "#83DAFF";

        context.beginPath();

        context.arc(

            player.x +
            player.width / 2 -
            camera.x,

            player.y +
            player.height / 2 -
            camera.y,

            30 +
            player.chargeGlow * 20,

            0,

            Math.PI * 2

        );

        context.fillStyle =
            "#FFF";

        context.fill();

        context.restore();

    }

    if(player.parrying){

        context.save();

        context.globalAlpha = 0.7;

        context.shadowBlur = 40;

        context.shadowColor = "cyan";

        context.beginPath();

        context.arc(

            player.x +
            player.width / 2 -
            camera.x,

            player.y +
            player.height / 2 -
            camera.y,

            35,

            0,

            Math.PI * 2

        );

        context.fillStyle =
            "cyan";

        context.fill();

        context.restore();

    }

    let sprite;

if(player.attacking){

    sprite =
        player.animationFrame

        ?

        playerSprites.attack1

        :

        playerSprites.attack2;

}
    else{

        switch(player.lastDirection){

            case "up":

                if(player.moving){

                    sprite =
                        player.animationFrame

                        ?

                        playerSprites.upWalk1

                        :

                        playerSprites.upWalk2;

                }
                else{

                    sprite =
                        playerSprites.upIdle;

                }

            break;

            case "down":

                if(player.moving){

                    sprite =
                        player.animationFrame

                        ?

                        playerSprites.downWalk1

                        :

                        playerSprites.downWalk2;

                }
                else{

                    sprite =
                        playerSprites.downIdle;

                }

            break;

            default:

                if(player.moving){

                    sprite =
                        player.animationFrame

                        ?

                        playerSprites.sideWalk1

                        :

                        playerSprites.sideWalk2;

                }
                else{

                    sprite =
                        playerSprites.sideIdle;

                }

        }

    }

    context.save();

    if(

        player.lastDirection === "side" &&

        player.facing === -1

    ){

        context.scale(-1,1);

        context.drawImage(

            sprite,

            -(player.x -
            camera.x) -
            player.width,

            player.y -
            camera.y,

            player.width,

            player.height

        );

    }
    else{

        context.drawImage(

            sprite,

            player.x -
            camera.x,

            player.y -
            camera.y,

            player.width,

            player.height

        );

    }

    context.restore();

}

function drawLives() {
    const livesContainer = document.getElementById('playerLives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < player.lives; i++) {
        const life = document.createElement('div');
        life.classList.add('life');
        livesContainer.appendChild(life);
    }
}

function performChargedAttack(){
player.attacking = true;

player.animationFrame = 0;

player.animationTimer = 0;

setTimeout(()=>{

    player.attacking =
        false;

},250);

    const ratio =
        player.chargeTime /
        player.maxCharge;

    const damage =
        250 + ratio * 3;

    const attackRange = 120;

    // Jefes
    bosses.forEach(boss => {

        if(boss.invulnerable)
            return;

        const dx =
            boss.x - player.x;

        const dy =
            boss.y - player.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if(distance <= attackRange){


            boss.hp = Math.max(
    0,
    boss.hp - damage
);
registerBossDamage(
    boss,
    damage
);

            updateBossBar(boss);
            
if(
    boss.hp <= 0
){

    killBoss(boss);

}
else if(
    bossHitSound
){

    bossHitSound.currentTime = 0;
    bossHitSound.play();

}
        if (boss.pushReady) {

            pushWave(boss, 300, 220);
            return;

        }

        }

    });

    player.chargeTime = 0;
    player.chargeGlow = 0;

}

function attackWithSword(){
    
player.attacking = true;

player.animationFrame = 0;

player.animationTimer = 0;

setTimeout(()=>{

    player.attacking =
        false;

},250);

    if(player.charging)
        return;

    bosses.forEach(boss => {

        if(!hasSword)
            return;

        if(
            !isNear(
                player,
                boss,
                100
            )
        ){
            return;
        }

        if(
            boss.pushReady
        ){

            pushWave(
                boss,
                300,
                220
            );

            return;
        }

        if(
            !canDamageBoss(
                boss
            )
        ){
            return;
        }

        const damage =
            100;

        boss.hp = Math.max(

            0,

            boss.hp -
            damage

        );

        registerBossDamage(

            boss,

            damage

        );

        updateBossBar(
            boss
        );

        if(
            boss.hp <= 0
        ){

            killBoss(
                boss
            );

        }
        else if(
            bossHitSound
        ){

            bossHitSound.currentTime =
                0;

            bossHitSound.play();

        }

    });

}

function startParry(){
player.attacking = true;

player.animationFrame = 0;

player.animationTimer = 0;

setTimeout(()=>{

    player.attacking =
        false;

},250);

    if(
        player.parrying
    ){
        return;
    }

    player.parrying = true;

    player.parryTimer =
        player.parryDuration;

}

function enemyNear(){

    const attackRange = 150;

    return bosses.some(
        boss=>{

            if(
                boss.invulnerable
            ){
                return false;
            }

            const dx =
                boss.x -
                player.x;

            const dy =
                boss.y -
                player.y;

            return(

                Math.sqrt(
                    dx*dx +
                    dy*dy
                )

                <=

                attackRange

            );

        }

    );

}

function playerIsStill(){

    return(

        Math.abs(
            joystickState.x
        ) < 0.1 &&

        Math.abs(
            joystickState.y
        ) < 0.1

    );

}

function updatePlayerCombat() {

    // Parry
    if (player.parrying) {

        player.parryTimer -= 16;

        if (player.parryTimer <= 0) {
            player.parrying = false;
        }

    }

    // Ataque cargado
    if (player.charging) {

        player.chargeTime += 16;

        if (
            player.chargeTime >
            player.maxCharge
        ) {
            player.chargeTime =
                player.maxCharge;
        }

        player.chargeGlow =
            player.chargeTime /
            player.maxCharge;

    }
    else {

        player.chargeGlow = 0;

    }

    // Carga completa
    if (
        player.charging &&
        player.chargeTime >=
        player.maxCharge
    ) {

        player.charging = false;

        player.isChargeAttack =
            false;

        player.chargedReleased =
            true;

        performChargedAttack();

    }

}

function updatePlayerAnimation(){

if(player.attacking){

    player.animationTimer += 16;

    if(
        player.animationFrame === 0 &&
        player.animationTimer >= 75
    ){

        player.animationFrame = 1;

        player.animationTimer = 0;

    }

    return;
}
    player.moving =

        Math.abs(
            joystickState.x
        ) > 0.1 ||

        Math.abs(
            joystickState.y
        ) > 0.1;

    if(player.moving){

        player.animationTimer += 16;

        if(
            player.animationTimer >= 200
        ){

            player.animationFrame =
                1 -
                player.animationFrame;

            player.animationTimer =
                0;

        }

        if(

            Math.abs(
                joystickState.x
            )

            >

            Math.abs(
                joystickState.y
            )

        ){

            player.direction =
                "side";

            player.facing =

                joystickState.x > 0

                ? 1

                : -1;

        }
        else{

            player.direction =

                joystickState.y < 0

                ? "up"

                : "down";

        }

        player.lastDirection =
            player.direction;

    }
    else{

        player.animationFrame =
            0;
            player.lastDirection =
    player.direction;

    }

}

function updatePlayerMovement() {

    const prevX = player.x;

    player.x +=
        joystickState.x *
        player.speed;

    if (playerCollides()) {
        player.x = prevX;
    }

    const prevY = player.y;

    player.y +=
        joystickState.y *
        player.speed;

    if (playerCollides()) {
        player.y = prevY;
    }

}

function playerCollides() {

    for (const platform of platforms) {
        if (checkCollision(player, platform)) {
            return true;
        }
    }

    for (const box of boxes) {
        if (checkCollision(player, box)) {
            return true;
        }
    }

    for (const boss of bosses) {
        if (checkCollision(player, boss)) {
            return true;
        }
    }

    for (const object of objects) {

        if (
            object.type !== "door" &&
            object.type !== "masterDoor"
        ) continue;
        
        if(
    object.type === "door" &&
    !object.unlocked &&
    keys > 0 &&
    checkCollision(player, object)
){

    keys--;

    object.unlocked = true;

    toggleDoor(object);

    return false;
}
const blocked =
    (object.type === "door" && !object.opened) ||
    (object.type === "masterDoor" && !hasMasterKey);

if(
    blocked &&
    checkCollision(player, object)
){
    return true;
}


        if (
            blocked &&
            checkCollision(player, object)
        ) {
            return true;
        }
    }

    for (const room of bossRooms) {

        if (!room.doors) continue;

        for (const door of room.doors) {

            if (
                door.active &&
                checkCollision(player, door)
            ) {
                return true;
            }

        }

    }

    return false;
}
