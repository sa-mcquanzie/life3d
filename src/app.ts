import Scene from './scene'
window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'.
    let game = new Scene('renderCanvas');

    // Create the scene.
    game.createScene();

    // Start render loop.
    game.renderScene();
  });