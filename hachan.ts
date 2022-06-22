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

// Make a sprite move to a set of coordinates with constant speed (synchronous)
function moveTo(x: number, y: number, sprite: Sprite, speed: number, pause: number, travelAnim?: Image[]) {

    const sourceCoord = travelQueue.length > 0 ? travelQueue[travelQueue.length - 1] : posVec(sprite);
    const targetCoord = Vector.of(x, y);

    const newVelocity = targetCoord.subtract(sourceCoord).normalize().multiply(Math.abs(speed));

    const vectorDistance = distance(sourceCoord, targetCoord);
    const timeTaken = vectorDistance / speed;

    travelQueue.push(targetCoord);

    timer.after(delay, () => {
        sprite.vx = newVelocity.x;
        sprite.vy = newVelocity.y;
        if (typeof travelAnim !== 'undefined') {
            animation.runImageAnimation(sprite, travelAnim, 150, true)
        }
    })

    timer.after(delay + timeTaken * 1000 - 50, () => {
        sprite.vx = 0
        sprite.vy = 0
 
        animation.stopAnimation(animation.AnimationTypes.All, sprite)
        travelQueue.shift();
    });

    delay += timeTaken * 1000 + pause;
}

function moveToPoints(points: Vector[], sprite: Sprite, baseVel: number, pause: number, travelAnim: Image[]) {
    points.forEach(v => {  
        moveTo(v.x, v.y, sprite, baseVel, pause, travelAnim)
    });
}

// Make a sprite accelerate to a set of coordinates with constant acceleration (synchronous)
function accelerateTo(x: number, y: number, sprite: Sprite, accel: number, pause: number, travelAnim?: Image[]) {

    const sourceCoord = travelQueue.length > 0 ? travelQueue[travelQueue.length - 1] : posVec(sprite);
    const targetCoord = Vector.of(x, y);

    const newAcceleration = targetCoord.subtract(sourceCoord).normalize().multiply(Math.abs(accel));

    const vectorDistance = distance(sourceCoord, targetCoord);
    const timeTaken = Math.sqrt(vectorDistance * 2 / accel);

    travelQueue.push(targetCoord);

    timer.after(delay, () => {
        sprite.vx = 0
        sprite.vy = 0
        sprite.ax = newAcceleration.x;
        sprite.ay = newAcceleration.y;
        if (typeof travelAnim !== 'undefined') {
            animation.runImageAnimation(sprite, travelAnim, 150, true)
        }
    })

    timer.after(delay + timeTaken * 1000 + 50, () => {
        sprite.vx = 0
        sprite.vy = 0
        sprite.ax = 0
        sprite.ay = 0

        animation.stopAnimation(animation.AnimationTypes.All, sprite)
        travelQueue.shift();
    });

    delay += timeTaken * 1000 + pause;
}

// Move a sprite towards a set of coordinates, homing-style
function moveHomingSpriteTo(x: number, y: number, sprite: Sprite, speed: number, turnRate?: number) {
    const currentDirection = velVec(sprite).normalize();

    const targetPosVec = Vector.of(x, y);
    const targetDirection = targetPosVec.subtract(posVec(sprite)).normalize();

    const angle = Math.acos(currentDirection.dot(targetDirection));
    const angleMultiplier = typeof turnRate !== 'undefined' ? Math.min(Math.abs(angle), turnRate) : Math.abs(angle);
    const clampedAngle = Math.sign(currentDirection.cross(targetDirection)) * angleMultiplier;

    const newVelocity = currentDirection.rotateByRadians(clampedAngle).multiply(speed);
    sprite.vx = newVelocity.x;
    sprite.vy = newVelocity.y;
}

// Move a sprite towards a target sprite, homing-style
function moveHomingSpriteToTargetSprite(source: Sprite, target: Sprite, baseVel: number, turnRate?: number) {
    const targetX = posVec(target).x
    const targetY = posVec(target).y
    if (typeof turnRate !== 'undefined') {
        moveHomingSpriteTo(targetX, targetY, source, baseVel, turnRate)
    } else {
        moveHomingSpriteTo(targetX, targetY, source, baseVel)
    }
}

// Aim a bullet straight towards a target sprite (different from homing!)
function aimAtTarget(target: Sprite, bullet: Sprite, speed: number) {
    const sourceVec = posVec(bullet)
    const targetVec = posVec(target)

    const newVelocity = targetVec.subtract(sourceVec).normalize().multiply(Math.abs(speed))

    bullet.vx = newVelocity.x
    bullet.vy = newVelocity.y

    bullet.setFlag(SpriteFlag.AutoDestroy, true)
    music.pewPew.play()
}

// Aim a bullet at a certain angle clockwise, from 12 o'clock (in degrees)
function aimAtAngle(degrees: number, bullet: Sprite, speed: number) {
    const baseDirection = Vector.of(0, 1);
    const radians = degrees * (Math.PI / 180);

    const newVelocity = baseDirection.rotateByRadians(radians).multiply(speed)

    bullet.vx = newVelocity.x
    bullet.vy = newVelocity.y

    bullet.setFlag(SpriteFlag.AutoDestroy, true)
    music.pewPew.play()
}
