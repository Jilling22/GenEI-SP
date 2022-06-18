
class Player {
    spriteAssets: CharacterData
    sprite: Sprite
    walkAnim: Image[]
    hurtAnim: Image[]
    deathAnim: Image[]

    agility: number
    bulletSpeed: number
    shootCooldown: number
    iframes: number

    inventory: number
    inventorySprites: Sprite[]

    toggleStill: boolean

    constructor(character: CharacterData) {
        info.setLife(character.startingLives)
        info.setScore(0)
        this.inventorySprites = []

        this.spriteAssets = character
        
        this.sprite = sprites.create(character.normalSprite, SpriteKind.Player)
        this.sprite.data = character.name
        this.walkAnim = character.normalWalkAnim
        this.hurtAnim = character.normalHurtAnim
        this.deathAnim = character.deathAnim

        this.agility = character.agility
        this.bulletSpeed = character.bulletSpeed
        this.shootCooldown = character.shootCooldown

        this.iframes = character.iframes
        this.toggleStill = true

        controller.moveSprite(this.sprite, this.agility, this.agility)
        this.sprite.setStayInScreen(true)

        game.showLongText(`Hello ${character.name}. I hope you're ready. Let's have some fun.`, DialogLayout.Bottom)

        this.inventory = 0
        this.inventorySprites.push(sprites.create(assets.image`Empty Special`, SpriteKind.Placeholder))
        this.inventorySprites[0].x = 45
        this.inventorySprites[0].y = 5
        this.inventorySprites[0].z = 1

        this.inventorySprites.push(sprites.create(assets.image`Empty Special`, SpriteKind.Placeholder))
        this.inventorySprites[1].x = 56
        this.inventorySprites[1].y = 5
        this.inventorySprites[1].z = 1

        this.inventorySprites.push(sprites.create(assets.image`Empty Special`, SpriteKind.Placeholder))
        this.inventorySprites[2].x = 67
        this.inventorySprites[2].y = 5
        this.inventorySprites[2].z = 1

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            timer.throttle("shot_throttle", this.shootCooldown, function () {
                let bullet = new Bullet(character, assets.animation`EP`, false, false, false, false)
            })
        })

        controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
            timer.throttle("shot_throttle", this.shootCooldown, function () {
                if (this.inventory > 0) {
                    let bullet = new Bullet(character, character.specialBullet, character.pierceSpecial, character.multishotSpecial, character.homingSpecial, character.vacuumSpecial)
                    this.inventory -= 1
                    this.updateInventory()
                    if (character.vacuumSpecial) {
                        this.agility -= 20
                        this.bulletSpeed -= 20
                        controller.moveSprite(this.sprite, this.agility, this.agility)
                    }
                }
            })
        })

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (playerSprite, lifeUpSprite) {
            info.changeLifeBy(1)
            this.updateHair()
            music.powerUp.play()

            lifeUpSprite.destroy()
        })

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Special, function (playerSprite, specialSprite) {
            if (this.inventory < 3) {
                this.inventory += 1
                if (character.vacuumSpecial) {
                    this.agility += 20
                    this.bulletSpeed += 20
                    controller.moveSprite(this.sprite, this.agility, this.agility)
                }
            }
            this.updateInventory()
            music.magicWand.play()
            specialSprite.destroy()
        })

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Vine, function (playerSprite, debuffSprite) {
            music.bigCrash.play()
            this.agility /= 2
            controller.moveSprite(this.sprite, this.agility, this.agility)

            timer.after(2000, () => {
                this.agility *= 2
                controller.moveSprite(this.sprite, this.agility, this.agility)
            })

            debuffSprite.destroy()
        })

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Phantom, function (playerSprite, phantomSprite) {
            timer.throttle("damage_throttle", this.iframes, function () {
                
                this.toggleStill = false
                info.changeLifeBy(-1)
                this.updateHair()
                this.animateHurt()

                music.smallCrash.play()
                scene.cameraShake(4, 500)

                phantomSprite.destroy()
            })
        })

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Boss, function (playerSprite, bossSprite) {
            timer.throttle("damage_throttle", this.iframes, function () {

                this.toggleStill = false
                info.changeLifeBy(-1)
                this.updateHair()
                this.animateHurt()

                music.powerDown.play()
                scene.cameraShake(4, 500)
            })
        })

        sprites.onOverlap(SpriteKind.Player, SpriteKind.EnemyProjectile, function (playerSprite, projectileSprite) {
            timer.throttle("damage_throttle", this.iframes, function () {

                this.toggleStill = false
                info.changeLifeBy(-1)
                this.updateHair()
                this.animateHurt()

                music.powerDown.play()
                scene.cameraShake(4, 500)

                projectileSprite.destroy()
            })
        })

        info.onLifeZero(function () {
            this.toggleStill = false
            controller.moveSprite(this.sprite, 0, 0)
            this.sprite.setFlag(SpriteFlag.Ghost, true)

            this.animateDeath()
            timer.after(character.deathTimer, function () {
                game.over(false)
            })
        })
    }

    animateStill() {
        if (this.toggleStill === true) {
            const sprite = this.sprite
            animation.stopAnimation(animation.AnimationTypes.All, sprite)
            this.updateHair()
        }
    }

    animateWalk() {
        if (this.toggleStill === true) {
            const sprite = this.sprite
            const walk = this.walkAnim
            animation.runImageAnimation(sprite, walk, 150, true)
        }
    }

    animateHurt() {
        const sprite = this.sprite
        const hurt = this.hurtAnim
        animation.runImageAnimation(sprite, hurt, 100, false)
        timer.after(400, () => {
            if (info.life() > 0) {
                this.toggleStill = true
                animation.runImageAnimation(this.sprite, this.walkAnim, 150, true)
            }
        })
    }

    animateDeath() {
        const sprite = this.sprite
        const death = this.deathAnim
        animation.runImageAnimation(sprite, death, 100, false)
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

    updateInventory() {
        this.inventorySprites.forEach(s => s.setImage(assets.image`Empty Special`))
        if (this.inventory === 1) {
            this.inventorySprites[0].setImage(assets.image`Special`)
        } else if (this.inventory === 2) {
            this.inventorySprites[0].setImage(assets.image`Special`)
            this.inventorySprites[1].setImage(assets.image`Special`)
        } else if (this.inventory >= 3) {
            this.inventorySprites[0].setImage(assets.image`Special`)
            this.inventorySprites[1].setImage(assets.image`Special`)
            this.inventorySprites[2].setImage(assets.image`Special`)
            this.inventory = 3
        }
    }
}

