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

    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
     `, DialogLayout.Bottom)

    gameState = "INTRO2_COMPLETE"
}

function intro3() {

    game.showLongText(`CHAPTER 3:
    The End of a Dream`, DialogLayout.Center)

    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
     `, DialogLayout.Bottom)

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

    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
     `, DialogLayout.Bottom)

}

function phantomDeathDialogue() {

    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
     `, DialogLayout.Bottom)

}

function godUraraIntroDialogue() {

    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
     `, DialogLayout.Bottom)

}

function godUraraDeathDialogue() {

    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
     `, DialogLayout.Bottom)

}

function uraraEndingDialogue() {

    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
     `, DialogLayout.Bottom)

}

function regularEnding() {

    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
     `, DialogLayout.Full)

}

function sleepyEnding() {

    game.showLongText(`ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ`, DialogLayout.Full)

}
