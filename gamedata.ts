
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
    export const Sprout = SpriteKind.create()
    export const Vine = SpriteKind.create()
    export const WhiteHole = SpriteKind.create()

    export const ScreenEffect = SpriteKind.create()
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
    vacuumSpecial: boolean,

    stage1Dialogue: string,
    tomoDialogue: string,

    stage2Dialogue: string,
    phantomDialogue: string,

    stage3Dialogue: string,
    godUraraDialogue?: string


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
    shootCooldown: 120,
    iframes: 700,

    multishotSpecial: false,
    pierceSpecial: false,
    homingSpecial: true,
    vacuumSpecial: false,

    stage1Dialogue: `Mikage
    ---------------
    Where is it? It's gotta be here
    Mikage
    ---------------
    somewhere... I need to find that
    Mikage
    ---------------
    album quickly, before...
     `,

    tomoDialogue: `Tomo
    ---------------
    So you finally came back, Mikage.
    Tomo
    ---------------
    I've been waiting for weeks since
    Tomo
    ---------------
    you took off with Yuuhi and Urara.
    Tomo
    ---------------
    Look, the ice cream's almost melted
    Tomo
    ---------------
    now because of you.
    Mikage
    ---------------
    Umm... so there's this album that can
    Mikage
    ---------------
    cure baldness, do you happen to
    Mikage
    ---------------
    know where it is?
     
    Tomo
    ---------------
    Oh, so I see how it is. You're
    Tomo
    ---------------
    leave me again, aren't you?
    Tomo
    ---------------
    Not this time!
     `,
    
    stage2Dialogue: `Mikage
    ---------------
    I have to hurry... I can't let
    Mikage
    ---------------
    Spica and the others see me
    Mikage
    ---------------
    like this.
     `,
    
    phantomDialogue: `Phantom
    ---------------
    Did you come here to give up?
    Mikage
    ---------------
    I'm not here to play games with you.
    Mikage
    ---------------
    Where did you hide the album?
    Phantom
    ---------------
    Mikage, you never needed that album
    Phantom
    ---------------
    to begin with.
     
    Phantom
    ---------------
    It's okay to be bald.
    Phantom
    ---------------
    Spica and the others will accept
    Phantom
    ---------------
    you regardless.
     
    Phantom
    ---------------
    Isn't that what true friends are for?
    Mikage
    ---------------
    This is completely different!
    Mikage
    ---------------
    I'll never be bald!
    Mikage
    ---------------
    Never ever ever!
     `,
    
    stage3Dialogue: `Mikage
    ---------------
    ... the parts. The airplane...
    Mikage
    ---------------
    Wait, what am I saying?
    Mikage
    ---------------
    I gotta get that album soon!
     `,
    
    godUraraDialogue: `God Urara
    ---------------
    Zzz...
     
    Mikage
    ---------------
    ... wait, Urara?
     
    God Urara
    ---------------
    Zzz...
     `,
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
    agility: 140,
    bulletSpeed: 150,
    shootCooldown: 200,
    iframes: 900,

    multishotSpecial: true,
    pierceSpecial: false,
    homingSpecial: false,
    vacuumSpecial: false,

    stage1Dialogue: `Spica
    ---------------
    So this is the place Mikage told
    Spica
    ---------------
    me about... It's a bit chilly
    Spica
    ---------------
    here, good thing I'm wearing my
    Spica
    ---------------
    winter uniform!
     `,

    tomoDialogue: `Tomo
    ---------------
    Hello there, what's your name?
    Tomo
    ---------------
    I'm looking for someone to eat all
    Tomo
    ---------------
    this ice cream with me!
    Spica
    ---------------
    Hi, my name's Spica! Do you know
    Spica
    ---------------
    where the album that can cure
    Spica
    ---------------
    baldness is?
     
    Tomo
    ---------------
    Spica?!? Mikage keeps talking
    Tomo
    ---------------
    about you... So you were the one
    Tomo
    ---------------
    who stole her from me!
     `,

    stage2Dialogue: `Spica
    ---------------
    This place is giving me the creeps,
    Spica
    ---------------
    but I gotta do my best for her!
     `,

    phantomDialogue: `Phantom
    ---------------
    ... begone, Spica.
     
    Phantom
    ---------------
    The forest of shadows does not take
    Phantom
    ---------------
    kindly to the blinding light.
    Spica
    ---------------
    Light? I don't see any here...
    Spica
    ---------------
    By the way, did you happen to know
    Spica
    ---------------
    where the album that can cure
    Spica
    ---------------
    baldness is?
     
    Phantom
    ---------------
    That was your last warning.
    Phantom
    ---------------
    Now you too shall experience baldness.
     `,
    
    stage3Dialogue: `Spica
    ---------------
    Where am I... it feels so cold in 
    Spica
    ---------------
    here, yet there's no snow...
    Spica
    ---------------
    I don't like this.
     
    Spica
    ---------------
    Let's get this over with, 
    Spica
    ---------------
    for Mikage.
     `,
    
    godUraraDialogue: `God Urara
    ---------------
    Zzz...
     
    Spica
    ---------------
    Oh, Urara!
     
    Spica
    ---------------
    Why do you look so... bright?
    God Urara
    ---------------
    Zzz...
     `,

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
    agility: 200,
    bulletSpeed: 300,
    shootCooldown: 500,
    iframes: 400,

    multishotSpecial: false,
    pierceSpecial: true,
    homingSpecial: false,
    vacuumSpecial: false,

    stage1Dialogue: `Yuuhi
    ---------------
    Now where is that album? Mikage
    Yuuhi
    ---------------
    told me she needed my help looking
    Yuuhi
    ---------------
    for it, but why?
     `,

    tomoDialogue: `Tomo
    ---------------
    ... it's you again, the one who
    Tomo
    ---------------
    ruined my precious moment with
    Tomo
    ---------------
    my best friend... Where is she?
    Yuuhi
    ---------------
    Mikage? Dunno, sorry! But have
    Yuuhi
    ---------------
    you seen an album somewhere? It
    Yuuhi
    ---------------
    kinda looks like this--
    Tomo
    ---------------
    That's it, I'm done with waiting
    Tomo
    ---------------
    for her. All this ice cream is
    Tomo
    ---------------
    about to melt anyway... Say, maybe
    Tomo
    ---------------
    you should have it.
     `,

    stage2Dialogue: `Yuuhi
    ---------------
    What did that ice cream girl say
    Yuuhi
    ---------------
    again? Was it left or right...
    Yuuhi
    ---------------
    Wait, where am I?
     `,
    
    phantomDialogue: `Phantom
    ---------------
    I know what you did.
    Phantom
    ---------------
    Don't think you can get away from us.
    Yuuhi
    ---------------
    Do what now?
     
    Phantom
    ---------------
    Don't play dumb with me,
    Phantom
    ---------------
    you murderer.
     
    Phantom
    ---------------
    It's about time you paid the price,
    Phantom
    ---------------
    with your hair.
     `,
    
    stage3Dialogue: `Yuuhi
    ---------------
    Gah, where's my sunglasses when I
    Yuuhi
    ---------------
    actually need them!
    Yuuhi
    ---------------
    Mikage, you're treating me to
    Yuuhi
    ---------------
    Magic Spice ramen after this...
     `,
    
    godUraraDialogue: `God Urara
    ---------------
    Zzz...
    Yuuhi
    ---------------
    Urara, are you pranking me
    Yuuhi
    ---------------
    with your "God Urara" thing again?
    God Urara
    ---------------
    Zzz...
     `,
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
    agility: 15,
    bulletSpeed: 10,
    shootCooldown: 500,
    iframes: 2000,

    multishotSpecial: false,
    pierceSpecial: false,
    homingSpecial: false,
    vacuumSpecial: true,

    stage1Dialogue: `Urara
    ---------------
    Zzz... (Hehe, Mikage's gonna
    Urara
    ---------------
    become bald.)
     `,

    tomoDialogue: `Tomo
    ---------------
    Hey, I know you. You were with
    Tomo
    ---------------
    that yellow-haired dwarf when
    Tomo
    ---------------
    she took Mikage away.
    Urara
    ---------------
    Zzz... (Maybe you should finish
    Urara
    ---------------
    your ice cream before it melts.)
    Tomo
    ---------------
    How rude, can't you do anything
    Tomo
    ---------------
    else but snore at people? Maybe
    Tomo
    ---------------
    some ice cream will wake you up.
     `,

    stage2Dialogue: `Urara
    ---------------
    Zzz... (If only Spica or Yuuhi 
    Urara
    ---------------
    were here, I'd still be sleeping
    Urara
    ---------------
    in bed right now...)
     `,

    phantomDialogue: `Phantom
    ---------------
    Lord Urara, have mercy on us.
    Urara
    ---------------
    Zzz...
     
    Urara
    ---------------
    (Cease your useless begging.
    Urara
    ---------------
    I will exterminate you and your
    Urara
    ---------------
    kind, on behalf of my friend.)
    Phantom
    ---------------
    ...
     `,
    
    stage3Dialogue: `Urara
    ---------------
    Zzz... 
     
    Urara
    ---------------
    (At long last...)
     `
}

