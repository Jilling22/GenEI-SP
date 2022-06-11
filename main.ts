// custom sprite category
namespace SpriteKind {
    export const Button = SpriteKind.create()
    export const Phantom = SpriteKind.create()
}

namespace phantom {
    export let x_speed = -60
    export let spawn_rate = 0

    // spawn function
    sprites.onCreated(SpriteKind.Phantom, function (phantom: Sprite) {
        setWalk(phantom)
        phantom.vx = randint(x_speed - 40, x_speed + 40)
        phantom.lifespan = 3500
    });

    // oncreate functions
    game.onUpdateInterval(1000, function () {
        if (game_state == "arcade") {
            for (let index = 0; index <= Math.round(spawn_rate); index++) {
                let phantom = sprites.create(assets.image`PMikage`, SpriteKind.Phantom)
                setPosition(phantom, index);
            }
        }
    })

    // setposition function
    function setPosition(pmikage: Sprite, index: number) {
        pmikage.x = scene.screenWidth() + randint(10, 30) * (index % 5)
        pmikage.y = randint(20, 110)
    }

    function setWalk(pmikage: Sprite) {
        animation.runImageAnimation(pmikage,
            assets.animation`PMikage Walk`,
            200,
            true
        )
    }

}

// controller events
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == "arcade") {
        animate_walk()
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == "arcade") {
        animate_walk()
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == "arcade") {
        animate_walk()
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == "arcade") {
        animate_walk()
    }
})

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

// animation functions (REFACTOR!)

function animate_walk() {
    if (character_name == "mikage") {
        if (info.life() >= 3) {
            // replace with class method
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

sprites.onOverlap(SpriteKind.Player, SpriteKind.Phantom, function (sprite3, otherSprite3) {
    timer.throttle("on_on_overlap", 300, function () {
        animate_injured(sprite3)
        music.powerDown.play()
        scene.cameraShake(4, 500)
        info.changeLifeBy(-1)
        otherSprite3.destroy()
    })
})


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
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Phantom, function (sprite2, otherSprite2) {
    otherSprite2.vx = 0
    otherSprite2.destroy(effects.hearts, 200)
    sprite2.destroy()
    info.changeScoreBy(1)
})

function initialize_menu() {
    scene.setBackgroundImage(assets.image`menu_bg`)
    cursor = sprites.create(assets.image`Cursor`, SpriteKind.Player)
    cursor.setFlag(SpriteFlag.StayInScreen, true)
    menu_mikage = sprites.create(assets.image`Mikage Button`, SpriteKind.Button)
    menu_spica = sprites.create(assets.image`Spica Button`, SpriteKind.Button)
    controller.moveSprite(cursor)
    menu_mikage.setPosition(26, 100)
    menu_spica.setPosition(137, 100)
}

function start_game(character: string) {
    cursor.destroy()
    sprites.destroyAllSpritesOfKind(SpriteKind.Button)
    scene.setBackgroundImage(assets.image`game_bg`)
    info.setLife(3)
    info.setScore(0)
    if (character == "mikage") {
        player_sprite = sprites.create(assets.image`Mikage`, SpriteKind.Player)
        game.showLongText("Hello Mikage. I hope you're ready. Let's have some fun.", DialogLayout.Bottom)
    } else if (character == "spica") {
        player_sprite = sprites.create(assets.image`Spica`, SpriteKind.Player)
        game.showLongText("Hello Spica. I hope you're ready. Let's have some fun.", DialogLayout.Bottom)
    } else {
        game.over(false, effects.hearts)
    }
    controller.moveSprite(player_sprite)
    player_sprite.setStayInScreen(true)
    game_state = "arcade"
}

let life_up: Sprite = null
let player_sprite: Sprite = null
let bullet: Sprite = null
let menu_spica: Sprite = null
let menu_mikage: Sprite = null
let cursor: Sprite = null
let game_state = "menu"
let character_name = "bald"
let level_up_time = 11000

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
        phantom.spawn_rate += 0.7
        phantom.x_speed += -6
    }
})
