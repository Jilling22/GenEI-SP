controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    player_sprite,
    assets.animation`Mikage animate`,
    150,
    false
    )
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    timer.throttle("on_a_pressed", 150, function () {
        bullet = sprites.createProjectileFromSprite(assets.image`Mikage still`, player_sprite, 200, 0)
        animation.runImageAnimation(
        bullet,
        assets.animation`EP animate`,
        50,
        true
        )
        music.pewPew.play()
        bullet.lifespan = 2000
    })
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    player_sprite,
    assets.animation`Mikage animate`,
    150,
    false
    )
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite3, otherSprite3) {
    timer.throttle("on_on_overlap", 300, function () {
        animation.runImageAnimation(
        sprite3,
        assets.animation`Mikage injured`,
        100,
        false
        )
        music.powerDown.play()
        scene.cameraShake(4, 500)
        info.changeLifeBy(-1)
        otherSprite3.destroy()
    })
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    player_sprite,
    assets.animation`Mikage animate`,
    150,
    false
    )
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    player_sprite,
    assets.animation`Mikage animate`,
    150,
    false
    )
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    info.changeLifeBy(1)
    music.powerUp.play()
    otherSprite.destroy()
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite2, otherSprite2) {
    otherSprite2.vx = 0
    otherSprite2.destroy(effects.hearts, 200)
    sprite2.destroy()
    info.changeScoreBy(1)
})
let meteor: Sprite = null
let life_up: Sprite = null
let bullet: Sprite = null
let player_sprite: Sprite = null
scene.setBackgroundImage(assets.image`bg1`)
player_sprite = sprites.create(assets.image`resize test`, SpriteKind.Player)
controller.moveSprite(player_sprite)
player_sprite.setFlag(SpriteFlag.StayInScreen, true)
info.setLife(3)
info.setScore(0)
let level_up_time = 11000
let meteor_speed = -60
let meteor_spawn = -1
game.showLongText("Hello Mikage. I hope you're ready. Let's have some fun.", DialogLayout.Bottom)
game.onUpdateInterval(15000, function () {
    timer.after(10000, function () {
        life_up = sprites.create(assets.image`Life Up`, SpriteKind.Food)
        life_up.x = scene.screenWidth()
        life_up.vx = -30
        life_up.y = randint(20, 115)
        life_up.lifespan = 8000
    })
})
game.onUpdateInterval(level_up_time, function () {
    meteor_spawn += 0.7
    meteor_speed += -6
})
game.onUpdateInterval(1000, function () {
    for (let index = 0; index <= Math.round(meteor_spawn); index++) {
        let mySprite: Sprite = null
        meteor = sprites.create(assets.image`PMikage still`, SpriteKind.Enemy)
        animation.runImageAnimation(
        mySprite,
        [img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `],
        500,
        false
        )
        meteor.x = scene.screenWidth() + randint(10, 30) * (index % 5)
        meteor.vx = randint(meteor_speed - 40, meteor_speed + 40)
        meteor.y = randint(20, 110)
        meteor.lifespan = 3500
    }
})
