namespace SpriteKind {
    export const Button = SpriteKind.create()
}
function animate_injured (character: Sprite) {
    if (character_name == "mikage") {
        if (info.life() == 2) {
            character.setImage(assets.image`MikageSemi`)
            animation.runImageAnimation(
            character,
            assets.animation`MikageSemi Injured`,
            100,
            false
            )
        } else if (info.life() == 1) {
            character.setImage(assets.image`MikageBald`)
            animation.runImageAnimation(
            character,
            assets.animation`MikageBald Injured`,
            100,
            false
            )
        } else {
            animation.runImageAnimation(
            character,
            assets.animation`Mikage Injured`,
            100,
            false
            )
        }
    } else if (character_name == "spica") {
        if (info.life() == 2) {
            character.setImage(assets.image`SpicaSemi`)
            animation.runImageAnimation(
            character,
            assets.animation`SpicaSemi Injured`,
            100,
            false
            )
        } else if (info.life() == 1) {
            character.setImage(assets.image`SpicaBald`)
            animation.runImageAnimation(
            character,
            assets.animation`SpicaBald Injured`,
            100,
            false
            )
        } else {
            animation.runImageAnimation(
            character,
            assets.animation`Spica Injured`,
            100,
            false
            )
        }
    }
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == "arcade") {
        animate_walk()
    }
})
function initialize_menu () {
    scene.setBackgroundColor(15)
    cursor = sprites.create(assets.image`Cursor`, SpriteKind.Player)
    cursor.setFlag(SpriteFlag.StayInScreen, true)
    menu_mikage = sprites.create(assets.image`Mikage Button`, SpriteKind.Button)
    menu_spica = sprites.create(assets.image`Spica Button`, SpriteKind.Button)
    controller.moveSprite(cursor)
    menu_mikage.setPosition(23, 87)
    menu_spica.setPosition(121, 87)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == "arcade") {
        timer.throttle("on_a_pressed", 150, function () {
            bullet = sprites.createProjectileFromSprite(assets.image`Mikage`, player_sprite, 200, 0)
            animation.runImageAnimation(
            bullet,
            assets.animation`EP`,
            50,
            true
            )
            music.pewPew.play()
            bullet.lifespan = 2000
        })
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == "arcade") {
        animate_walk()
    }
})
function start_game (character: string) {
    cursor.destroy()
    sprites.destroyAllSpritesOfKind(SpriteKind.Button)
    scene.setBackgroundImage(assets.image`menu_bg`)
    info.setLife(3)
    info.setScore(0)
    if (character == "mikage") {
        player_sprite = sprites.create(assets.image`Mikage`, SpriteKind.Player)
    } else if (character == "spica") {
        player_sprite = sprites.create(assets.image`Spica`, SpriteKind.Player)
    } else {
        game.over(false, effects.hearts)
    }
    controller.moveSprite(player_sprite)
    player_sprite.setStayInScreen(true)
    game.showLongText("Hello Mikage. I hope you're ready. Let's have some fun.", DialogLayout.Bottom)
    game_state = "arcade"
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite3, otherSprite3) {
    timer.throttle("on_on_overlap", 300, function () {
        animate_injured(sprite3)
        music.powerDown.play()
        scene.cameraShake(4, 500)
        info.changeLifeBy(-1)
        otherSprite3.destroy()
    })
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == "arcade") {
        animate_walk()
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == "arcade") {
        animate_walk()
    }
})
function animate_walk () {
    if (character_name == "mikage") {
        if (info.life() >= 3) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`Mikage Walk`,
            150,
            false
            )
        } else if (info.life() == 2) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`MikageSemi Walk`,
            150,
            false
            )
        } else {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`MikageBald Walk`,
            150,
            false
            )
        }
    } else if (character_name == "spica") {
        if (info.life() >= 3) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`Spica Walk`,
            150,
            false
            )
        } else if (info.life() == 2) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`SpicaSemi Walk`,
            200,
            false
            )
        } else {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`SpicaBald Walk`,
            200,
            false
            )
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    info.changeLifeBy(1)
    music.powerUp.play()
    otherSprite.destroy()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Button, function (sprite, otherSprite) {
    if (controller.A.isPressed()) {
        game_state = "arcade"
        if (otherSprite == menu_mikage) {
            character_name = "mikage"
        } else if (otherSprite == menu_spica) {
            character_name = "spica"
        } else {
            game.over(false, effects.hearts)
        }
        start_game(character_name)
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite2, otherSprite2) {
    otherSprite2.vx = 0
    otherSprite2.destroy(effects.hearts, 200)
    sprite2.destroy()
    info.changeScoreBy(1)
})
let meteor: Sprite = null
let life_up: Sprite = null
let player_sprite: Sprite = null
let bullet: Sprite = null
let menu_spica: Sprite = null
let menu_mikage: Sprite = null
let cursor: Sprite = null
let game_state = ""
let character_name = ""
character_name = "bald"
game_state = "menu"
let level_up_time = 11000
let meteor_speed = -60
let meteor_spawn = 0
initialize_menu()
game.onUpdateInterval(15000, function () {
    if (game_state == "arcade") {
        timer.after(10000, function () {
            life_up = sprites.create(assets.image`Heart`, SpriteKind.Food)
            life_up.x = scene.screenWidth()
            life_up.vx = -30
            life_up.y = randint(20, 115)
            life_up.lifespan = 8000
        })
    }
})
game.onUpdateInterval(level_up_time, function () {
    if (game_state == "arcade") {
        meteor_spawn += 0.7
        meteor_speed += -6
    }
})
game.onUpdateInterval(1000, function () {
    if (game_state == "arcade") {
        for (let index = 0; index <= Math.round(meteor_spawn); index++) {
            meteor = sprites.create(assets.image`PMikage`, SpriteKind.Enemy)
            animation.runImageAnimation(
            meteor,
            assets.animation`PMikage Walk`,
            200,
            true
            )
            meteor.x = scene.screenWidth() + randint(10, 30) * (index % 5)
            meteor.vx = randint(meteor_speed - 40, meteor_speed + 40)
            meteor.y = randint(20, 110)
            meteor.lifespan = 3500
        }
    }
})
