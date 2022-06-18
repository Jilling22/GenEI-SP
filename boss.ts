
class Tomo {

    sprite: Sprite
    walkAnim: Image[]
    hurtAnim: Image[]
    deathAnim: Image[]

    agility: number
    bulletSpeed: number
    iframes: number

    static health: StatusBarSprite

    constructor() {
        this.sprite = sprites.create(assets.image`Tomo`, SpriteKind.Boss)
        this.sprite.setFlag(SpriteFlag.Ghost, true)
        PhantomSpawner.phantoms.push(this.sprite)

        Tomo.health = statusbars.create(20, 2, StatusBarKind.EnemyHealth)
        Tomo.health.max = 10

        Tomo.health.attachToSprite(this.sprite)

        this.bulletSpeed = -180
        this.bossIntro()

        // 6. While moving, start shooting volleys of bullets (with sound)

        timer.after(2500, () => {
            game.onUpdateInterval(1200, () => {
                if (gameState === "TOMO" && Tomo.health.value > 0) {
                    this.shootVolley()
                }
            })

            game.onUpdate(() => {
                if (gameState === "TOMO" && Tomo.health.value <= 0) {
                    this.sprite.vy = 0
                    this.animateDeath()
                }
            })
        })


    }

    // 2. Stands still (insert dialogue here)

    // 3. Start fight

    bossIntro() {
        this.sprite.x = 170
        this.sprite.y = 60

        // 1. Walks from right side of screen into view
        this.sprite.vx = -30
        animation.runImageAnimation(this.sprite, assets.animation`Tomo Walk`, 200, true)

        timer.after(1000, () => {
            // 2. Stands still (insert dialogue here)
            this.sprite.vx = 0
            animation.stopAnimation(animation.AnimationTypes.All, this.sprite)
        })

        timer.after(2000, () => {
            // 4. Pick a random direction
            // 5. Move up and down
            this.sprite.vy = 50
            this.sprite.setBounceOnWall(true)
            animation.runImageAnimation(this.sprite, assets.animation`Tomo Walk`, 150, true)
            this.sprite.setFlag(SpriteFlag.Ghost, false)
        })
    }

    shootVolley() {
        this.shootPopsicle()
        timer.after(100, () => {
            if (Tomo.health.value < 9) this.shootPopsicle()
        })
        timer.after(200, () => {
            if (Tomo.health.value < 6) this.shootPopsicle()
        })
        timer.after(300, () => {
            if (Tomo.health.value < 3) this.shootPopsicle()
        })
    }

    shootPopsicle() {
        let bullet = sprites.create(assets.image`Tomo Bullet`, SpriteKind.EnemyProjectile)
        bullet.x = this.sprite.x
        bullet.y = this.sprite.y

        bullet.vx = this.bulletSpeed

        bullet.setFlag(SpriteFlag.AutoDestroy, true)
        music.pewPew.play()

    }

    animateDeath() {
        this.sprite.vy = 0
        this.sprite.setFlag(SpriteFlag.Ghost, true)
        timer.after(500, () => {
            animation.runImageAnimation(this.sprite, assets.animation`TomoDeath1`, 150, false)
            animation.runImageAnimation(this.sprite, assets.animation`TomoDeath2`, 150, true)
        })
        timer.after(1500, () => {
            PhantomSpawner.phantoms.removeElement(this.sprite)
            this.sprite.destroy(effects.hearts, 200)
        })
        timer.after(2000, () => {
            if (gameState === "TOMO") {
                gameState = "TOMO_DEFEATED"
            }
        })
    }

    // 7. Update behavior based on HP

    // 8. If HP reaches zero, trigger dialogue + death animation

}




class SuperPhantom {

    sprite: Sprite
    walkAnim: Image[]
    hurtAnim: Image[]
    deathAnim: Image[]

    agility: number
    bulletSpeed: number
    iframes: number

    facingLeft: boolean

    static health: StatusBarSprite

