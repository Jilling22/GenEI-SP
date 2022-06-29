
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

        const boss = this.bossData;

        this.sprite.x = 170
        this.sprite.y = 60

        moveTo(140, 60, this.sprite, 30, 0, assets.animation`Tomo Walk`)

        timer.after(this.bossData.introPeriod, () => {

            tomoIntroDialogue()

            timer.after(1000, () => {
                let y = this.bossData.initialYSpeed
                this.sprite.vy = Math.random() > 0.5 ? y : -y

                this.sprite.setBounceOnWall(true)
                animation.runImageAnimation(this.sprite, assets.animation`Tomo Walk`, 150, true)
                this.sprite.setFlag(SpriteFlag.Ghost, false)

                game.onUpdate(() => {
                    if (gameState === boss.spawnFlag && Tomo.health.value <= 0) {

                        gameState = "LOADING"
                        this.sprite.vy = 0
                        this.sprite.setFlag(SpriteFlag.Ghost, true)

                        timer.after(500, () => {
                            tomoDeathDialogue()
                            this.animateDeath()
                            
                        })
                    }
                })

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
            })
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
            gameState = this.bossData.defeatedFlag
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

            phantomIntroDialogue()

            timer.after(1000, () => {
                this.sprite.vy = Math.random() > 0.5 ? 30 : -30
                this.sprite.vx = -40

                this.sprite.setBounceOnWall(true)
                animation.runImageAnimation(this.sprite, assets.animation`BPMikage left walk`, 150, true)
                this.sprite.setFlag(SpriteFlag.Ghost, false)

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
                        gameState = "LOADING"
                        this.sprite.vy = 0
                        this.sprite.vx = 0
                        this.sprite.setFlag(SpriteFlag.Ghost, true)

                        timer.after(500, () => {
                            phantomDeathDialogue()
                            this.animateDeath()
                            timer.after(100, () => {
                                sprites.destroyAllSpritesOfKind(SpriteKind.Sprout)
                                sprites.destroyAllSpritesOfKind(SpriteKind.Vine)
                            })
                        })
                        
                    }
                })
            })
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
            gameState = "PHANTOM_DEFEATED"
        })
    }
}

class GodUrara {

    sprite: Sprite
    bossData: BossData
    static health: StatusBarSprite

    phase2Start: number
    phase3Start: number
    phase4Start: number
    phase5Start: number

