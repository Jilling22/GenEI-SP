namespace SpriteKind {
    export const Button = SpriteKind.create()
    export const Phantom = SpriteKind.create()
    export const Cursor = SpriteKind.create()
}

class Player {
    spriteAssets: CharacterData
    sprite: Sprite
    walkAnim: Image[]
    hurtAnim: Image[]
    
    constructor(character: CharacterData) {
        this.spriteAssets = character

        this.sprite = sprites.create(character.normalSprite, SpriteKind.Player)
        this.sprite.data = character.name
        this.walkAnim = character.normalWalkAnim
        this.hurtAnim = character.normalHurtAnim
        
        controller.moveSprite(this.sprite)
        this.sprite.setStayInScreen(true)

        game.showLongText("Hello Mikage. I hope you're ready. Let's have some fun.", DialogLayout.Bottom)
    }

    animateWalk() {
        const sprite = this.sprite
        const walk = this.walkAnim
        animation.runImageAnimation(sprite, walk, 150, false)
    }

    animateHurt() {
        const sprite = this.sprite
        const hurt = this.hurtAnim
        animation.runImageAnimation(sprite, hurt, 100, false)
    }

    updateHair() {
        const spriteAssets = this.spriteAssets 

        if (info.life() >= 3) {
            this.sprite.setImage(spriteAssets.normalSprite)
            this.walkAnim = spriteAssets.normalWalkAnim
            this.hurtAnim = spriteAssets.normalHurtAnim
        } else if (info.life() == 2) {
            this.sprite.setImage(spriteAssets.sbaldSprite)
            this.walkAnim = spriteAssets.sbaldWalkAnim
            this.hurtAnim = spriteAssets.sbaldHurtAnim
        } else if (info.life() == 1) {
            this.sprite.setImage(spriteAssets.baldSprite)
            this.walkAnim = spriteAssets.baldWalkAnim
            this.hurtAnim = spriteAssets.baldHurtAnim
        }
    }
}

class PhantomSpawner {
    spawnFlag: string
    walkSpd: number
    spawnInterval: number
    spawnRate: number
    walkSpdVar: number
    staysFor: number

    spriteImg: Image
    walkAnim: Image[]

    constructor(data: LevelData) {
        this.spawnFlag = data.spawnFlag
        this.walkSpd = data.walkSpd
        this.walkSpdVar = data.walkSpdVar
        this.spawnInterval = data.spawnInterval
        this.spawnRate = data.spawnRate
        this.staysFor = ((scene.screenWidth() + 10) / (this.walkSpd + this.walkSpdVar)) * -1000

        this.spriteImg = data.spriteImg
        this.walkAnim = data.walkAnim

        game.onUpdateInterval(this.spawnInterval, function () {
            if (gameState === this.spawnFlag && Math.percentChance(this.spawnRate)) {
                let phantom = sprites.create(this.spriteImg, SpriteKind.Phantom)

                phantom.x = scene.screenWidth() + 10;
                phantom.y = randint(20, 110)
                phantom.vx = randint(this.walkSpd - this.walkSpdVar, this.walkSpd + this.walkSpdVar)

                phantom.lifespan = this.staysFor

                animation.runImageAnimation(phantom, this.walkAnim, 200, true)
            }
        })
    }
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (playerSprite, lifeUpSprite) {
    info.changeLifeBy(1)
    player.updateHair()
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
    
        info.changeLifeBy(-1)
        player.updateHair()
        player.animateHurt()
        music.powerDown.play()
        scene.cameraShake(4, 500)

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
        player = new Player(MIKAGE)
    } else if (selectedSprite == menuSpica) {
        player = new Player(SPICA)
    }
    gameState = "CHARACTER_SELECTED"
}

let menuSpica: Sprite = null
let menuMikage: Sprite = null
let cursor: Sprite = null
let bullet: Sprite = null
let player: Player = null
let life_up: Sprite = null
let gameState = "MENU"
initialize_menu()

game.onUpdate(function () {

    // check if selected flag has been triggered, then trigger first set of listeners 
    if (gameState == "CHARACTER_SELECTED") {

        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            player.animateWalk()
        })
        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            player.animateWalk()
        })
        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            player.animateWalk()
        })
        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            player.animateWalk()
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
        let firstWave: PhantomSpawner = new PhantomSpawner(LEVEL1)
    }
})
