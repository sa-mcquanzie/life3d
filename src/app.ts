import { Life3D, Maze } from './Sketches';
import * as CANNON from 'cannon';

window.CANNON = CANNON;

window.addEventListener('DOMContentLoaded', () => {
    let game = new Maze('renderCanvas');

    game.create();
    game.render();
  });
