
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
                        if (Tomo.health.value > 0) {
                            this.shootHomingVolley()
                        }
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
        SuperPhantom.health.max = 1

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
            timer.throttle("boss2_throttle", 1000, () => {
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

        if (SuperPhantom.health.value < 5) {
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
            PhantomSpawner.phantoms.removeElement(this.sprite)
            this.sprite.destroy(effects.hearts)
            sprites.destroyAllSpritesOfKind(SpriteKind.Sprout)
            sprites.destroyAllSpritesOfKind(SpriteKind.Vine)
        })
    }
}

class GodUrara {

    sprite: Sprite
    bossData: BossData
    static health: StatusBarSprite

    constructor() {
        this.sprite = sprites.create(assets.image`GodUrara`, SpriteKind.Boss)
        this.sprite.setFlag(SpriteFlag.Ghost, true)
        PhantomSpawner.phantoms.push(this.sprite)

        GodUrara.health = statusbars.create(20, 2, StatusBarKind.EnemyHealth)
        GodUrara.health.max = 30

        GodUrara.health.attachToSprite(this.sprite)

        this.bossIntro()

        timer.after(1500, () => {
            
            // PHASE 1
            game.onUpdateInterval(4000, () => {
                if (gameState === "GOD_URARA" && GodUrara.health.value >= 30) { // 24
                    // Signal intent and snore
                    this.chillZzz()
                    timer.after(1100, () => {
                        this.chillZzz()
                    })

                    timer.after(1500, () => {
                        if (GodUrara.health.value < 30) return null
                        moveTo(player.sprite.x, player.sprite.y, this.sprite, 50, 0, assets.animation`GodUrara walk`)
                    })
                }
            })

            // PHASE 2
            game.onUpdateInterval(3500, () => {
                if (gameState === "GOD_URARA_PHASE2" && GodUrara.health.value >= 29) { // 19
                    // Signal intent and snore
                    this.sprite.setFlag(SpriteFlag.Ghost, false)
                    animation.runImageAnimation(this.sprite, assets.animation`GodUrara sleeprunwarning`, 100, false)
                    timer.after(600, () => {
                        if (Math.random() < 0.4) {
                            this.shootVolley(3, 180, 5, 0)
                            timer.after(200, () => {
                                this.shootVolley(2, 180, 5, 0)
                            })
                            timer.after(400, () => {
                                this.shootVolley(3, 180, 5, 0)
                            })
                            timer.after(600, () => {
                                this.shootVolley(2, 180, 5, 0)
                            })
                            timer.after(800, () => {
                                this.shootVolley(3, 180, 5, 0)
                            })
                        } else {
                            this.shootVolley(5, 120, 50, 100)
                            timer.after(800, () => {
                                this.shootVolley(4, 120, 50, 100)
                            })
                        }
                    })
                    
                    timer.after(2200, () => {
                        // Accelerate to player once, then pause
                        if (GodUrara.health.value < 29) return null
                        accelerateTo(player.sprite.x, player.sprite.y, this.sprite, 220, 0, assets.animation`GodUrara walk`)
                    })
                }
            })

            // PHASE 3
            game.onUpdateInterval(2600, () => {
                if (gameState === "GOD_URARA_PHASE3" && GodUrara.health.value >= 28) { // 15
                    animation.runImageAnimation(this.sprite, assets.animation`GodUrara sleeprunwarning`, 100, false)
                    timer.after(500, () => {
                        if (Math.random() < 0.3) {
                            this.shootVolley(5, 120, 50, 50)
                            timer.after(400, () => {
                                this.shootVolley(4, 120, 50, 50)
                            })
                            timer.after(800, () => {
                                this.shootVolley(5, 120, 50, 50)
                            })

                        } else {
                            this.shootDelayedVolley(5)
                        }
                    })
                    
                    timer.after(1800, () => {
                        if (GodUrara.health.value < 28) return null
                        // Accelerate to player once, then pause
                        accelerateTo(player.sprite.x, player.sprite.y, this.sprite, 400, 0, assets.animation`GodUrara walk`)
                    })

                    
                }
            })

            // PHASE 4
            game.onUpdateInterval(8000, () => {
                if (gameState === "GOD_URARA_PHASE4" && GodUrara.health.value >= 10) {

                    animation.runImageAnimation(this.sprite, assets.animation`GodUrara sleeprunwarning`, 100, false)
                
                    timer.after(600, () => {
  
                        this.shootVolley(6, 100, 85, 0)
                        timer.after(400, () => {
                            this.shootVolley(5, 100, 85, 0)
                        })
                        timer.after(800, () => {
                            this.shootVolley(7, 100, 85, 0)
                        })
                        timer.after(1200, () => {
                            this.shootVolley(6, 100, 85, 0)
                        })
                        timer.after(1600, () => {
                            this.shootVolley(5, 100, 85, 0)
                        })
                        timer.after(2000, () => {
                            this.shootVolley(7, 100, 85, 0)
                        })
                        timer.after(2400, () => {
                            this.shootVolley(6, 100, 85, 0)
                        })
                        timer.after(2800, () => {
                            this.shootVolley(5, 100, 85, 0)
                        })
                        timer.after(3200, () => {
                            this.shootVolley(7, 100, 85, 0)
                        })
                        timer.after(3600, () => {
                            this.shootVolley(6, 100, 85, 0)
                        })
                        timer.after(4000, () => {
                            this.shootVolley(5, 100, 85, 0)
                        })
                    })

                    timer.after(7000, () => {
                        if (GodUrara.health.value < 15) return null
                        // Accelerate to player once, then pause
                        if (this.sprite.x > 60) {
                            accelerateTo(10, player.sprite.y, this.sprite, 200, 0, assets.animation`GodUrara walk`)
                        } else {
                            accelerateTo(140, player.sprite.y, this.sprite, 200, 0, assets.animation`GodUrara walk`)
                        }
                    })


                }
            })

            game.onUpdate(() => {
                // PHASE 1
                if (gameState === "GOD_URARA" && GodUrara.health.value < 30) {
                    this.sprite.setFlag(SpriteFlag.Ghost, true)
                    gameState = "PHASE1_DONE"
                    music.bigCrash.play()
                    sprites.destroyAllSpritesOfKind(SpriteKind.EnemyProjectile, effects.disintegrate, 200)
                    scene.cameraShake(5, 1500)
        
                    timer.after(2000, () => {
                        sprites.destroyAllSpritesOfKind(SpriteKind.EnemyProjectile, effects.disintegrate, 200)
                        this.sprite.setFlag(SpriteFlag.Ghost, false)
                        gameState = "GOD_URARA_PHASE2"
                    })
                }

                if (gameState === "PHASE1_DONE") {
                    this.sprite.vx = 0
                    this.sprite.vy = 0
                }

                // PHASE 2
                if (gameState === "GOD_URARA_PHASE2" && GodUrara.health.value < 29) {
                    this.sprite.setFlag(SpriteFlag.Ghost, true)
                    gameState = "PHASE2_DONE"
                    music.bigCrash.play()
                    scene.cameraShake(5, 1500)

                    timer.after(2000, () => {
                        this.sprite.setFlag(SpriteFlag.Ghost, false)
                        gameState = "GOD_URARA_PHASE3"
                    })
                }

                // PHASE 3
                if (gameState === "GOD_URARA_PHASE3" && GodUrara.health.value < 28) {
                    this.sprite.setFlag(SpriteFlag.Ghost, true)
                    gameState = "PHASE3_DONE"
                    music.bigCrash.play()
                    scene.cameraShake(7, 1500)
                    this.sprite.x = 140
                    this.sprite.y = 60

                    timer.after(2000, () => {
                        this.sprite.setFlag(SpriteFlag.Ghost, false)
                        gameState = "GOD_URARA_PHASE4"
                    })
                }

                if (gameState === "GOD_URARA" && GodUrara.health.value <= 0) {
                    // Out of lives
                    this.animateDeath()
                    gameState = "ENDING"
                }
            })
        })

        const phases: string[] = ["GOD_URARA", "GOD_URARA_PHASE2", "GOD_URARA_PHASE3", "GOD_URARA_PHASE4"]

        sprites.onOverlap(SpriteKind.Boss, SpriteKind.Projectile, function (bossSprite, projectileSprite) {
            timer.throttle("boss3_throttle", 1000, () => {
                if (phases.indexOf(gameState) !== -1 && GodUrara.health.value > 0) {

                    GodUrara.health.value -= 1
                    music.zapped.play()
                    
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
        moveTo(140, 60, this.sprite, 30, 0, assets.animation`GodUrara walk`)

        timer.after(1500, () => {
            this.sprite.setBounceOnWall(true)
            this.sprite.setFlag(SpriteFlag.Ghost, false)
        })
    }

    randomZzz(): Image {
        return Math.pickRandom([assets.image`z`, assets.image`zz`, assets.image`zzz`])
    }

    chillZzz() {
        const zzz = sprites.create(this.randomZzz(), SpriteKind.EnemyProjectile)
        zzz.x = this.sprite.x
        zzz.y = this.sprite.y
        aimAtTarget(player.sprite, zzz, 15)
        zzz.lifespan = 60000
        zzz.setFlag(SpriteFlag.BounceOnWall, true)
    }

    shootVolley(numBullets: number, speed: number, spread: number, gap: number) {
        const baseAngle = getAngle(player.sprite, this.sprite)
        const startAngle = baseAngle - spread
        const angleGap = (spread * 2) / (numBullets - 1)
        const shotArr: number[] = [];

        for (let shot = 0; shot < numBullets; shot++) {
            shotArr.push(shot)
            timer.after(gap * shot, () => {
                let bullet = sprites.create(assets.image`z`, SpriteKind.EnemyProjectile)
                bullet.x = this.sprite.x
                bullet.y = this.sprite.y
                let shotNum = shotArr.shift()
                aimAtAngle(startAngle + shotNum * angleGap, bullet, speed)
            })
        }
    }

    shootDelayedVolley(numBullets: number) {
        const baseAngle = getAngle(player.sprite, this.sprite)
        const spread = 40
        const startAngle = baseAngle - spread
        const angleGap = (spread * 2) / (numBullets - 1)
        const shotArr: number[] = [];

        for (let shot = 0; shot < numBullets; shot++) {
            shotArr.push(shot)
            timer.after(100 * shot, () => {
                let bullet = sprites.create(assets.image`z`, SpriteKind.EnemyProjectile)
                bullet.x = this.sprite.x
                bullet.y = this.sprite.y
                let shotNum = shotArr.shift()
                aimWithDelayedHoming(startAngle + shotNum * angleGap, bullet, 150, 800, 250)
            })
        }
    }

    animateDeath() {

    }
}