class Bullet {

    spriteAssets: CharacterData
    bulletSprite: Sprite
    walkAnim: Image[]
    hurtAnim: Image[]

    agility: number
    bulletSpeed: number
    shootCooldown: number
    iframes: number

    specials: object
    homing: boolean
    vacuum: boolean
    static blackHole: Sprite = null

    static homingBullets: Sprite[] = []

    constructor(character: CharacterData, bulletAnim: Image[], isPiercing: boolean, isMultishot: boolean, isHoming: boolean, isVacuum: boolean) {

        this.specials = {
            homing: isHoming,
            piercing: isPiercing,
            vacuum: isVacuum
        }

        this.homing = isHoming
        this.vacuum = isVacuum

        if (isVacuum) {
            this.fireBullet(bulletAnim, 30, 0)
        } else {
            this.fireBullet(bulletAnim, player.bulletSpeed, 0)
        }

        if (isHoming) {
            this.fireBullet(bulletAnim, player.bulletSpeed, 200)
            this.fireBullet(bulletAnim, player.bulletSpeed, -200)
        }
        
        if (isMultishot) {
            this.fireBullet(bulletAnim, player.bulletSpeed, 55)
            this.fireBullet(bulletAnim, player.bulletSpeed, -55)
            timer.after(100, function () {
                this.fireBullet(bulletAnim, player.bulletSpeed, 25)
                this.fireBullet(bulletAnim, player.bulletSpeed, -25)
            })
        }

        music.pewPew.play()
    }

