
class Tomo {

    sprite: Sprite
    bossData: BossData
    static health: StatusBarSprite

    constructor(boss: BossData) {
        this.bossData = boss
        this.sprite = sprites.create(boss.spriteImg, SpriteKind.Boss)
        
        Tomo.health = statusbars.create(20, 2, StatusBarKind.EnemyHealth)
        Tomo.health.max = boss.health
        Tomo.health.attachToSprite(this.sprite)

        this.sprite.setFlag(SpriteFlag.Ghost, true)
        PhantomSpawner.phantoms.push(this.sprite)

        this.bossIntro()

        timer.after(boss.introPeriod, () => {
            game.onUpdateInterval(boss.shootCooldown1 + boss.shootCooldown2, () => {
                if (gameState === boss.spawnFlag && Tomo.health.value > 0) {

                    this.shootVolley()

                    timer.after(boss.shootCooldown1, () => {
                        this.shootHomingVolley()
                    })
                }
            })

            game.onUpdate(() => {
                if (gameState === boss.spawnFlag && Tomo.health.value <= 0) {
                    this.animateDeath()
                    gameState = boss.defeatedFlag
                }
            })
        })

        sprites.onOverlap(SpriteKind.Boss, SpriteKind.Projectile, function (bossSprite, projectileSprite) {
            timer.throttle("boss_throttle", boss.iframes, () => {
                if (gameState === boss.spawnFlag && Tomo.health.value > 0) {
                    Tomo.health.value -= 1
                    music.zapped.play()
                    bossSprite.vy += bossSprite.vy > 0 ? boss.ySpeedUp : -(boss.ySpeedUp)

                    if (!projectileSprite.data.piercing && !projectileSprite.data.vacuum) {
                        projectileSprite.destroy()
                    }
                }
            })
        })
    }

    bossIntro() {
        this.sprite.x = 170
        this.sprite.y = 60

        moveTo(140, 60, this.sprite, 30, 0, assets.animation`Tomo Walk`)

        timer.after(this.bossData.introPeriod, () => {
            let y = this.bossData.initialYSpeed
            this.sprite.vy = Math.random() > 0.5 ? y : -y
            
            this.sprite.setBounceOnWall(true)
            animation.runImageAnimation(this.sprite, assets.animation`Tomo Walk`, 150, true)
            this.sprite.setFlag(SpriteFlag.Ghost, false)
        })
    }

    shootPopsicle() {
        const bullet = sprites.create(this.bossData.bulletSprite, SpriteKind.EnemyProjectile)
        bullet.x = this.sprite.x
        bullet.y = this.sprite.y

        bullet.vx = this.bossData.bulletSpeed

        bullet.setFlag(SpriteFlag.AutoDestroy, true)
        music.pewPew.play()
    }

    shootVolley() {
        this.shootPopsicle()
        timer.after(100, () => {
            if (Tomo.health.value < this.bossData.phase2Start) this.shootPopsicle()
        })
        timer.after(200, () => {
            if (Tomo.health.value < this.bossData.phase3Start) this.shootPopsicle()
        })
        timer.after(300, () => {
            if (Tomo.health.value < this.bossData.phase4Start) this.shootPopsicle()
        })
    }

    shootHomingPopsicle() {
        const bullet = sprites.create(this.bossData.bulletSprite, SpriteKind.EnemyProjectile)
        bullet.x = this.sprite.x
        bullet.y = this.sprite.y

        aimAtTarget(player.sprite, bullet, this.bossData.bulletSpeed)
    }

    shootHomingVolley() {
        this.shootHomingPopsicle()
        timer.after(200, () => {
            if (Tomo.health.value < this.bossData.phase2Start) this.shootHomingPopsicle()
        })
        timer.after(400, () => {
            if (Tomo.health.value < this.bossData.phase3Start) this.shootHomingPopsicle()
        })
        timer.after(600, () => {
            if (Tomo.health.value < this.bossData.phase4Start) this.shootHomingPopsicle()
        })
    }

    animateDeath() {
        this.sprite.vy = 0
        this.sprite.setFlag(SpriteFlag.Ghost, true)

        timer.after(500, () => {
            animation.runImageAnimation(this.sprite, assets.animation`TomoDeath1`, 150, false)
            animation.runImageAnimation(this.sprite, assets.animation`TomoDeath2`, 150, true)
        })
        timer.after(2000, () => {
            PhantomSpawner.phantoms.removeElement(this.sprite)
            this.sprite.destroy(effects.hearts, 200)
        })
    }
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
            game.onUpdateInterval(2000, () => {
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
                    this.animateDeath()
                    gameState = "PHANTOM_DEFEATED"
                }
            })
        })

        sprites.onOverlap(SpriteKind.Boss, SpriteKind.Projectile, function (bossSprite, projectileSprite) {
            timer.throttle("boss_throttle", 1000, () => {
                if (gameState === "SUPERPHANTOM" && SuperPhantom.health.value > 0) {

                    SuperPhantom.health.value -= 1
                    music.zapped.play()

                    bossSprite.vy += bossSprite.vy > 0 ? 4 : -4
                    bossSprite.vx += bossSprite.vx > 0 ? 5 : -5

                    if (Math.random() * 3 < 1) {
                        bossSprite.vx *= -1
                    } else if (Math.random() * 3 < 2) {
                        bossSprite.vy *= -1
                    }

                    if (!projectileSprite.data.piercing && !projectileSprite.data.vacuum) {
                        projectileSprite.destroy()
                    }
                }
            })
        })
    }

    bossIntro() {
        this.sprite.x = 170
        this.sprite.y = 60

        // 1. Walks from right side of screen into view
        moveTo(140, 60, this.sprite, 30, 0, assets.animation`BPMikage left walk`)

        timer.after(1500, () => {
            // 4. Pick a random direction
            this.sprite.vy = Math.random() > 0.5 ? 30 : -30
            this.sprite.vx = -40
            this.sprite.setBounceOnWall(true)
            animation.runImageAnimation(this.sprite, assets.animation`BPMikage left walk`, 150, true)
            this.sprite.setFlag(SpriteFlag.Ghost, false)
        })
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

    animateDeath() {
        this.sprite.vy = 0
        this.sprite.vx = 0
        this.sprite.setFlag(SpriteFlag.Ghost, true)
        timer.after(500, () => {
            this.sprite.setImage(assets.image`PMikage left`)
            animation.stopAnimation(animation.AnimationTypes.All, this.sprite)
            this.sprite.x += 2
            this.sprite.y += 8
        })
        timer.after(1000, () => {
            animation.runImageAnimation(this.sprite, assets.animation`PMikage death`, 100, false)
        })
        timer.after(1800, () => {
            this.sprite.destroy(effects.hearts)
        })
    }
}
