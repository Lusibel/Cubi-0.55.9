const bossRoom1 = {

width:1400,  
height:800,  
  
fightArea:{  

left:250,  
top:80,  

right:900,  
bottom:660

},

activated:false,  
consejoMostrado:false,  
loaded:false,  

bosses:[  

    {  
        id:0,  
        x:650,  
        y:350,  
    iniciaCombate:true  
    }  

],  

platforms: [  

{ x: 80, y: 0, width: 560, height: 80, texture:"stone", tileSize:80},  
{ x: 760, y: 0, width: 560, height: 80, texture:"stone", tileSize:80},  
{ x: 0, y: 720, width: 640, height: 80, texture:"stone", tileSize:80},  
{ x: 760, y: 720, width: 640, height: 80, texture:"stone", tileSize:80},  
{ x: 0, y: 0, width: 80, height: 720, texture:"stonea", tileSize:80},  
{ x: 1320, y: 0, width: 80, height: 720, texture:"stonea", tileSize:80}  

],

objects:[
createDoor({

        x:640,
        y:720,

        tileSize:120,
        lockedTexture:
           "doorLocked",
        closedTexture:
            "door",
        openTexture:
            "dooropen",
        type:"door",

        closedSize:{
            width:120,
            height:60
        },

        openSize:{
            width:20,
            height:60
        }

    }) 


],
boxes: [],

decorations:[],

doors: [

{  
    x: 640,  
    y: 720,  
    width: 120,  
    height: 60,  
    type: "bossDoor",  
    active: false,  
    
    tileSize:120,
    texture:"doorblok"
},  

{  
    x: 640,  
    y: 20,  
    width: 120,  
    height: 60,  
    type: "bossDoor",  
    active: false,  
    
    tileSize:120,
    texture:"doorblok"
}

]

};
const bossRoom2 = {

width:1400,  
height:800,  
  
fightArea:{  

left:250,  
top:80,  

right:900,  
bottom:660

},

activated:false,  
consejoMostrado:false,  
loaded:false,  

bosses:[

{  
    id:0,  
    x:1020,  
    y:350,  
    iniciaCombate:true  
},  

{  
    id:1,  
    x:280,  
    y:350,  
    iniciaCombate:false  
}

],

platforms: [  

{ x: 80, y: 0, width: 560, height: 80, texture:"stone", tileSize:80},  
{ x: 760, y: 0, width: 560, height: 80, texture:"stone", tileSize:80},  
{ x: 0, y: 720, width: 640, height: 80, texture:"stone", tileSize:80},  
{ x: 760, y: 720, width: 640, height: 80, texture:"stone", tileSize:80},  
{ x: 0, y: 0, width: 80, height: 720, texture:"stonea", tileSize:80},  
{ x: 1320, y: 0, width: 80, height: 720, texture:"stonea", tileSize:80}  

],

objects:[
createDoor({

        x:640,
        y:20,

        tileSize:120,

        closedTexture:
            "door",
        lockedTexture:
           "doorLocked",
        openTexture:
            "dooropen",
        type:"door",

        closedSize:{
            width:120,
            height:60
        },

        openSize:{
            width:20,
            height:60
        }

    }),
createDoor({

        x:640,
        y:720,

        tileSize:120,

        closedTexture:
            "door",
        lockedTexture:
           "doorLocked",
        openTexture:
            "dooropen",
        type:"door",

        closedSize:{
            width:120,
            height:60
        },

        openSize:{
            width:20,
            height:60
        }

    }) 


],

boxes: [],

decorations:[],

doors: [

{  
    x: 640,  
    y: 720,  
    width: 120,  
    height: 60,  
    type: "bossDoor",  
    active: false,  
    
    tileSize:120,
    texture:"doorblok"
},  

{  
    x: 640,  
    y: 20,  
    width: 120,  
    height: 60,  
    type: "bossDoor",  
    active: false,  
    
    tileSize:120,
    texture:"doorblok"
}

]

};

var bossRooms = [

createBossRoom(  
    1,  
    bossRoom1,  
    0,  
    920  
      
),  
createBossRoom(  
    2,  
    bossRoom1,  
    440,  
    0  
),  
createBossRoom(  
    3,  
    bossRoom2,  
    1560,  
    920  
      
),

createBossRoom(  
    4,  
    bossRoom2,  
    1900,  
    0  
      
)

];

bossRooms.forEach(room=>{

loadBossRoomStructure(room);

});

function playerInsideBossRoom(room) {

return (  
    player.x >= room.left &&  
    player.x <= room.right &&  
    player.y >= room.top &&  
    player.y <= room.bottom  
);

}
function playerInsideFightArea(room){

return(  

    player.x >=  
    room.left +  
    room.fightArea.left &&  

    player.x <=  
    room.left +  
    room.fightArea.right &&  

    player.y >=  
    room.top +  
    room.fightArea.top &&  

    player.y <=  
    room.top +  
    room.fightArea.bottom  

);

}

