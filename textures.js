
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

    player:
        "textures/player.png",
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
        "textures/skull.png"

};
function loadTextures(){

    Object.values(textures)
        .forEach(path=>{

            loadImage(path);

        });

}

