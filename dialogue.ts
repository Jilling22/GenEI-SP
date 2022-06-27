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
    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
     `, DialogLayout.Bottom)
    gameState = "INTRO_COMPLETE"
}

function intro2() {

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

    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
     `, DialogLayout.Bottom)
     
}

function tomoDeathDialogue() {

    game.showLongText(`Harumaki Gohan
    ---------------
    One day, Mikage became bald.
    Harumaki Gohan
    ---------------
    Hahaha kekw
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