function comenzarCombateReal(room){

room.doors.forEach(  
    door => door.active = true  
);  

room.bosses.forEach(data=>{  

    const boss =  
        bosses.find(  
            b=>b.id===data.id  
        );  

    if(!boss) return;  

    boss.fightStarted = true;  
    boss.barReady = true;  

    animateBossBar(  
        boss,  
        data.iniciaCombate  
    );  

});

}

function loadBossRoomStructure(room){

room.platforms.forEach(platform=>{  

    platforms.push({  

        ...platform,  

        x:  
            room.left +  
            platform.x,  

        y:  
            room.top +  
            platform.y  

    });  

});  

room.objects.forEach(object=>{  

    objects.push({  

        ...object,  

        x:  
            room.left +  
            object.x,  

        y:  
            room.top +  
            object.y  

    });  

});  



}

function iniciarSalaJefe(room){

loadBossRoom(room);

}

function quedanJefesActivos(room){

return room.bosses.some(data=>{  

    const boss =  
        bosses.find(  
            b => b.id === data.id  
        );  

    return boss && boss.hp > 0;  

});

}

function drawBossDoors(){

    bossRooms.forEach(room=>{

        room.doors.forEach(door=>{

            if(
                door.type !==
                "bossDoor"
            ){
                return;
            }

            if(
                !door.active
            ){
                return;
            }

            if(
                door.texture
            ){

                const img =

                    images[
                        textures[
                            door.texture
                        ]
                    ];

                if(img){

                    context.drawImage(

                        img,

                        door.x -
                        camera.x,

                        door.y -
                        camera.y,

                        door.width,

                        door.height

                    );

                    return;

                }

            }

            context.fillStyle =
                door.color;

            context.fillRect(

                door.x -
                camera.x,

                door.y -
                camera.y,

                door.width,

                door.height

            );

        });

    });

}

function loadBossRoom(room){

if(room.loaded) return;  

room.loaded = true;  

room.bosses.forEach(data=>{  

    const boss =  
        bosses.find(  
            b=>b.id===data.id  
        );  

    if(!boss) return;  
    resetBoss(boss);  

    boss.x =  
        room.left + data.x;  

    boss.y =  
        room.top + data.y;  

});  



room.boxes.forEach(box=>{  

    boxes.push({  

        ...box,  

        x:  
            room.left + box.x,  

        y:  
            room.top + box.y  

    });  

});

room.decorations.forEach(
    decoration=>{

        decorations.push({

            ...decoration,

            x:
                room.left +
                decoration.x,

            y:
                room.top +
                decoration.y,

            roomId:
                room.id

        });

    }
);
}

function createBossRoom(
id,
template,
x,
y
){

return {

id,  

left:x,  
top:y,  

right:x + template.width,  
bottom:y + template.height,  

cameraX:x + template.width / 2,  
cameraY:y + template.height / 2,  

entered:false,  
activated:false,  

loaded:false,  
structureLoaded:false,  

fightArea:  
    structuredClone(  
        template.fightArea || {  
            left:0,  
            top:0,  
            right:template.width,  
            bottom:template.height  
        }  
    ),  

bosses:  
    structuredClone(  
        template.bosses || []  
    ),  

platforms:  
    structuredClone(  
        template.platforms || []  
    ),  

objects:  
    structuredClone(  
        template.objects || []  
    ),  

boxes:  
    structuredClone(  
        template.boxes || []  
    ),  
decorations:  
    structuredClone(  
        template.decorations || []  
    ),  

doors:  

    (template.doors || []).map(  
        door => ({  

            ...door,  

            x:x + door.x,  
            y:y + door.y  

        })  
    )

};

}
function resetBoss(boss){

boss.hp = boss.hpMax;  

boss.invulnerable = false;  

boss.fightStarted = false;  

boss.hitCounter = 0;  

boss.shotCounter = 0;  

boss.phase = 1;  

boss.resting = false;  

boss.pushReady = false;  

boss.glow = false;  

boss.barReady = false;  

boss.dialogShown = false;  

boss.attackCooldown = 0;

}

function updateBossRooms() {

    for (const room of bossRooms) {

        updateBossRoom(room);

    }

}

function updateBossRoom(room) {

    if (playerInsideBossRoom(room)) {
        iniciarSalaJefe(room);
    }

    if (
        !playerInsideFightArea(room) ||
        room.activated
    ) {
        return;
    }

    room.activated = true;

    currentBossRoom = room;

    const jefe = room.bosses
        .map(data =>
            bosses.find(
                boss => boss.id === data.id
            )
        )
        .find(Boolean);

    if (jefe) {

        npcPendiente = jefe;

        mostrarDialogo(jefe);

    }

  }
