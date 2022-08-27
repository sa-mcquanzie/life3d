import * as BABYLON from '@babylonjs/core';
import Sketch from '../Sketch';
import { Tile } from './Classes';
import PlayerCameraKeyboardInput from './Classes/PlayerCameraKeyboardInput';
import { generateMaze } from './Helpers';

export default class Maze extends Sketch {
  tiles: Tile[]

  constructor(canvas: string) {
    super(canvas);
  }

  create(): BABYLON.Scene {
    const fps = 60;
    const gravity = -10;

    this.scene.gravity = new BABYLON.Vector3(0, gravity / fps, 0);
    this.scene.enablePhysics();
    this.scene.collisionsEnabled = true;

    this.tiles = [];

    const cells = generateMaze(30);

    cells.forEach((cell) => {
      let newTile = new Tile(cell.exits, cell.x, cell.z);
      this.tiles.push(newTile);

      newTile.meshes.forEach((mesh) => {
        this.meshes.push(mesh);
      })
    });

    const camera = new BABYLON.UniversalCamera(
      'playerCamera',
      new BABYLON.Vector3(0, 2, 1),
      this.scene
    );

    const playerBox = BABYLON.MeshBuilder.CreateSphere(
      'playerBox',
      { diameterX: 1.5, diameterY: 2, diameterZ: 1.5 }
    );

    playerBox.position = camera.position;
    playerBox.checkCollisions = true;

    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 3, 1);
    camera.ellipsoidOffset = new BABYLON.Vector3(0, 0, -1);
    camera.minZ = -1;

    camera.inputs.remove(camera.inputs.attached.keyboard);
    camera.inputs.add(new PlayerCameraKeyboardInput(playerBox));
    camera.attachControl(this.canvas, true);
    camera.setTarget(new BABYLON.Vector3(0, 2, 0));

    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );

    const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, this.scene);
    const skyboxMaterial = new BABYLON.StandardMaterial('skyBoxMaterial', this.scene);

    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      'src/Assets/Maze/Textures/skybox',
      this.scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    skybox.material = skyboxMaterial;

    return this.scene
  }
};
