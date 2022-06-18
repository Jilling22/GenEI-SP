
namespace SpriteKind {
    export const Placeholder = SpriteKind.create()
    export const PlayButton = SpriteKind.create()
    export const HelpButton = SpriteKind.create()
    export const CharacterButton = SpriteKind.create()
    export const Phantom = SpriteKind.create()
    export const Cursor = SpriteKind.create()
    export const Special = SpriteKind.create()

    export const Boss = SpriteKind.create()
    export const EnemyProjectile = SpriteKind.create()
}

type CharacterData = {
    name: string,

    normalSprite: Image,
    sbaldSprite: Image,
    baldSprite: Image,

    normalWalkAnim: Image[],
    sbaldWalkAnim: Image[],
    baldWalkAnim: Image[],

    normalHurtAnim: Image[],
    sbaldHurtAnim: Image[],
    baldHurtAnim: Image[],

    deathAnim: Image[],
    deathTimer: number

    specialBullet: Image[],

    startingLives: number,
    agility: number,
    bulletSpeed: number,
    shootCooldown: number,
    iframes: number,

    multishotSpecial: boolean,
    pierceSpecial: boolean,
    homingSpecial: boolean,
    vacuumSpecial: boolean
}

const MIKAGE: CharacterData = {
    name: "Mikage",

    normalSprite: assets.image`Mikage`,
    sbaldSprite: assets.image`MikageSemi`,
    baldSprite: assets.image`MikageBald`,

    normalWalkAnim: assets.animation`Mikage Walk`,
    sbaldWalkAnim: assets.animation`MikageSemi Walk`,
    baldWalkAnim: assets.animation`MikageBald Walk`,

    normalHurtAnim: assets.animation`Mikage Injured`,
    sbaldHurtAnim: assets.animation`MikageSemi Injured`,
    baldHurtAnim: assets.animation`MikageBald Injured`,

    deathAnim: assets.animation`Mikagedeath`,
    deathTimer: 800,

    specialBullet: assets.animation`MikageSpecial animate`,

    startingLives: 3,
    agility: 100,
    bulletSpeed: 200,
    shootCooldown: 150,
    iframes: 500,

    multishotSpecial: false,
    pierceSpecial: false,
    homingSpecial: true,
    vacuumSpecial: false
}

const SPICA: CharacterData = {
    name: "Spica",

    normalSprite: assets.image`Spica`,
    sbaldSprite: assets.image`SpicaSemi`,
    baldSprite: assets.image`SpicaBald`,

    normalWalkAnim: assets.animation`Spica Walk`,
    sbaldWalkAnim: assets.animation`SpicaSemi Walk`,
    baldWalkAnim: assets.animation`SpicaBald Walk`,

    normalHurtAnim: assets.animation`Spica Injured`,
    sbaldHurtAnim: assets.animation`SpicaSemi Injured`,
    baldHurtAnim: assets.animation`SpicaBald Injured`,

    deathAnim: assets.animation`Spicadeath`,
    deathTimer: 1500,

    specialBullet: assets.animation`SpicaSpecial animate`,

    startingLives: 4,
    agility: 145,
    bulletSpeed: 150,
    shootCooldown: 200,
    iframes: 600,

    multishotSpecial: true,
    pierceSpecial: false,
    homingSpecial: false,
    vacuumSpecial: false
}

const YUUHI: CharacterData = {
    name: "Yuuhi",

    normalSprite: assets.image`Yuuhi`,
    sbaldSprite: assets.image`YuuhiSemi`,
    baldSprite: assets.image`YuuhiBald`,

    normalWalkAnim: assets.animation`Yuuhi Walk`,
    sbaldWalkAnim: assets.animation`YuuhiSemi Walk`,
    baldWalkAnim: assets.animation`YuuhiBald Walk`,

    normalHurtAnim: assets.animation`Yuuhi Injured`,
    sbaldHurtAnim: assets.animation`YuuhiSemi Injured`,
    baldHurtAnim: assets.animation`YuuhiBald Injured`,

    deathAnim: assets.animation`Yuuhideath`,
    deathTimer: 800,

    specialBullet: assets.animation`YuuhiSpecial animate`,

    startingLives: 3,
    agility: 160,
    bulletSpeed: 300,
    shootCooldown: 500,
    iframes: 600,

    multishotSpecial: false,
    pierceSpecial: true,
    homingSpecial: false,
    vacuumSpecial: false
}

const URARA: CharacterData = {
    name: "Urara",

    normalSprite: assets.image`Urara`,
    sbaldSprite: assets.image`UraraSemi`,
    baldSprite: assets.image`UraraBald`,

    normalWalkAnim: assets.animation`Urara Walk`,
    sbaldWalkAnim: assets.animation`UraraSemi Walk`,
    baldWalkAnim: assets.animation`UraraBald Walk`,

    normalHurtAnim: assets.animation`Urara Injured`,
    sbaldHurtAnim: assets.animation`UraraSemi Injured`,
    baldHurtAnim: assets.animation`UraraBald Injured`,

    deathAnim: assets.animation`Uraradeath`,
    deathTimer: 1500,

    specialBullet: assets.animation`UraraSpecial animate`,

    startingLives: 5,
    agility: 10,
    bulletSpeed: 0,
    shootCooldown: 200,
    iframes: 1000,

    multishotSpecial: false,
    pierceSpecial: false,
    homingSpecial: false,
    vacuumSpecial: true
}

type LevelData = {
    spawnFlag: string,
    walkSpd: number,
    walkSpdVar: number,

    spawnInterval: number,
    spawnRate: number,

    spriteImg: Image,
    walkAnim: Image[]
}

const LEVEL1: LevelData = {
    spawnFlag: "LEVEL1",
    walkSpd: -50,
    walkSpdVar: 10,

    spawnInterval: 1000,
    spawnRate: 100,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

const LEVEL2: LevelData = {
    spawnFlag: "LEVEL2",
    walkSpd: -100,
    walkSpdVar: 10,

    spawnInterval: 1000,
    spawnRate: 100,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

type BossData = {

    spriteImg: Image,
    walkAnim: Image[],
    deathAnim: Image[],
    
    deathTimer: number

    specialBullet: Image[],

    startingLives: number,
    agility: number,
    bulletSpeed: number,
    shootCooldown: number,
    iframes: number,

    multishotSpecial: boolean,
    pierceSpecial: boolean,
    homingSpecial: boolean,
    vacuumSpecial: boolean
}