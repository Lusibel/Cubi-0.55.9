function updateBossPhaseChange(boss){

    if(!boss.phaseTriggers){
        return;
    }

    const hpPercent =
        boss.hp / boss.hpMax;

    boss.phaseTriggers.forEach(
        (trigger, index)=>{

            const currentPhase =
                index + 1;

            const nextPhase =
                index + 2;

            if(
                boss.phase === currentPhase &&
                hpPercent <= trigger
            ){

                boss.phase =
                    nextPhase;

                shakeCamera(40);
                flashScreen();

            }

        }
    );

}
function updateBossPhase1(boss){

    if(
        boss.attackCooldown > 0
    ){
        return;
    }

shootAtPlayer(

    boss,

    7,

    "purple",

    "fireball"

);


    boss.shotCounter++;

    if(
        boss.shotCounter >= 3
    ){

        boss.resting = true;

        boss.attackCooldown =
            5000;

    }
    else{

        boss.attackCooldown =
            1000;

    }

}
function updateBossPhase2(boss){

    if(
        boss.attackCooldown > 0
    ){
        return;
    }

    shootSpread(
        boss,
        3,
        0.4,
        6,
        "orange",
        "fireball"
    );

    boss.shotCounter++;

    if(
        boss.shotCounter >= 5
    ){

        boss.resting = true;

        boss.attackCooldown =
            5000;

    }
    else{

        boss.attackCooldown =
            1500;

    }

}
function updateBossPhase3(boss){

    if(
        boss.attackCooldown > 0
    ){
        return;
    }

    shootSpread(
        boss,
        5,
        0.25,
        4,
        "red",
        "fireball"
    );

    boss.shotCounter++;

    if(
        boss.shotCounter >= 2
    ){

        boss.resting = true;

        boss.attackCooldown =
            5000;

    }
    else{

        boss.attackCooldown =
            1500;

    }

}
function updateBossPhaseFiesta(boss){

    if(
        boss.attackCooldown > 0
    ){
        return;
    }

    const random =
        Math.floor(
            Math.random() * 4
        );

    switch(random){

        case 0:

            shootAtPlayer(
                boss,
                12,
                "cyan"
            );

        break;

        case 1:

            shootSpread(
                boss,
                8,
                0.15,
                6,
                "yellow"
            );

        break;

        case 2:

            shootSpread(
                boss,
                16,
                0.40,
                4,
                "lime"
            );

        break;

        case 3:

            pushWave(
                boss,
                500,
                150
            );

        break;

    }

    boss.glow =
        !boss.glow;

    boss.attackCooldown =
        700;

}
