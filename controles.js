const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");
const grabButton =
    document.getElementById(
        "grabButton"
    );

const attackButton =
    document.getElementById(
        "attackButton"
    );

let chargeTimer;

const joystickState = {
    x: 0,
    y: 0
};

const radio = 45;
let activo = false;

function moverJoystick(e) {
    if (!audioDesbloqueado) {
    audioDesbloqueado = true;

    beep.load();

beep.play().then(() => {
    beep.pause();
    beep.currentTime = 0;
}).catch(() => {});
}

    const rect = joystick.getBoundingClientRect();

    let x = e.clientX - rect.left - 75;
    let y = e.clientY - rect.top - 75;

    const d = Math.sqrt(x * x + y * y);

    if (d > radio) {
        x = x / d * radio;
        y = y / d * radio;
    }

    stick.style.left = (x + 45) + "px";
    stick.style.top = (y + 45) + "px";

joystickState.x = x / radio;
joystickState.y = y / radio;
}

function resetJoystick() {
joystickState.x = 0;
joystickState.y = 0;

    stick.style.left = "45px";
    stick.style.top = "45px";
}

function onAttackStart() {

    player.charging = false;
    player.isChargeAttack = false;

    chargeTimer =
        setTimeout(() => {

            player.charging = true;
            player.isChargeAttack = true;

            player.chargeTime = 0;

        }, 300);

}
function onAttackEnd() {

    clearTimeout(
        chargeTimer
    );

    if (
        player.chargedReleased
    ) {

        player.chargedReleased =
            false;

        player.chargeTime = 0;
        player.chargeGlow = 0;

        return;
    }

    if (
        player.isChargeAttack
    ) {

        performChargedAttack();

    }
    else if (
        playerIsStill() &&
        !enemyNear()
    ) {

        startParry();

        resetCharge();

        return;

    }
    else {

        attackWithSword();

    }

    resetCharge();

}
function resetCharge() {

    player.charging = false;
    player.isChargeAttack = false;

    player.chargeTime = 0;
    player.chargeGlow = 0;

}

joystick.addEventListener("pointerdown", e => {
    activo = true;
    moverJoystick(e);
});

joystick.addEventListener("pointermove", e => {
    if (activo) moverJoystick(e);
});

joystick.addEventListener("pointerup", () => {
    activo = false;
    resetJoystick();
});

joystick.addEventListener("pointercancel", () => {
    activo = false;
    resetJoystick();
});

grabButton.addEventListener(
    "touchstart",
    () => {
        grabbing = true;
    }
);

grabButton.addEventListener(
    "touchend",
    () => {
        grabbing = false;
    }
);

attackButton.addEventListener(
    "touchstart",
    onAttackStart
);

attackButton.addEventListener(
    "touchend",
    onAttackEnd
);
