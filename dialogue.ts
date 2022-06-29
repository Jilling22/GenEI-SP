// Add your code here
function transitionTo(bg: Image) {
    const transitionScreen = sprites.create(assets.image`transition`, SpriteKind.ScreenEffect);
    transitionScreen.z = 10;

    animation.runImageAnimation(transitionScreen, assets.animation`transition close`, 100, false);

    timer.after(1000, () => {
        scene.setBackgroundImage(bg)
        
        animation.runImageAnimation(transitionScreen, assets.animation`transition open`, 100, false);
    })

    timer.after(2000, () => {
        transitionScreen.destroy()
    })
}

function intro() {
    gameState = "LOADING"

    game.showLongText(`CHAPTER 1:
    The Path of Wisdom`, DialogLayout.Center)

    game.showLongText(player.spriteAssets.stage1Dialogue, DialogLayout.Bottom)
    

    gameState = "INTRO_COMPLETE"
}

function intro2() {

    game.showLongText(`CHAPTER 2:
    The Forest of Shadows`, DialogLayout.Center)

    game.showLongText(`It is always midnight in the forest, even with the sun high above. The sky is riddled with vines and broken glass. Occasionally, you can see spots of blue and pink among the shadows. A lone firefly floats by.`, DialogLayout.Bottom)
    game.showLongText(player.spriteAssets.stage2Dialogue, DialogLayout.Bottom)

    gameState = "INTRO2_COMPLETE"
}

function intro3() {

    game.showLongText(`CHAPTER 3:
    The End of a Dream`, DialogLayout.Center)

    game.showLongText(`You open your eyes to a haze of white, in stark contrast to the pitch black just a few moments ago. The glass, the vines, the shadows, all of it is gone. Instead, you are engulfed in light. It tells you to move forward, towards your destiny.`, DialogLayout.Bottom)
    game.showLongText(player.spriteAssets.stage3Dialogue, DialogLayout.Bottom)

    gameState = "INTRO3_COMPLETE"
}

function tomoIntroDialogue() {

    game.showLongText(player.spriteAssets.tomoDialogue, DialogLayout.Bottom)
     
}

function tomoDeathDialogue() {

    game.showLongText(`Tomo
    ---------------
    Please... spare me... I just 
    Tomo
    ---------------
    wanted to eat this ice cream 
    Tomo
    ---------------
    with someone...
     
    Tomo
    ---------------
    ... if you're looking for GenEi
    Tomo
    ---------------
    SP, it's in the forest
    Tomo
    ---------------
    over there...
     `, DialogLayout.Bottom)
     
}

function phantomIntroDialogue() {

    game.showLongText(player.spriteAssets.phantomDialogue, DialogLayout.Bottom)

}

function phantomDeathDialogue() {

    game.showLongText(`Phantom
    ---------------
    PH'NGLUIMGLW'NAFHCT
    Phantom
    ---------------
    HULHUR'LYEHWGAH'NA
     
    Phantom
    ---------------
    ... the album... is not
    Phantom
    ---------------
    with me anymore...
     `, DialogLayout.Bottom)

}

function godUraraIntroDialogue() {

    game.showLongText(player.spriteAssets.godUraraDialogue, DialogLayout.Bottom)

}

function godUraraDeathDialogue() {

    game.showLongText(`God Urara
    ---------------
    Zzz...
     
    God Urara
    ---------------
    Zzz...
     `, DialogLayout.Bottom)

}

function uraraEndingDialogue() {

    game.showLongText(`Urara
    ---------------
    Zzz...
     
    Urara
    ---------------
    (It seems I had the album in
    Urara
    ---------------
    my pocket the whole time.
    Urara
    ---------------
    Silly me.)
     `, DialogLayout.Bottom)

}

function regularEnding() {

    if (player.spriteAssets.name === "Mikage") {
        
        game.showLongText(`After a long and grueling battle with God Urara, Mikage had finally gotten the rumored album, which could cure baldness. Playing the album, she thought to herself, it would've been funny if it somehow didn't work out.`, DialogLayout.Full)
        game.showLongText(`Then slowly, but surely, her hair began to fall out faster... and faster... until Mikage's head was as smooth as Nana's globe.`, DialogLayout.Full)

        game.showLongText(`Mikage
        ---------------
        Is this some sick Harucord
        Mikage
        ---------------
        joke? Why?
         
        Mikage
        ---------------
        I'll just be forever
        Mikage
        ---------------
        a bald phantom...
         `, DialogLayout.Bottom)

    } else if (player.spriteAssets.name === "Spica") {

        game.showLongText(`After a long and grueling battle with God Urara, Spica had finally gotten the rumored album, which could cure baldness. Curious as to why Mikage had asked her to find the album, however, Spica thought, maybe it wouldn't hurt if she listened to a few songs first.`, DialogLayout.Full)
        game.showLongText(`Maybe one of them was Mikage's favorite. Then slowly, but surely, her hair began to fall out faster... and faster... until Mikage's head was as smooth as Nana's globe.`, DialogLayout.Full)

        game.showLongText(`Mikage
        ---------------
        Spica, you're... you're...
        Spica
        ---------------
        Just in time, Mikage! Wanna listen
        Spica
        ---------------
        to my new favorite song?
        Mikage
        ---------------
        I'll just be forever
        Mikage
        ---------------
        a bald phantom...
         `, DialogLayout.Bottom)

    } else if (player.spriteAssets.name === "Yuuhi") {

        game.showLongText(`After a long and grueling battle with God Urara, Yuuhi had finally gotten the rumored album, which could cure baldness. She called Mikage, and told her she'd only give the album to her if Mikage treats her out to Magic Spice ramen.`, DialogLayout.Full)
        game.showLongText(`Mikage agrees, and when the two meet up, Yuuhi unwittingly plays the album... Then slowly, but surely, her hair began to fall out faster... and faster... until Mikage's head was as smooth as Nana's globe.`, DialogLayout.Full)

        game.showLongText(`Yuuhi
        ---------------
        Mikage... give me my hair back!
        Mikage
        ---------------
        Stop chasing me, it's not
        Mikage
        ---------------
        my fault!
         
        Mikage
        ---------------
        I'll just be forever
        Mikage
        ---------------
        a bald phantom...
         `, DialogLayout.Bottom)
    }
}

function sleepyEnding() {

    game.showLongText(`Urara finally realizes she's had the album all along with her, but before she could take it back to Mikage, she falls asleep, tired from the adventure. Back in her room, Mikage starts to panic, as she grasps at her hair about to fall apart any second now.`, DialogLayout.Full)
    game.showLongText(`Slowly, but surely, her hair began to fall out faster... and faster... not really? A few hours later, it turns out Mikage's hair was fine all along, her hair still silky smooth and existent.`, DialogLayout.Full)

    game.showLongText(`Mikage
    ---------------
    No way... I'm... not bald?
    Urara
    ---------------
    Zzz...
     
    Urara
    ---------------
    (Looks like the rumors got it
    Urara
    ---------------
    it completely mixed up. Those who
    Urara
    ---------------
    listened to that album were the
    Urara
    ---------------
    who became bald)
     
    Mikage
    ---------------
    Thank you, Urara...
    Mikage
    ---------------
    Now I'll just be forever
    Mikage
    ---------------
    a phantom...
     `, DialogLayout.Bottom)
}
