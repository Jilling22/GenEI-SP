

class Player {
    spriteAssets: CharacterData
    sprite: Sprite
    walkAnim: Image[]
    hurtAnim: Image[]

    agility: number
    bulletSpeed: number
    shootCooldown: number
    iframes: number

    constructor(character: CharacterData) {
        info.setLife(character.startingLives)
        info.setScore(0)

        this.spriteAssets = character

        this.sprite = sprites.create(character.normalSprite, SpriteKind.Player)
        this.sprite.data = character.name
        this.walkAnim = character.normalWalkAnim
        this.hurtAnim = character.normalHurtAnim

        this.agility = character.agility
        this.bulletSpeed = character.bulletSpeed
        this.shootCooldown = character.shootCooldown

        this.iframes = character.iframes

        controller.moveSprite(this.sprite, this.agility, this.agility)
        this.sprite.setStayInScreen(true)

        game.showLongText(`Hello ${character.name}. I hope you're ready. Let's have some fun.`, DialogLayout.Bottom)

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            timer.throttle("on_a_pressed", this.shootCooldown, function () {
                bullet = sprites.createProjectileFromSprite(
                    assets.image`Mikage`,
                    player.sprite,
                    this.bulletSpeed,
                    0)
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

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (playerSprite, lifeUpSprite) {
            info.changeLifeBy(1)
            this.updateHair()
            music.powerUp.play()

            lifeUpSprite.destroy()
        })

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Phantom, function (playerSprite, phantomSprite) {
            timer.throttle("on_on_overlap", this.iframes, function () {

                info.changeLifeBy(-1)
                this.updateHair()
                this.animateHurt()

                music.powerDown.play()
                scene.cameraShake(4, 500)

                phantomSprite.destroy()
            })
        })
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

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Phantom, function (projectileSprite, phantomSprite) {
    phantomSprite.vx = 0
    phantomSprite.destroy(effects.hearts, 200)
    projectileSprite.destroy()
    info.changeScoreBy(1)
})

function initializeMenu() {
    scene.setBackgroundImage(assets.image`mainmenu_bg`)
    sprites.create(assets.image`title`, SpriteKind.Placeholder)
    playButton = sprites.create(assets.image`Play Button`, SpriteKind.PlayButton)
    helpButton = sprites.create(assets.image`Help Button`, SpriteKind.HelpButton)

    playButton.setPosition(45, 98)
    helpButton.setPosition(115, 98)

    cursor = sprites.create(assets.image`Cursor`, SpriteKind.Cursor)
    controller.moveSprite(cursor)
    cursor.setFlag(SpriteFlag.StayInScreen, true)
    cursor.z = 1

    sprites.onOverlap(SpriteKind.Cursor, SpriteKind.PlayButton, function (cursorSprite, selectedSprite) {
        if (controller.A.isPressed()) {
            sprites.destroyAllSpritesOfKind(SpriteKind.Placeholder)
            sprites.destroyAllSpritesOfKind(SpriteKind.PlayButton)
            sprites.destroyAllSpritesOfKind(SpriteKind.HelpButton)
            characterSelect()
        }
    })
}

function characterSelect() {
    scene.setBackgroundImage(assets.image`menu_bg`)

    menuMikage = sprites.create(assets.image`Mikage Button`, SpriteKind.CharacterButton)
    menuSpica = sprites.create(assets.image`Spica Button`, SpriteKind.CharacterButton)
    menuYuuhi = sprites.create(assets.image`Yuuhi Button`, SpriteKind.CharacterButton)
    menuUrara = sprites.create(assets.image`Urara Button`, SpriteKind.CharacterButton)
    
    menuMikage.setPosition(26, 100)
    menuSpica.setPosition(62, 100)
    menuYuuhi.setPosition(98, 100)
    menuUrara.setPosition(134, 100)

    

    // Initial menu event listener
    sprites.onOverlap(SpriteKind.Cursor, SpriteKind.CharacterButton, function (cursorSprite, selectedSprite) {
        if (controller.A.isPressed()) {
            cursor.destroy()
            sprites.destroyAllSpritesOfKind(SpriteKind.CharacterButton)
            startGame(selectedSprite)
        }
    })
}

function startGame(selectedSprite: Sprite) {
    scene.setBackgroundImage(assets.image`game_bg`)

    if (selectedSprite == menuMikage) {
        player = new Player(MIKAGE)
    } else if (selectedSprite == menuSpica) {
        player = new Player(SPICA)
    } else if (selectedSprite == menuYuuhi) {
        player = new Player(YUUHI)
    } else if (selectedSprite == menuUrara) {
        player = new Player(URARA)
    }

    gameState = "CHARACTER_SELECTED"
}

let playButton: Sprite = null
let helpButton: Sprite = null
let menuMikage: Sprite = null
let menuSpica: Sprite = null
let menuYuuhi: Sprite = null
let menuUrara: Sprite = null
let cursor: Sprite = null
let bullet: Sprite = null
let player: Player = null
let life_up: Sprite = null
let gameState = "MENU"
initializeMenu()

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
