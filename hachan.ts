// this is hachan's code, dont touch :baldmikagebigbrain:

function posVec(s: Sprite) {
    return Vector.of(s.x, s.y);
}
function velVec(s: Sprite) {
    return Vector.of(s.vx, s.vy);
}

function distance(s1: Sprite, s2: Sprite): number {
    return Math.sqrt((s1.x - s2.x) ^ 2 + (s1.y - s2.y) ^ 2);
}

function min<Type>(arr: Type[], fn: (e: Type) => number) {
    let minElement = arr[0];
    let minValue = fn(arr[0]);
    arr.slice(1).forEach(e => {
        let newValue = fn(e);
        if (newValue < minValue) {
            minElement = e;
            minValue = newValue;
        }
    });
    return minElement;
}

function findNearestEnemy(base: Sprite): Sprite {
    const valid = PhantomSpawner.phantoms.filter(e => e.x > player.sprite.x);
    if (!valid.length) return null;
    return min(valid, e => distance(e, base));
}

const hachanBulletTurnRate = 0.2;
const hachanBulletSpeed = 200;

// Make a sprite move towards a set of coordinates
// function moveTo(x: number, y: number, sprite: Sprite, baseVel: number) {
//     const currentDirection = velVec(sprite).normalize();

//     const targetPosVec = Vector.of(x, y);
//     const targetDirection = targetPosVec.subtract(posVec(sprite)).normalize();

//     sprite.vx = newVelocity.x;
//     sprite.vy = newVelocity.y;
// }

// Move a sprite towards a set of coordinates
function moveSpriteTo(x: number, y: number, sprite: Sprite, baseVel: number, turnRate?: number) {
    const currentDirection = velVec(sprite).normalize();

    const targetPosVec = Vector.of(x, y);
    const targetDirection = targetPosVec.subtract(posVec(sprite)).normalize();

    const angle = Math.acos(currentDirection.dot(targetDirection));
    const angleMultiplier = typeof turnRate !== 'undefined' ? Math.min(Math.abs(angle), turnRate) : Math.abs(angle);
    const clampedAngle = Math.sign(currentDirection.cross(targetDirection)) * angleMultiplier;

    const newVelocity = currentDirection.rotateByRadians(clampedAngle).multiply(baseVel);
    sprite.vx = newVelocity.x;
    sprite.vy = newVelocity.y;
}

// Move a sprite towards a target sprite
function moveSpriteToTargetSprite(source: Sprite, target: Sprite, baseVel: number, turnRate?: number) {
    const targetX = posVec(target).x
    const targetY = posVec(target).y
    if (typeof turnRate !== 'undefined') {
        moveSpriteTo(targetX, targetY, source, baseVel, turnRate)
    } else {
        moveSpriteTo(targetX, targetY, source, baseVel)
    }
}