    fireBullet(bulletAnim: Image[], vx: number, vy: number) {
        let bullet = sprites.createProjectileFromSprite(
            assets.image`Mikage`,
            player.sprite,
            vx,
            vy)
        
        animation.runImageAnimation(
            bullet,
            bulletAnim,
            50,
            true)

        
        bullet.data = this.specials

        if (this.homing) {
            Bullet.homingBullets.push(bullet);
        }

        if (this.vacuum) {
            bullet.setFlag(SpriteFlag.AutoDestroy, true)
            Bullet.blackHole = bullet
        } else {
            bullet.lifespan = 2000
        }
    }
}

sprites.onDestroyed(SpriteKind.Projectile, p => {
    if (p.data.vacuum) {
        Bullet.blackHole = null
    }
})

class PhantomSpawner {
    spawnFlag: string
    walkSpd: number
    spawnInterval: number
    spawnRate: number
    walkSpdVar: number

    spriteImg: Image
    walkAnim: Image[]

    static phantoms: Sprite[] = []

    constructor(data: LevelData) {
        this.spawnFlag = data.spawnFlag
        this.walkSpd = data.walkSpd
        this.walkSpdVar = data.walkSpdVar
        this.spawnInterval = data.spawnInterval
        this.spawnRate = data.spawnRate

        this.spriteImg = data.spriteImg
        this.walkAnim = data.walkAnim

        game.onUpdateInterval(this.spawnInterval, function () {
            if (gameState === this.spawnFlag && Math.percentChance(this.spawnRate)) {
                let phantom = sprites.create(this.spriteImg, SpriteKind.Phantom)

                phantom.x = scene.screenWidth() + 10;
                phantom.y = randint(20, 110)
                phantom.vx = randint(this.walkSpd - this.walkSpdVar, this.walkSpd + this.walkSpdVar)

                phantom.setFlag(SpriteFlag.AutoDestroy, true)

                animation.runImageAnimation(phantom, this.walkAnim, 200, true)

                PhantomSpawner.phantoms.push(phantom)
            }
        })
    }
}

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Phantom, function (projectileSprite, phantomSprite) {
    phantomSprite.vx = 0
    phantomSprite.destroy(effects.hearts, 200)
    if (!projectileSprite.data.piercing && !projectileSprite.data.vacuum) {
        projectileSprite.destroy()
    }
    info.changeScoreBy(1)
    music.smallCrash.play()
})

