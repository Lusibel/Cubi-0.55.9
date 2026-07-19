const houseTemplate = {

    width:2620,
    height:1980,

    platforms:[
    ],

    objects:[],

    boxes:[],
    
ghosts:[

    {
        id:1,
        x:600,
        y:1000,

        patrolPoints:[
       { x:600, y:1000 },
       { x:700, y:1000 }
       
        ]

    },
    {
        id:2,
        x:600,
        y:1050,

        patrolPoints:[
       { x:600, y:1050 },
       { x:700, y:1050 }
       
        ]

    }

]

};

var rooms = [
    createRoom(
        1,
        houseTemplate,
        0,
        820
        
    )
];
rooms.forEach(room=>{

    loadRoom(room);

});

function createRoom(
    id,
    template,
    x,
    y
){

    return {

        id,

        left:x,
        top:y,

        right:
            x + template.width,

        bottom:
            y + template.height,

        loaded:false,


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

ghosts:
    structuredClone(
        template.ghosts || []
    ),

    };

}

function loadRoom(room){

    if(room.loaded)
        return;

    room.loaded = true;

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

    room.boxes.forEach(box=>{

        boxes.push({

            ...box,

            x:
                room.left +
                box.x,

            y:
                room.top +
                box.y

        });

    });
    
room.ghosts.forEach(data=>{

    const base =
        ghostTemplates.find(
            g => g.id === data.id
        );

    if(!base) return;

    const nuevoFantasma = {

        ...structuredClone(base),

        x:
            room.left + data.x,

        y:
            room.top + data.y

    };

    nuevoFantasma.patrolPoints =
        data.patrolPoints.map(
            point => ({

                x:
                    room.left + point.x,

                y:
                    room.top + point.y

            })
        );

    fantasmas.push(
        nuevoFantasma
    );

});

}

