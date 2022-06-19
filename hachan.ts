// this is hachan's code, dont touch :baldmikagebigbrain:

function posVec(s: Sprite) {
    return Vector.of(s.x, s.y);
}
function velVec(s: Sprite) {
    return Vector.of(s.vx, s.vy);
}

function distance(pos1: Vector, pos2: Vector): number {
    return Math.sqrt((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2);
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
    return min(valid, e => distance(posVec(e), posVec(base)));
}

const hachanBulletTurnRate = 0.2;
const hachanBulletSpeed = 200;

// Make a sprite move towards a set of coordinates, with constant velocity
function moveTo(x: number, y: number, sprite: Sprite, baseVel: number) {
    const currentDirection = velVec(sprite).normalize();

    const targetPosVec = Vector.of(x, y);
    const targetDirection = targetPosVec.subtract(posVec(sprite)).normalize();

    const displacement = distance(posVec(sprite), targetPosVec);
    const timeTaken = displacement / baseVel;

    sprite.vx = targetDirection.x * Math.abs(baseVel);
    sprite.vy = targetDirection.y * Math.abs(baseVel);

    timer.after(timeTaken * 1000, () => {
        sprite.vx = 0
        sprite.vy = 0
        animation.stopAnimation(animation.AnimationTypes.All, sprite)
    })
}

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

