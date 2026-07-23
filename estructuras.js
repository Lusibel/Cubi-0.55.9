const platforms = []

const objects = [
    { x: 70, y: 100, width: 30, height: 30, 
    texture:"key",
    tileSize:30, type: 'key' },
    { x: 100, y: 100, width: 30, height: 30, 
    texture:"key",
    tileSize:30, type: 'key' },
    { x: 20, y: 100, width: 50, height: 50, 
    texture:"sword",
    tileSize:50, type: 'sword' },
    
createDoor({

        x:240,
        y:320,

        tileSize:120,

        lockedTexture:
           "dooropen",

        closedTexture:
            "dooropen",

        openTexture:
            "door",

        type:"door",
        
        unlocked:true,
        closedSize:{

            width:40,
            height:120

        },

        openSize:{

            width:80,
            height:30

        }
}),

createDoor({

        x:240,
        y:220,

        tileSize:120,
        
        lockedTexture:
           "doorLocked",

        closedTexture:
            "door",
        openTexture:
            "dooropen",
        type:"door",
unlocked:false,
        closedSize:{
            width:120,
            height:60
        },

        openSize:{
            width:20,
            height:80
        }

    })


]

const boxes = [
    { x: 80, y: 40, width: 60, height: 60, 
    texture:"box",
    tileSize:60, grabRange: 20 }
]

function drawPlatforms(){

    platforms.forEach(platform=>{

        if(platform.texture){

            const img =
                images[
                    textures[
                        platform.texture
                    ]
                ];

            if(img){

                const tile =
                    platform.tileSize || 50;

                for(
                    let x = 0;
                    x < platform.width;
                    x += tile
                ){

                    for(
                        let y = 0;
                        y < platform.height;
                        y += tile
                    ){

                        const drawWidth =
                            Math.min(
                                tile,
                                platform.width - x
                            );

                        const drawHeight =
                            Math.min(
                                tile,
                                platform.height - y
                            );

                        context.drawImage(

                            img,

                            platform.x +
                            x -
                            camera.x,

                            platform.y +
                            y -
                            camera.y,

                            drawWidth,
                            drawHeight

                        );

                    }

                }

                return;
            }

        }

        context.fillStyle =
            platform.color;

        context.fillRect(

            platform.x - camera.x,
            platform.y - camera.y,

            platform.width,
            platform.height

        );

    });

}

function drawObjects(){

    objects.forEach(object=>{



        if(
            !dentroDeVision(object)
        ){
            return;
        }

        if(object.texture){

            const img =
                images[
                    textures[
                        object.texture
                    ]
                ];

            if(img){
                
                const tileWidth =
    object.tileWidth ??
    object.tileSize ??
    50;

const tileHeight =
    object.tileHeight ??
    object.tileSize ??
    50;

                for(
                    let x = 0;
                    x < object.width;
                    x += tileWidth
                ){

                    for(
                        let y = 0;
                        y < object.height;
                        y += tileHeight
                    ){

                        const drawWidth =
                            Math.min(
                                tileWidth,
                                object.width - x
                            );

                        const drawHeight =
                            Math.min(
                                tileHeight,
                                object.height - y
                            );

                        context.drawImage(

                            img,

                            object.x -
                            camera.x +
                            x,

                            object.y -
                            camera.y +
                            y,

                            drawWidth,
                            drawHeight

                        );

                    }

                }

                return;

            }

        }

        drawEntity(object);

    });

}

function drawBoxes(){

    boxes.forEach(box=>{

        if(
            !dentroDeVision(box)
        ){
            return;
        }

        if(box.texture){

            const img =

                images[
                    textures[
                        box.texture
                    ]
                ];

            if(img){

                const tileWidth =
                    box.tileWidth ??
                    box.tileSize ??
                    50;

                const tileHeight =
                    box.tileHeight ??
                    box.tileSize ??
                    50;

                for(

                    let x = 0;

                    x < box.width;

                    x += tileWidth

                ){

                    for(

                        let y = 0;

                        y < box.height;

                        y += tileHeight

                    ){

                        const drawWidth =
                            Math.min(
                                tileWidth,
                                box.width - x
                            );

                        const drawHeight =
                            Math.min(
                                tileHeight,
                                box.height - y
                            );

                        context.drawImage(

                            img,

                            box.x -
                            camera.x +
                            x,

                            box.y -
                            camera.y +
                            y,

                            drawWidth,

                            drawHeight

                        );

                    }

                }

                return;

            }

        }

        drawEntity(box);

    });

}

