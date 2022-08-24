import * as BABYLON from '@babylonjs/core';
import Sketch from '../Sketch';
import { Tile } from './Classes';
import { generateMaze } from './Helpers';


export default class Maze extends Sketch {
  tiles: Tile[]

  constructor(canvas: string) {
    super(canvas);
  }

  create(): BABYLON.Scene {
    const fps = 60;
    const gravity = -10;

    this.tiles = [];
    this.scene.gravity = new BABYLON.Vector3(0, gravity / fps, 0);
    this.scene.enablePhysics();
    this.scene.collisionsEnabled = true;

    const camera = new BABYLON.UniversalCamera(
      'playerCamera',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );

    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(0.1, 1, 0.1);
    camera.checkCollisions = true;
    camera.attachControl();
    camera.setTarget(new BABYLON.Vector3(0, 1, 0));

    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );

    const cells = generateMaze(30);

    cells.forEach((cell) => {
      let newTile = new Tile(cell.exits);
      
      newTile.mesh.position.x = cell.x;
      newTile.mesh.position.z = cell.z;

      this.tiles.push(newTile);
      this.meshes.push(newTile.mesh);
    });

    this.tiles.forEach(tile => tile.mesh.isVisible = true)

    return this.scene
  }
};
