// bossAttacks.js

function shootAtPlayer(
    boss,
    speed,
    color,
    texture = null
) {

    const angle =
        Math.atan2(

            player.y - boss.y,

            player.x - boss.x

        );

    projectiles.push({

        x:
            boss.x +
            boss.width / 2,

        y:
            boss.y +
            boss.height / 2,

        width: 32,
        height: 32,

        color,

        texture,

        speedX:
            Math.cos(angle) *
            speed,

        speedY:
            Math.sin(angle) *
            speed

    });

}

function shootSpread(
    boss,
    amount,
    spread,
    speed,
    color,
    texture = null
) {

    const angle =
        Math.atan2(

            player.y - boss.y,

            player.x - boss.x

        );

    const mitad =
        Math.floor(
            amount / 2
        );

    for(
        let i = -mitad;
        i <= mitad;
        i++
    ){

        const a =
            angle +
            i * spread;

        projectiles.push({

            x:
                boss.x +
                boss.width / 2,

            y:
                boss.y +
                boss.height / 2,

            width: 32,
            height: 32,

            color,

            texture,

            speedX:
                Math.cos(a) *
                speed,

            speedY:
                Math.sin(a) *
                speed

        });

    }

}

function pushWave(boss, range, force) {

    const dx = player.x - boss.x;
    const dy = player.y - boss.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= 0) return;

    if (distance < range) {

        // Movimiento en X
const stepX = dx / distance;
const stepY = dy / distance;

for (let i = 0; i < force; i++) {

    const prevX = player.x;
    player.x += stepX;

    let collision = false;

    platforms.forEach(platform => {

        if (checkCollision(player, platform)) {

            collision = true;

        }

    });
    
    bossRooms.forEach(room=>{

    if(!room.doors)
        return;

    room.doors.forEach(door=>{

        if(
            !door.active
        ){
            return;
        }

        if(
            checkCollision(
                player,
                door
            )
        ){

            collision = true;

        }

    });

});

    if (collision) {

        player.x = prevX;
        break;

    }

}

        // Movimiento en Y
for (let i = 0; i < force; i++) {

    const prevY = player.y;
    player.y += stepY;

    let collision = false;

    platforms.forEach(platform => {

        if (checkCollision(player, platform)) {

            collision = true;

        }

    });
    platforms.forEach(platform=>{

    if(
        checkCollision(
            player,
            platform
        )
    ){

        collision = true;

    }

});

bossRooms.forEach(room=>{

    if(!room.doors)
        return;

    room.doors.forEach(door=>{

        if(
            door.active &&
            checkCollision(
                player,
                door
            )
        ){

            collision = true;

        }

    });

});

    if (collision) {

        player.y = prevY;
        break;

    }

}

    }

    boss.hitCounter = 0;
    boss.pushReady = false;
    boss.glow = false;
    boss.attackCooldown = 0;
}