function collectKey(index) {

    keys++;

    showItemText(
        "Llave",
        "Objetos"
    );

    objects.splice(index, 1);

}

function collectMasterKey(index) {

    hasMasterKey = true;

    showItemText(
        "Llave del jefe",
        "Objetos"
    );

    objects.splice(index, 1);

}


function collectSword(index) {

    hasSword = true;

    showItemText(
        "Espada",
        "Equipo"
    );

    attackButton.style.display =
        "block";

    objects.splice(index, 1);

}

function activateCheckpoint(object) {

    if (object.activated) {
        return;
    }

    guardarCheckpoint();

    showCheckpointText();

    object.activated = true;
    object.color = "#00ffff";

}

function moveBox(box){

    const prevX =
        box.x;

    box.x +=
        joystickState.x *
        player.speed;

    if(
        boxCollides(box)
    ){
        box.x = prevX;
    }

    const prevY =
        box.y;

    box.y +=
        joystickState.y *
        player.speed;

    if(
        boxCollides(box)
    ){
        box.y = prevY;
    }

}

function boxCollides(box){

    for(
        const platform of platforms
    ){

        if(
            checkCollision(
                box,
                platform
            )
        ){
            return true;
        }

    }

    for(
        const otherBox of boxes
    ){

        if(
            otherBox !== box &&
            checkCollision(
                box,
                otherBox
            )
        ){
            return true;
        }

    }

    // puertas cerradas
    for(
        const object of objects
    ){

        if(
            object.type === "door" &&
            !object.opened &&
            checkCollision(
                box,
                object
            )
        ){
            return true;
        }

    }

    for(
        const room of bossRooms
    ){

        if(
            !room.doors
        ) continue;

        for(
            const door of room.doors
        ){

            if(
                door.active &&
                checkCollision(
                    box,
                    door
                )
            ){
                return true;
            }

        }

    }

    return false;

}

function updateGrab(){

    if(!grabbing){

        doorPressed =
            false;

        return;
    }

    // ===== CAJAS =====

    const box =

        boxes.find(
            box =>
                isNear(
                    player,
                    box,
                    80
                )
        );

    if(box){

        moveBox(box);

        return;

    }

    // ===== PUERTAS =====

    if(
        doorPressed
    ){
        return;
    }

    const door =

        objects.find(
            object =>

                object.type ===
                "door"

                &&

                object.unlocked

                &&

                isNear(
                    player,
                    object,
                    120
                )

        );

    if(door){

        doorPressed =
            true;

        toggleDoor(
            door
        );

    }

}

function toggleDoor(
    door
){

if(
    !door.unlocked
){

    if(
        keys <= 0
    ){
        return;
    }

    keys--;

    door.unlocked = true;

    door.texture =
        door.closedTexture;
}

    // ===== CERRAR =====

    if(
        door.opened
    ){

        door.width =
            door.closedSize.width;

        door.height =
            door.closedSize.height;

        door.texture =
            door.closedTexture;

        door.opened =
            false;

    }

    // ===== ABRIR =====

    else{

        door.width =
            door.openSize.width;

        door.height =
            door.openSize.height;

        door.texture =
            door.openTexture;

        door.opened =
            true;

    }

    // ===== EVITAR ATRAPAR AL JUGADOR =====

    if(
        playerInsideDoor(
            door
        )
    ){

        // Vertical
        if(
            door.height >
            door.width
        ){

            if(
                player.x <
                door.x
            ){

                player.x =
                    door.x -
                    player.width -
                    10;

            }
            else{

                player.x =
                    door.x +
                    door.width +
                    10;

            }

        }

        // Horizontal
        else{

            if(
                player.y <
                door.y
            ){

                player.y =
                    door.y -
                    player.height -
                    10;

            }
            else{

                player.y =
                    door.y +
                    door.height +
                    10;

            }

        }

    }

}

function playerInsideDoor(
    door
){

    return checkCollision(
        player,
        door
    );

}

function createDoor(data){

    return {

        type:"door",

        unlocked:
            data.unlocked ?? false,

        autoOpen:
            data.autoOpen ?? false,

        opened:false,

        ...data,

        width:
            data.closedSize.width,

        height:
            data.closedSize.height,

        texture:
            data.lockedTexture ??
            data.closedTexture

    };

            }
                    
