const platforms = [{ x: 0, y: 0, width: 200, height: 40, 
    texture:"stone",
    tileSize:40
}];

const objects = [
        { x: 70, y: 90, width: 30, height: 30, color: 'yellow', type: 'key' },
        { x: 100, y: 90, width: 30, height: 30, color: 'yellow', type: 'key' },
    { x: 20, y: 30, width: 30, height: 30, color: '#7AE1FF', type: 'sword' }
]

const boxes = [{ x: 80, y: 40, width: 50, height: 50, color: 'blue', grabRange: 20 }];

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
            object.type === "door" &&
            object.opened
        ){
            return;
        }

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

function drawBoxes() {
        boxes.forEach(box => {

    if (dentroDeVision(box)){

        drawEntity(box);

    }

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

function openDoor(index) {

    if (keys <= 0) {
        return;
    }

    keys--;

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

function moveBox(box) {

    const prevX = box.x;
    const prevY = box.y;

    box.x += joystickState.x * player.speed;
    box.y += joystickState.y * player.speed;

    for (const platform of platforms) {

        if (checkCollision(box, platform)) {

            box.x = prevX;
            box.y = prevY;
            return;

        }

    }

    for (const otherBox of boxes) {

        if (
            otherBox !== box &&
            checkCollision(box, otherBox)
        ) {

            box.x = prevX;
            box.y = prevY;
            return;

        }

    }

    if (checkCollision(box, player)) {

        box.x = prevX;
        box.y = prevY;

    }

}
function updateGrab() {

    if (!grabbing) {
        return;
    }

    const box =
        boxes.find(
            box => isNear(player, box)
        );

    if (box) {
        moveBox(box);
    }

}