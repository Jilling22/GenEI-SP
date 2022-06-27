// Add your code here
function transitionTo(bg: Image) {
    const transitionScreen = sprites.create(assets.image`transition`, SpriteKind.ScreenEffect);
    transitionScreen.z = 10;

    animation.runImageAnimation(transitionScreen, assets.animation`transition close`, 100, false);

    timer.after(500, () => {
        scene.setBackgroundImage(bg)
        animation.runImageAnimation(transitionScreen, assets.animation`transition open`, 100, false);
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