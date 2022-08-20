import Life3D from './Sketches/Life3D';
window.addEventListener('DOMContentLoaded', () => {
    let game = new Life3D('renderCanvas');

    game.create();
    game.render();
  });
  