sprites.onDestroyed(SpriteKind.Projectile, p => p.data.homing ? Bullet.homingBullets.removeElement(p) : null);

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

    let blackScreen1 = sprites.create(assets.image`black_bg`, SpriteKind.Placeholder)
    let blackScreen2 = sprites.create(assets.image`black_bg`, SpriteKind.Placeholder)
    let blackScreen3 = sprites.create(assets.image`black_bg`, SpriteKind.Placeholder)
    blackScreen1.z = 2
    blackScreen2.z = 3
    blackScreen3.z = 4
    timer.after(200, function () {
        blackScreen1.destroy(effects.disintegrate, 800)
        blackScreen2.destroy(effects.disintegrate, 600)
        blackScreen3.destroy(effects.ashes, 400)
        timer.after(800, function () {
            effects.starField.startScreenEffect()
        })
    })

    sprites.onOverlap(SpriteKind.Cursor, SpriteKind.PlayButton, function (cursorSprite, selectedSprite) {
        if (controller.A.isPressed()) {
            sprites.destroyAllSpritesOfKind(SpriteKind.Placeholder)
            sprites.destroyAllSpritesOfKind(SpriteKind.PlayButton)
            sprites.destroyAllSpritesOfKind(SpriteKind.HelpButton)
            effects.starField.endScreenEffect()
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
    timer.after(400, function () {
        sprites.onOverlap(SpriteKind.Cursor, SpriteKind.CharacterButton, function (cursorSprite, selectedSprite) {
            if (controller.A.isPressed()) {
                cursor.destroy()
                sprites.destroyAllSpritesOfKind(SpriteKind.CharacterButton)
                startGame(selectedSprite)
            }
        })
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
    if (gameState === "CHARACTER_SELECTED") {

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

        game.onUpdate(function () {

            let upPressed = controller.up.isPressed()
            let downPressed = controller.down.isPressed()
            let leftPressed = controller.left.isPressed()
            let rightPressed = controller.right.isPressed()

            let isMoving = upPressed || downPressed || leftPressed || rightPressed

            if (!isMoving) {
                player.animateStill()
            }
        })

        timer.after(10000, function () {
            game.onUpdateInterval(25000, function () {
                if (info.life() > 0) {
                    life_up = sprites.create(assets.image`Life Up`, SpriteKind.Food)
                    life_up.x = scene.screenWidth()
                    life_up.vx = -30
                    life_up.y = randint(20, 115)
                    life_up.lifespan = 8000
                }
            })
        })

        timer.after(1000, function () {
            game.onUpdateInterval(3000, function () {
                if (info.life() > 0) {
                    life_up = sprites.create(assets.image`Special_fire still`, SpriteKind.Special)
                    animation.runImageAnimation(life_up, assets.animation`Special_fire`, 200, true)
                    life_up.x = randint(30, 130)
                    life_up.y = randint(30, 100)
                    life_up.z = -1
                    life_up.lifespan = 8000
                }
            })
        })

        sprites.onDestroyed(SpriteKind.Phantom, p => PhantomSpawner.phantoms.removeElement(p));

        game.onUpdate(() => {
            Bullet.homingBullets.forEach(b => {
                let t = findNearestEnemy(b);
                if (!t) return;
                moveSpriteToTargetSprite(b, t, hachanBulletSpeed, 0.09)
            });

            if (Bullet.blackHole) {
                PhantomSpawner.phantoms.forEach(p => {
                    moveSpriteToTargetSprite(p, Bullet.blackHole, 100, 0.1)
                })
            }
        });

        game.onUpdate(() => {
            
        });

        // change flag to first level
        gameState = "LEVEL1"
        let firstWave: PhantomSpawner = new PhantomSpawner(LEVEL1)
        game.onUpdate(() => {
            if (gameState === "LEVEL1" && info.score() > 1) {
                gameState = "LEVEL1_COMPLETE"
            }
        })
    } else if (gameState === "LEVEL1_COMPLETE") {

        gameState = "LEVEL2"
        
        timer.after(2000, () => {
            let secondWave: PhantomSpawner = new PhantomSpawner(LEVEL2)
        })

        game.onUpdate(() => {
            if (gameState === "LEVEL2" && info.score() > 2) {
                gameState = "LEVEL2_COMPLETE"
            }
        })
    } else if (gameState === "LEVEL2_COMPLETE") {

        gameState = "TOMO"

        timer.after(2000, () => {
            let bossFight1: Tomo = new Tomo()
        })

    } else if (gameState === "TOMO_DEFEATED") {

        gameState = "SUPERPHANTOM"

        timer.after(2000, () => {
            let bossFight2: SuperPhantom = new SuperPhantom()
        })

        timer.after(6000, function () {
            game.onUpdateInterval(6000, function () {
                if (gameState === "SUPERPHANTOM" && info.life() > 0) {
                    let sprout = sprites.create(assets.image`sprout`, SpriteKind.Sprout)
                    let vine: Sprite = null
                    sprout.x = randint(30, 130)
                    sprout.y = randint(30, 100)
                    sprout.z = -2
                    timer.after(2000, () => {
                        if (Math.random() < 0.5) {
                            vine = sprites.create(assets.image`vine1`, SpriteKind.Vine)
                        } else {
                            vine = sprites.create(assets.image`vine2`, SpriteKind.Vine)
                        }
                        vine.x = sprout.x
                        vine.y = sprout.y - 8
                        vine.z = -2
                        sprout.destroy()
                    })
                }
            })
        })
    }
})
