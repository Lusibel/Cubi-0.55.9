const images = {};

function loadImage(path){

    if(images[path])
        return;

    const img =
        new Image();

    img.src = path;

    images[path] = img;

}

const textures = {

    stonea:
        "textures/stonea.png",
    stone:
        "textures/stone.png",
        
    piso2:
        "textures/piso2.png",
    piso:
        "textures/piso.png",
        
    fireball:
        "textures/fireball.png",
    skull:
        "textures/skull.png",
        
    box:
        "textures/box.png",
    door:
        "textures/door.png",
    dooropen:
        "textures/dooropen.png",
    doorLocked:
        "textures/doorLocked.png",
    doorLockedA:
        "textures/doorLockedA.png",
    doorblok:
        "textures/doorblok.png",

    sword:
        "textures/sword.png",
    key:
        "textures/key.png"

};
function loadTextures(){

    Object.values(textures)
        .forEach(path=>{

            loadImage(path);

        });

}

