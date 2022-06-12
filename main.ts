namespace SpriteKind {
    export const Button = SpriteKind.create()
    export const Phantom = SpriteKind.create()
    export const Cursor = SpriteKind.create()
}

let mikage = {
    name: "MIKAGE",

    normalSprite: assets.image`Mikage`,
    sbaldSprite: assets.image`MikageSemi`,
    baldSprite: assets.image`MikageBald`,

    normalWalkAnim: assets.animation`Mikage Walk`,
    sbaldWalkAnim: assets.animation`MikageSemi Walk`,
    baldWalkAnim: assets.animation`MikageBald Walk`,

    normalHurtAnim: assets.animation`Mikage Injured`,
    sbaldHurtAnim: assets.animation`MikageSemi Injured`,
    baldHurtAnim: assets.animation`MikageBald Injured`
}

let spica = {
    name: "SPICA",

    normalSprite: assets.image`Spica`,
    sbaldSprite: assets.image`SpicaSemi`,
    baldSprite: assets.image`SpicaBald`,

    normalWalkAnim: assets.animation`Spica Walk`,
    sbaldWalkAnim: assets.animation`SpicaSemi Walk`,
    baldWalkAnim: assets.animation`SpicaBald Walk`,

    normalHurtAnim: assets.animation`Spica Injured`,
    sbaldHurtAnim: assets.animation`MikageSemi Injured`,
    baldHurtAnim: assets.animation`SpicaBald Injured`
}

class Player {
    sprite: Sprite;
    
    constructor() {
        this.sprite = this.initialize()
    }

    initialize() {
        // TODO: make this adjustable!
        let player = sprites.create(assets.image`Mikage`, SpriteKind.Player)
        player.data = "MIKAGE"
        controller.moveSprite(player)
        player.setStayInScreen(true)
        return player
    }

    animate_walk() {

    }
}

namespace phantom {
    export let x_speed = -60
    export let spawn_rate = 0

    sprites.onCreated(SpriteKind.Phantom, function (phantom: Sprite) {
        setWalk(phantom)
        phantom.vx = randint(x_speed - 40, x_speed + 40)
        phantom.lifespan = 3500
    })

    game.onUpdateInterval(1000, function () {
        if (gameState == "LEVEL1") {
            for (let index = 0; index <= Math.round(spawn_rate); index++) {
                let phantom = sprites.create(assets.image`PMikage`, SpriteKind.Phantom)
                setPosition(phantom, index);
            }
        }
    })

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

/**
 * animation functions (REFACTOR!)
 */
function animate_walk () {
    if (player.sprite.data == "MIKAGE") {
        if (info.life() >= 3) {
            // replace with class method
            animation.runImageAnimation(
            player.sprite,
            assets.animation`Mikage Walk`,
            150,
            false
            )
        } else if (info.life() == 2) {
            animation.runImageAnimation(
            player.sprite,
            assets.animation`MikageSemi Walk`,
            150,
            false
            )
        } else {
            animation.runImageAnimation(
            player.sprite,
            assets.animation`MikageBald Walk`,
            150,
            false
            )
        }
    } else if (player.sprite.data == "SPICA") {
        if (info.life() >= 3) {
            animation.runImageAnimation(
            player.sprite,
            assets.animation`Spica Walk`,
            150,
            false
            )
        } else if (info.life() == 2) {
            animation.runImageAnimation(
            player.sprite,
            assets.animation`SpicaSemi Walk`,
            200,
            false
            )
        } else {
            animation.runImageAnimation(
            player.sprite,
            assets.animation`SpicaBald Walk`,
            200,
            false
            )
        }
    }
}

function animate_injured(character: Sprite) {
    if (player.sprite.data == "mikage") {
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
    } else if (player.sprite.data == "spica") {
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

sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (playerSprite, lifeUpSprite) {
    info.changeLifeBy(1)
    music.powerUp.play()
    lifeUpSprite.destroy()
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Phantom, function (projectileSprite, phantomSprite) {
    phantomSprite.vx = 0
    phantomSprite.destroy(effects.hearts, 200)
    projectileSprite.destroy()
    info.changeScoreBy(1)
})

// TODO: make i-frames adjustable
sprites.onOverlap(SpriteKind.Player, SpriteKind.Phantom, function (playerSprite, phantomSprite) {
    timer.throttle("on_on_overlap", 300, function () {
        // add class method for this
        animate_injured(playerSprite)
        music.powerDown.play()
        scene.cameraShake(4, 500)
        info.changeLifeBy(-1)

        phantomSprite.destroy()
    })
})

// Initial menu event listener
sprites.onOverlap(SpriteKind.Cursor, SpriteKind.Button, function (cursorSprite, selectedSprite) {
    if (controller.A.isPressed()) {
        start_game(selectedSprite)
    }
})

function initialize_menu() {
    scene.setBackgroundImage(assets.image`menu_bg`)
    cursor = sprites.create(assets.image`Cursor`, SpriteKind.Cursor)
    cursor.setFlag(SpriteFlag.StayInScreen, true)
    menuMikage = sprites.create(assets.image`Mikage Button`, SpriteKind.Button)
    menuSpica = sprites.create(assets.image`Spica Button`, SpriteKind.Button)
    controller.moveSprite(cursor)
    menuMikage.setPosition(26, 100)
    menuSpica.setPosition(137, 100)
}

function start_game(selectedSprite: Sprite) {
    cursor.destroy()
    sprites.destroyAllSpritesOfKind(SpriteKind.Button)
    scene.setBackgroundImage(assets.image`game_bg`)
    info.setLife(3)
    info.setScore(0)
    if (selectedSprite == menuMikage) {
        // player_sprite = sprites.create(assets.image`Mikage`, SpriteKind.Player)
        // player_sprite.data = "mikage"
        game.showLongText("Hello Mikage. I hope you're ready. Let's have some fun.", DialogLayout.Bottom)
    } else if (selectedSprite == menuSpica) {
        // player_sprite = sprites.create(assets.image`Spica`, SpriteKind.Player)
        // player_sprite.data = "spica"
        game.showLongText("Hello Spica. I hope you're ready. Let's have some fun.", DialogLayout.Bottom)
    }
    player = new Player()
    gameState = "CHARACTER_SELECTED"
}

let menuSpica: Sprite = null
let menuMikage: Sprite = null
let cursor: Sprite = null
let bullet: Sprite = null
let player: Player = null
let life_up: Sprite = null
let gameState = "MENU"
let level_up_time = 11000
initialize_menu()
game.onUpdate(function () {
    // check if selected flag has been triggered, then trigger first set of listeners 
    if (gameState == "CHARACTER_SELECTED") {
        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            animate_walk()
        })
        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            animate_walk()
        })
        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            animate_walk()
        })
        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            animate_walk()
        })
        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            timer.throttle("on_a_pressed", 150, function () {
                bullet = sprites.createProjectileFromSprite(assets.image`Mikage`, player.sprite, 200, 0)
                animation.runImageAnimation(
                    bullet,
                    assets.animation`EP`,
                    50,
                    true
                )
                music.pewPew.play()
                bullet.lifespan = 2000
            })
        })

        timer.after(10000, function () {
            game.onUpdateInterval(25000, function () {
                life_up = sprites.create(assets.image`Heart`, SpriteKind.Food)
                life_up.x = scene.screenWidth()
                life_up.vx = -30
                life_up.y = randint(20, 115)
                life_up.lifespan = 8000
            })
        })

        // change flag to first level
        gameState = "LEVEL1"
    }
})
