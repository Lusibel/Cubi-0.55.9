
const bosses =[
    {
    esJefe: true,
    id: 0,
    nombre: "El Gran Jefe",
    
music: "audio/boss1.mp3",
victoryMusic: "audio/victory.mp3",
hitSound: "audio/bossHit.mp3",

    width: 100,
    height: 100,

    color: "black",

    hp: 2000,
    hpMax: 2000,
    damageReceived:0,
pushThreshold:500,

    attackCooldown: 0,
    attackRange: 800,

    phaseTriggers:[

        0.75,
        0.50

    ],
    
    phases:{

        1:updateBossPhase1,
        2:updateBossPhase2,
        3:updateBossPhase3

    },
    

    fightStarted: false,
    pushCharging:false,
pushChargeTime:0,
pushChargeDuration:2000,
    phase: 1,
changingPhase:false,
phaseChangeTimer:0,
phaseChangeDuration:3000,
    hitCounter: 0,
    shotCounter: 0,
    resting: false,
    pushReady: false,
    glow: false,
    barReady: false,
    invulnerable: false,
    

    dialogShown: false,
    
        dialogos: [
        {
            nombreboss: "Guardián",
            retrato: "img/boss.png",
            texto: "Quién eres tu?"
        },
        {
            nombreboss: "Guardián",
            retrato: "img/boss.png",
            texto: "Quieres pelear?"
        },
        {
            nombreboss: "Guardián",
            retrato: "img/boss.png",
            texto: "¡ATACAME!"
        }
    ]



},
    {
    esJefe: true,
    id: 1,
    nombre: "El Gran Jefe",
    
    music: "audio/boss1.mp3",
victoryMusic: "audio/victory.mp3",
hitSound: "audio/bossHit.mp3",

    width: 100,
    height: 100,

    color: "black",

    hp: 2000,
    hpMax: 2000,
    damageReceived:0,
pushThreshold:500,

    attackCooldown: 0,
    attackRange: 800,

    phaseTriggers:[

        0.75,
        0.50

    ],
    
    phases:{

        1:updateBossPhase1,
        2:updateBossPhase2,
        3:updateBossPhase3

    },
    

    fightStarted: false,
    pushCharging:false,
pushChargeTime:0,
pushChargeDuration:2000,
    phase: 1,
changingPhase:false,
phaseChangeTimer:0,
phaseChangeDuration:3000,
    hitCounter: 0,
    shotCounter: 0,
    resting: false,
    pushReady: false,
    glow: false,
    barReady: false,
    invulnerable: false,
    

    dialogShown: false,
}
];


function drawBoss(
    boss
){
if(
    boss.changingPhase
){

    const ratio =

        boss.phaseChangeTimer /
        boss.phaseChangeDuration;

    context.save();

    context.globalAlpha =
        0.5 +
        Math.sin(
            Date.now()/80
        ) * 0.5;

    context.shadowBlur =
        20 +
        ratio * 80;

    context.shadowColor =
        "red";

}

    if(
        boss.pushCharging
    ){

        const ratio =

            boss.pushChargeTime /
            boss.pushChargeDuration;

        context.save();

        context.globalAlpha =
            0.4 +
            ratio * 0.6;

        context.shadowBlur =
            20 +
            ratio * 60;

        context.shadowColor =
            "yellow";

        context.beginPath();

        context.arc(

            boss.x +
            boss.width / 2 -
            camera.x,

            boss.y +
            boss.height / 2 -
            camera.y,

            70 +
            ratio * 40,

            0,
            Math.PI * 2

        );

        context.fillStyle =
            "yellow";

        context.fill();

        context.restore();

    }

    context.fillStyle =
        boss.color;

    context.fillRect(

        boss.x -
        camera.x,

        boss.y -
        camera.y,

        boss.width,
        boss.height

    );
    if(
    boss.pushCharging
){

    for(
        let i = 0;
        i < 8;
        i++
    ){

        const angle =

            Date.now()/300 +
            i *
            Math.PI/4;

        const radius =

            90;

        const px =

            boss.x +
            boss.width/2 -
            camera.x +

            Math.cos(angle)
            * radius;

        const py =

            boss.y +
            boss.height/2 -
            camera.y +

            Math.sin(angle)
            * radius;

        context.beginPath();

        context.arc(
            px,
            py,
            8,
            0,
            Math.PI * 2
        );

        context.fillStyle =
            "yellow";

        context.fill();

    }

}

}

function updateBosses() {

    for (const boss of bosses) {
        updateBoss(boss);
    }

}

function updateBoss(boss){
    
if(
    boss.changingPhase
){

    boss.phaseChangeTimer += 16;

    boss.glow = true;

    if(

        boss.phaseChangeTimer >=
        boss.phaseChangeDuration

    ){

        boss.phase =
            boss.nextPhase;

        boss.changingPhase =
            false;

        boss.glow =
            false;

        boss.phaseChangeTimer =
            0;

        boss.shotCounter =
            0;

        boss.resting =
            false;

        boss.attackCooldown =
            0;

    }

    return;

}
    
    if(
    boss.pushCharging
){

    boss.pushChargeTime += 16;

    if(

        boss.pushChargeTime >=
        boss.pushChargeDuration

    ){

        boss.pushCharging = false;

        shakeCamera(80);
        flashScreen();

        pushWave(
            boss,
            300,
            220
        );

    }

}

    if(
        boss.invulnerable ||
        !boss.fightStarted
    ){
        return;
    }

    updateBossPhaseChange(
        boss
    );

    if(
        boss.attackCooldown > 0
    ){

        boss.attackCooldown -= 16;

    }

    if(
        boss.resting
    ){

        if(
            boss.attackCooldown <= 0
        ){

            boss.resting = false;
            boss.shotCounter = 0;

        }

        return;

    }

    boss.phases[
        boss.phase
    ](boss);

}

function killBoss(
    boss
){

    boss.hp = 0;
    boss.invulnerable = true;

    shakeCamera(60);
    flashScreen();

    setTimeout(()=>{

        boss.x = -9999;
        boss.y = -9999;

        boss.attackCooldown =
            Infinity;

        hideBossBar(boss);

        if(
            !quedanJefesActivos(
                currentBossRoom
            )
        ){

            currentBossRoom
            .doors
            .forEach(door=>{

                door.active = false;

            });

            showVictoryText();

            cameraTarget =
                player;

            currentBossRoom =
                null;

        }

    },250);

}

function registerBossDamage(
    boss,
    damage
){

    boss.damageReceived += damage;

    if(

        boss.damageReceived >=
        boss.pushThreshold

    ){

        boss.damageReceived -=
            boss.pushThreshold;
boss.pushCharging = true;
boss.pushChargeTime = 0;
boss.glow = true;

    }

}
function registerBossDamage(
    boss,
    damage
){

    if(
        boss.pushCharging
    ){
        return;
    }

    boss.damageReceived += damage;

    if(

        boss.damageReceived >=
        boss.pushThreshold

    ){

        boss.damageReceived -=
            boss.pushThreshold;

        boss.pushCharging = true;

        boss.pushChargeTime = 0;

        boss.glow = true;

    }

}