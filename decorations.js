
const decorations = [];

function drawDecorations(){

    decorations.forEach(
        decoration=>{

            if(
                !dentroDeVision(
                    decoration
                )
            ){
                return;
            }

            const img =

                images[
                    textures[
                        decoration.texture
                    ]
                ];

            if(
                !img
            ){
                return;
            }

            context.drawImage(

                img,

                decoration.x -
                camera.x,

                decoration.y -
                camera.y,

                decoration.width,

                decoration.height

            );

        }
    );

}