type LevelData = {
    spawnFlag: string,
    requirement: number,

    walkSpd: number,
    walkSpdVar: number,

    spawnInterval: number,
    spawnRate: number,

    spriteImg: Image,
    walkAnim: Image[]
}

const LEVEL1: LevelData = {
    spawnFlag: "LEVEL1",
    requirement: 19,

    walkSpd: -50,
    walkSpdVar: 10,

    spawnInterval: 1000,
    spawnRate: 100,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

const LEVEL2: LevelData = {
    spawnFlag: "LEVEL2",
    requirement: 25,

    walkSpd: -100,
    walkSpdVar: 10,

    spawnInterval: 700,
    spawnRate: 300,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

const LEVEL3: LevelData = {
    spawnFlag: "LEVEL3",
    requirement: 50,

    walkSpd: -100,
    walkSpdVar: 25,

    spawnInterval: 500,
    spawnRate: 340,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

const LEVEL4: LevelData = {
    spawnFlag: "LEVEL4",
    requirement: 70,

    walkSpd: -125,
    walkSpdVar: 30,

    spawnInterval: 500,
    spawnRate: 520,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

const LEVEL5: LevelData = {
    spawnFlag: "LEVEL5",
    requirement: 89,

    walkSpd: -110,
    walkSpdVar: 20,

    spawnInterval: 430,
    spawnRate: 600,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

const LEVEL6: LevelData = {
    spawnFlag: "LEVEL6",
    requirement: 125,

    walkSpd: -110,
    walkSpdVar: 10,

    spawnInterval: 350,
    spawnRate: 650,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

const LEVEL7: LevelData = {
    spawnFlag: "LEVEL7",
    requirement: 135,

    walkSpd: -200,
    walkSpdVar: 50,

    spawnInterval: 1500,
    spawnRate: 100,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

const LEVEL8: LevelData = {
    spawnFlag: "LEVEL8",
    requirement: 150,

    walkSpd: -120,
    walkSpdVar: 10,

    spawnInterval: 100,
    spawnRate: 20,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

const LEVEL9: LevelData = {
    spawnFlag: "LEVEL9",
    requirement: 170,

    walkSpd: -150,
    walkSpdVar: 30,

    spawnInterval: 50,
    spawnRate: 15,

    spriteImg: assets.image`PMikage left`,
    walkAnim: assets.animation`PMikage Walk`
}

type BossData = {
    spawnFlag: string,
    defeatedFlag: string,

    spriteImg: Image,

    leftWalkAnim: Image[],
    rightWalkAnim: Image[],
    deathAnim1: Image[],
    deathAnim2: Image[],

    bulletSprite: Image,
    bulletAnim: Image[],

    introPeriod: number,

    health: number,
    phase2Start: number,
    phase3Start: number,
    phase4Start: number,

    initialXSpeed: number,
    xSpeedUp: number,
    initialYSpeed: number,
    ySpeedUp: number,

    bulletSpeed: number,
    shootCooldown1: number,
    shootCooldown2: number,
    iframes: number
}

const TOMO: BossData = {
    spawnFlag: "TOMO",
    defeatedFlag: "TOMO_DEFEATED",

    spriteImg: assets.image`Tomo`,

    leftWalkAnim: assets.animation`Tomo Walk`,
    rightWalkAnim: null,
    deathAnim1: assets.animation`TomoDeath1`,
    deathAnim2: assets.animation`TomoDeath2`,

    bulletSprite: assets.image`Tomo Bullet`,
    bulletAnim: null,

    introPeriod: 2000,

    health: 10,
    phase2Start: 8,
    phase3Start: 5,
    phase4Start: 2,

    initialXSpeed: 0,
    xSpeedUp: 0,
    initialYSpeed: 50,
    ySpeedUp: 20,
    
    bulletSpeed: -170,
    shootCooldown1: 1200,
    shootCooldown2: 1200,
    iframes: 1000
}