    constructor() {
        this.sprite = sprites.create(assets.image`GodUrara`, SpriteKind.Boss)
        this.sprite.setFlag(SpriteFlag.Ghost, true)
        PhantomSpawner.phantoms.push(this.sprite)

        GodUrara.health = statusbars.create(20, 2, StatusBarKind.EnemyHealth)
        GodUrara.health.max = 7

        this.phase2Start = 7 // 34
        this.phase3Start = 6 // 27
        this.phase4Start = 5 // 20
        this.phase5Start = 4 // 5

        GodUrara.health.attachToSprite(this.sprite)

        this.bossIntro()

        const phases: string[] = ["GOD_URARA", "GOD_URARA_PHASE2", "GOD_URARA_PHASE3", "GOD_URARA_PHASE4", "GOD_URARA_PHASE5"]

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
            godUraraIntroDialogue()

            timer.after(1000, () => {
                this.sprite.setBounceOnWall(true)
                this.sprite.setFlag(SpriteFlag.Ghost, false)

                // PHASE 1
                game.onUpdateInterval(4000, () => {
                    if (gameState === "GOD_URARA" && GodUrara.health.value >= this.phase2Start) {
                        // Signal intent and snore
                        this.chillZzz()
                        timer.after(1100, () => {
                            if (GodUrara.health.value >= this.phase2Start) {
                                this.chillZzz()
                            }
                        })

                        timer.after(1500, () => {
                            if (GodUrara.health.value < this.phase2Start) return null
                            moveTo(player.sprite.x, player.sprite.y, this.sprite, 50, 0, assets.animation`GodUrara walk`)
                        })
                    }
                })

                // PHASE 2
                game.onUpdateInterval(4000, () => {
                    if ((gameState === "GOD_URARA_PHASE2_START" || gameState === "GOD_URARA_PHASE2") && GodUrara.health.value >= this.phase3Start) {
                        // Signal intent and snore
                        gameState = "GOD_URARA_PHASE2"
                        this.sprite.setFlag(SpriteFlag.Ghost, false)
                        animation.runImageAnimation(this.sprite, assets.animation`GodUrara sleeprunwarning`, 80, false)
                        timer.after(1000, () => {
                            if (Math.random() < 0.4) {
                                this.shootVolley(3, 160, 5, 0, this.phase3Start)
                                timer.after(200, () => {
                                    this.shootVolley(2, 160, 5, 0, this.phase3Start)
                                })
                                timer.after(400, () => {
                                    this.shootVolley(3, 160, 5, 0, this.phase3Start)
                                })
                                timer.after(600, () => {
                                    this.shootVolley(2, 160, 5, 0, this.phase3Start)
                                })
                                timer.after(800, () => {
                                    this.shootVolley(3, 160, 5, 0, this.phase3Start)
                                })
                            } else {
                                this.shootVolley(5, 120, 55, 100, this.phase3Start)
                                timer.after(800, () => {
                                    this.shootVolley(4, 120, 55, 100, this.phase3Start)
                                })
                            }
                        })

                        timer.after(2200, () => {
                            // Accelerate to player once, then pause
                            if (GodUrara.health.value < this.phase3Start) return null
                            accelerateTo(player.sprite.x, player.sprite.y, this.sprite, 220, 0, assets.animation`GodUrara walk`)
                        })
                    }
                })

                // PHASE 3
                game.onUpdateInterval(3600, () => {
                    if ((gameState === "GOD_URARA_PHASE3_START" || gameState === "GOD_URARA_PHASE3") && GodUrara.health.value >= this.phase4Start) { // 15
                        gameState = "GOD_URARA_PHASE3"
                        animation.runImageAnimation(this.sprite, assets.animation`GodUrara sleeprunwarning`, 80, false)
                        timer.after(1000, () => {
                            if (Math.random() < 0.3) {
                                this.shootVolley(5, 120, 50, 50, this.phase4Start)
                                timer.after(400, () => {
                                    this.shootVolley(4, 120, 50, 50, this.phase4Start)
                                })
                                timer.after(800, () => {
                                    this.shootVolley(5, 120, 50, 50, this.phase4Start)
                                })

                            } else {
                                this.shootDelayedVolley(5)
                            }
                        })

                        timer.after(2400, () => {
                            if (GodUrara.health.value < this.phase4Start) return null
                            // Accelerate to player once, then pause
                            accelerateTo(player.sprite.x, player.sprite.y, this.sprite, 400, 0, assets.animation`GodUrara walk`)
                        })


                    }
                })

                // PHASE 4
                game.onUpdateInterval(6500, () => {
                    if ((gameState === "GOD_URARA_PHASE4_START" || gameState === "GOD_URARA_PHASE4") && GodUrara.health.value >= this.phase5Start) {
                        gameState = "GOD_URARA_PHASE4"
                        animation.runImageAnimation(this.sprite, assets.animation`GodUrara sleeprunwarning`, 80, false)

                        timer.after(800, () => {

                            this.shootVolley(6, 100, 85, 0, this.phase5Start)
                            timer.after(400, () => {
                                this.shootVolley(5, 100, 85, 0, this.phase5Start)
                            })
                            timer.after(800, () => {
                                this.shootVolley(7, 100, 85, 0, this.phase5Start)
                            })
                            timer.after(1200, () => {
                                this.shootVolley(6, 100, 85, 0, this.phase5Start)
                            })
                            timer.after(1600, () => {
                                this.shootVolley(5, 100, 85, 0, this.phase5Start)
                            })
                            timer.after(2000, () => {
                                this.shootVolley(7, 100, 85, 0, this.phase5Start)
                            })
                            timer.after(2400, () => {
                                this.shootVolley(6, 100, 85, 0, this.phase5Start)
                            })
                            timer.after(2800, () => {
                                this.shootVolley(5, 100, 85, 0, this.phase5Start)
                            })
                            timer.after(3200, () => {
                                this.shootVolley(7, 100, 85, 0, this.phase5Start)
                            })
                            timer.after(3600, () => {
                                this.shootVolley(6, 100, 85, 0, this.phase5Start)
                            })
                            timer.after(4000, () => {
                                this.shootVolley(5, 100, 85, 0, this.phase5Start)
                            })
                        })

                        timer.after(5000, () => {
                            if (GodUrara.health.value < this.phase5Start) return null
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
                    if (gameState === "GOD_URARA" && GodUrara.health.value < this.phase2Start) {
                        this.sprite.setFlag(SpriteFlag.Ghost, true)
                        gameState = "PHASE1_DONE"
                        music.bigCrash.play()
                        sprites.destroyAllSpritesOfKind(SpriteKind.EnemyProjectile, effects.disintegrate, 200)
                        scene.cameraShake(5, 1500)

                        timer.after(2000, () => {
                            sprites.destroyAllSpritesOfKind(SpriteKind.EnemyProjectile, effects.disintegrate, 200)
                            this.sprite.setFlag(SpriteFlag.Ghost, false)
                            gameState = "GOD_URARA_PHASE2_START"
                            travelQueue.shift();
                            moveTo(140, 60, this.sprite, 150, 0, assets.animation`GodUrara walk`)
                        })
                    }

                    if (gameState === "PHASE1_DONE") {
                        this.sprite.vx = 0
                        this.sprite.vy = 0
                    }

                    // PHASE 2
                    if (gameState === "GOD_URARA_PHASE2" && GodUrara.health.value < this.phase3Start) {
                        this.sprite.setFlag(SpriteFlag.Ghost, true)
                        gameState = "PHASE2_DONE"
                        music.bigCrash.play()
                        scene.cameraShake(5, 1500)

                        timer.after(2000, () => {
                            this.sprite.setFlag(SpriteFlag.Ghost, false)
                            gameState = "GOD_URARA_PHASE3_START"
                        })
                    }

                    // PHASE 3
                    if (gameState === "GOD_URARA_PHASE3" && GodUrara.health.value < this.phase4Start) {
                        this.sprite.setFlag(SpriteFlag.Ghost, true)
                        gameState = "PHASE3_DONE"
                        music.bigCrash.play()
                        scene.cameraShake(7, 1500)
                        scene.setBackgroundImage(assets.image`black_bg`)

                        timer.after(2000, () => {
                            
                            travelQueue.shift();
                            moveTo(140, 60, this.sprite, 150, 0, assets.animation`GodUrara walk`)
                            this.sprite.setFlag(SpriteFlag.Ghost, false)
                        })
                        timer.after(2500, () => {
                            gameState = "GOD_URARA_PHASE4_START"
                        })
                    }

                    // PHASE 4
                    if (gameState === "GOD_URARA_PHASE4" && GodUrara.health.value < this.phase5Start) {
                        this.sprite.setFlag(SpriteFlag.Ghost, true)
                        gameState = "PHASE4_DONE"
                        music.bigCrash.play()
                        scene.cameraShake(7, 1500)

                        timer.after(2000, () => {
                            animation.runImageAnimation(this.sprite, assets.animation`GodUrara spin`, 100, true)
                            this.sprite.ax = 10
                            this.sprite.ay = 10
                            this.sprite.setFlag(SpriteFlag.Ghost, false)
                            this.spawnWall()

                            game.onUpdate(() => {
                                this.speedUp()
                            })

                            timer.after(5000, () => {
                                if (GodUrara.health.value > 0) {
                                    this.spawnWall()
                                }
                            })

                            timer.after(10000, () => {
                                if (GodUrara.health.value > 0) {
                                    this.spawnWall()
                                }
                            })

                            timer.after(15000, () => {
                                if (GodUrara.health.value > 0) {
                                    this.spawnWall()
                                }
                            })

                            timer.after(20000, () => {
                                if (GodUrara.health.value > 0) {
                                    this.spawnWall()
                                }
                            })

                            timer.after(25000, () => {
                                if (GodUrara.health.value > 0) {
                                    this.spawnWall()
                                }
                            })

                            gameState = "GOD_URARA_PHASE5"
                        })
                    }

                    if (gameState === "GOD_URARA_PHASE5" && GodUrara.health.value <= 0) {
                        // Out of lives
                        gameState = "PHASE5_DONE"
                        animation.stopAnimation(animation.AnimationTypes.All, this.sprite)
                        sprites.destroyAllSpritesOfKind(SpriteKind.WhiteHole, effects.disintegrate, 200)
                        this.sprite.ax = 0
                        this.sprite.ay = 0
                        this.sprite.vx = 0
                        this.sprite.vy = 0
                        music.bigCrash.play()
                        scene.setBackgroundImage(assets.image`game_bg3`)

                        timer.after(2000, () => {
                            music.bigCrash.play()
                            scene.setBackgroundImage(assets.image`black_bg`)
                        })

                        timer.after(4000, () => {
                            music.bigCrash.play()
                            scene.setBackgroundImage(assets.image`game_bg3`)
                            timer.after(1000, () => {
                                godUraraDeathDialogue()
                                timer.after(2000, () => {
                                    this.animateDeath()
                                })
                            })
                        })
                    }
                })
            })
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

    shootVolley(numBullets: number, speed: number, spread: number, gap: number, life: number) {
        const baseAngle = getAngle(player.sprite, this.sprite)
        const startAngle = baseAngle - spread
        const angleGap = (spread * 2) / (numBullets - 1)
        const shotArr: number[] = [];

        for (let shot = 0; shot < numBullets; shot++) {
            shotArr.push(shot)
            timer.after(gap * shot, () => {
                
                if (GodUrara.health.value >= life) {
                    let bullet = sprites.create(assets.image`z`, SpriteKind.EnemyProjectile)
                    bullet.x = this.sprite.x
                    bullet.y = this.sprite.y
                    let shotNum = shotArr.shift()
                    aimAtAngle(startAngle + shotNum * angleGap, bullet, speed)
                }
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

    spawnWall() {
        let blackHole = sprites.createProjectile(assets.image`BUraraSpecial`, -5, 0, SpriteKind.WhiteHole)
        animation.runImageAnimation(blackHole, assets.animation`BUraraSpecial animate`, 100, true)
        blackHole.x = 170
        blackHole.y = 40

        let blackHole2 = sprites.createProjectile(assets.image`BUraraSpecial`, -5, 0, SpriteKind.WhiteHole)
        animation.runImageAnimation(blackHole2, assets.animation`BUraraSpecial animate`, 100, true)
        blackHole2.x = 170
        blackHole2.y = 80
    }

    speedUp() {
        if (this.sprite.vx > 0 && this.sprite.ax < 0) {
            this.sprite.ax *= -1
        } else if (this.sprite.vx < 0 && this.sprite.ax > 0) {
            this.sprite.ax *= -1
        }

        if (this.sprite.vy > 0 && this.sprite.ay < 0) {
            this.sprite.ay *= -1
        } else if (this.sprite.vx < 0 && this.sprite.ay > 0) {
            this.sprite.ay *= -1
        }
    }

    animateDeath() {
        animation.runImageAnimation(this.sprite, assets.animation`GodUrara tired`, 100, true)

        timer.after(2000, () => {
            animation.runImageAnimation(this.sprite, assets.animation`GodUraradeath`, 100, false)
        })

        timer.after(5000, () => {
            regularEnding()
            gameState = "ENDING"
            game.over(true, effects.confetti)
        })
    }
}
