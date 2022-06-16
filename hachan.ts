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