    constructor() {
        this.sprite = sprites.create(assets.image`BPMikage left`, SpriteKind.Boss)
        this.sprite.setFlag(SpriteFlag.Ghost, true)
        PhantomSpawner.phantoms.push(this.sprite)
        this.facingLeft = true

        SuperPhantom.health = statusbars.create(20, 2, StatusBarKind.EnemyHealth)
        SuperPhantom.health.max = 15

        SuperPhantom.health.attachToSprite(this.sprite)

        this.bossIntro()

        timer.after(1500, () => {
            game.onUpdateInterval(1500, () => {
                if (gameState === "SUPERPHANTOM" && SuperPhantom.health.value > 0) {
                    // Do a thing
                    this.shootVolley()
                }
            })

            game.onUpdate(() => {
                if (gameState === "SUPERPHANTOM" && this.facingLeft && this.sprite.vx > 0) {
                    animation.runImageAnimation(this.sprite, assets.animation`BPMikage right walk`, 200, true)
                    this.facingLeft = false
                }

                if (gameState === "SUPERPHANTOM" && !this.facingLeft && this.sprite.vx < 0) {
                    animation.runImageAnimation(this.sprite, assets.animation`BPMikage left walk`, 200, true)
                    this.facingLeft = true
                }

                if (gameState === "SUPERPHANTOM" && SuperPhantom.health.value <= 0) {
                    // Out of lives
                    this.sprite.vy = 0
                    this.animateDeath()
                }
            })
        })


    }

    bossIntro() {
        this.sprite.x = 170
        this.sprite.y = 60

        // 1. Walks from right side of screen into view
        this.sprite.vx = -30
        animation.runImageAnimation(this.sprite, assets.animation`BPMikage left walk`, 200, true)

        timer.after(1000, () => {
            // 2. Stands still (insert dialogue here)
            this.sprite.vx = 0
            animation.stopAnimation(animation.AnimationTypes.All, this.sprite)
        })

        timer.after(1500, () => {
            // 4. Pick a random direction
            // 5. Move up and down
            this.sprite.vy = -40
            this.sprite.vx = -40
            this.sprite.setBounceOnWall(true)
            animation.runImageAnimation(this.sprite, assets.animation`BPMikage left walk`, 150, true)
            this.sprite.setFlag(SpriteFlag.Ghost, false)
        })
    }

    shootVolley() {
        this.shootEP(50, 0)
        this.shootEP(-50, 0)
        this.shootEP(0, -50)
        this.shootEP(0, 50)

        if (SuperPhantom.health.value < 6) {
            this.shootEP(35, 35)
            this.shootEP(-35, -35)
            this.shootEP(35, -35)
            this.shootEP(-35, 35)
        }
    }

    shootEP(vx: number, vy: number) {
        let bullet = sprites.create(assets.image`Mikage`, SpriteKind.EnemyProjectile)
        animation.runImageAnimation(bullet, assets.animation`TomoDeath2`, 200, true)
        bullet.x = this.sprite.x
        bullet.y = this.sprite.y

        bullet.vx = vx
        bullet.vy = vy

        bullet.setFlag(SpriteFlag.AutoDestroy, true)
        music.pewPew.play()
    }

    animateDeath() {
        this.sprite.vy = 0
        this.sprite.vx = 0
        this.sprite.setFlag(SpriteFlag.Ghost, true)
        timer.after(500, () => {
            animation.runImageAnimation(this.sprite, assets.animation`TomoDeath1`, 150, false)
            animation.runImageAnimation(this.sprite, assets.animation`TomoDeath2`, 150, true)
        })
        timer.after(1500, () => {
            this.sprite.destroy(effects.hearts, 200)
        })
        timer.after(2000, () => {
            gameState = "PHANTOM_DEFEATED"
        })
    }

    // 7. Update behavior based on HP

    // 8. If HP reaches zero, trigger dialogue + death animation

}

sprites.onOverlap(SpriteKind.Boss, SpriteKind.Projectile, function (bossSprite, projectileSprite) {
    timer.throttle("boss_throttle", 1000, () => {
        if (gameState === "TOMO" && Tomo.health.value > 0) {
            Tomo.health.value -= 1
            music.zapped.play()
            bossSprite.vy += bossSprite.vy > 0 ? 20 : -20
            
        } else if (gameState === "SUPERPHANTOM" && SuperPhantom.health.value > 0) {
            SuperPhantom.health.value -= 1
            music.zapped.play()

            bossSprite.vy += bossSprite.vy > 0 ? 3 : -3
            bossSprite.vx += bossSprite.vx > 0 ? 5 : -5

            if (Math.random() * 3 < 1) {
                bossSprite.vx *= -1
            } else if (Math.random() * 3 < 2) {
                bossSprite.vy *= -1
            }
        }

        if (!projectileSprite.data.piercing && !projectileSprite.data.vacuum) {
            projectileSprite.destroy()
        }
    })
})
