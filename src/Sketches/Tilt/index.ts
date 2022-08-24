import * as BABYLON from '@babylonjs/core';
import Sketch from '../Sketch';


interface ExitProps {
  north: boolean
  east: boolean
  south: boolean
  west: boolean
}
class Tile {
  exits: ExitProps
  uid: number
  mesh: BABYLON.Mesh

  constructor(exits: ExitProps) {
    this.exits = exits;
    this.uid = this.createUID();
    this.mesh = this.createMesh();
  }

  createUID = (): number => {
    let number = 0;

    if(this.exits.north) number += 1
    if(this.exits.east) number += 2
    if(this.exits.south) number += 4
    if(this.exits.west) number += 8

    return number;
  }

  createMesh = (): BABYLON.Mesh => {
    let meshes = [];

    let tileGround = BABYLON.MeshBuilder.CreateBox(
      `tileGround-${this.uid}`,
      { width: 1, depth: 1, height: 0.1 },
    );

    meshes.push(tileGround);

    let wallHorizontal = BABYLON.MeshBuilder.CreateBox(
      `tileWallHorizontal-${this.uid}`,
      { width: 1, depth: 0.1, height: 2 }
    );

    let wallVertical = BABYLON.MeshBuilder.CreateBox(
      `tileWallVertical-${this.uid}`,
      { width: 0.1, depth: 1, height: 2 }
    );

    [wallHorizontal, wallVertical].forEach(wall => wall.isVisible = false);

    if(!this.exits.north) {
      let northWall = wallHorizontal.clone(`northWall-${this.uid}`);

      northWall.position.z += 0.5;
      meshes.push(northWall);
    };

    if(!this.exits.east) {
      let eastWall = wallVertical.clone(`eastWall-${this.uid}`);

      eastWall.position.x += 0.5;
      meshes.push(eastWall);
    };

    if(!this.exits.south) {
      let southWall = wallHorizontal.clone(`southWall-${this.uid}`);

      southWall.position.z -= 0.5;
      meshes.push(southWall);
    };

    if(!this.exits.west) {
      let westWall = wallVertical.clone(`westWall-${this.uid}`);

      westWall.position.x -= 0.5;
      meshes.push(westWall);
    };

    let tileMesh = BABYLON.Mesh.MergeMeshes(meshes);
 
    tileMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      tileMesh,
      BABYLON.PhysicsImpostor.MeshImpostor,
      { mass: 0 }
    );

    return tileMesh;
  }
}
export default class Tilt extends Sketch {
  constructor(canvas: string) {
    super(canvas);
  }

  create(): BABYLON.Scene {
    this.scene.enablePhysics();

    const camera = new BABYLON.FreeCamera(
      'freeCamera',
      new BABYLON.Vector3(0, 10, -10),
      this.scene
    );

    camera.attachControl();
    
    camera.setTarget(BABYLON.Vector3.Zero());

    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );

    const ball = BABYLON.MeshBuilder.CreateSphere('ball');

    const ground = BABYLON.MeshBuilder.CreateBox(
      'ground',
      { width: 100, depth: 100, height: 0.1 },
      this.scene
    );

    const topWall = BABYLON.MeshBuilder.CreateBox(
      'topWall',
      { width: 100, depth: 0.1, height: 2 },
      this.scene
    );

    const rightWall = BABYLON.MeshBuilder.CreateBox(
      'rightWall',
      { width: 0.1, depth: 100, height: 2 },
      this.scene
    );

    const bottomWall = BABYLON.MeshBuilder.CreateBox(
      'bottomWall',
      { width: 100, depth: 0.1, height: 2 },
      this.scene
    );

    const leftWall = BABYLON.MeshBuilder.CreateBox(
      'leftWall',
      { width: 0.1, depth: 100, height: 2 },
      this.scene
    );

    ball.position.y += 4;
    topWall.position.z += 50;
    rightWall.position.x += 50;
    bottomWall.position.z -= 50;
    leftWall.position.x -= 50;

    const frameMeshes = [ground, topWall, rightWall, bottomWall, leftWall];

    frameMeshes.slice(1).forEach(mesh => mesh.position.y += 1);

    const frame = BABYLON.Mesh.MergeMeshes(frameMeshes);

    frame.rotationQuaternion = (BABYLON.Quaternion.FromEulerAngles(0, 0, 0));

    frame.physicsImpostor = new BABYLON.PhysicsImpostor(
      frame,
      BABYLON.PhysicsImpostor.MeshImpostor,
      { mass: 0 },
      this.scene
    );

    ball.physicsImpostor = new BABYLON.PhysicsImpostor(
      ball,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 0.9 },
      this.scene
    );

    this.scene.onKeyboardObservable.add((kbInfo) => {
      let frameRotation = frame.rotationQuaternion.toEulerAngles();

      switch (kbInfo.type) {
        case BABYLON.KeyboardEventTypes.KEYDOWN:
          switch (kbInfo.event.code) {
            case 'KeyW':
            case 'ArrowUp':
              if(frameRotation.x < Math.PI / 6) frame.addRotation(0.1, 0, 0);
              break;
            case 'KeyA':
            case 'ArrowLeft':
              if(frameRotation.z < Math.PI / 6) frame.addRotation(0, 0, 0.1);
              break;
            case 'KeyS':
            case 'ArrowDown':
              if(frameRotation.x > -(Math.PI / 6)) frame.addRotation(-0.1, 0, 0);
              break;
            case 'KeyD':
            case 'ArrowRight':
              if(frameRotation.z > -(Math.PI / 6)) frame.addRotation(0, 0, -0.1);
              break;
            default:
              break;
          }
          break;
        case BABYLON.KeyboardEventTypes.KEYUP:
          break;
      }
    });

    this.scene.onBeforeRenderObservable.add(() => {
      if (frame.rotationQuaternion.toEulerAngles().x > 0) {
        frame.addRotation(-0.01, 0, 0);
      };

      if (frame.rotationQuaternion.toEulerAngles().x < 0) {
        frame.addRotation(0.01, 0, 0);
      };

      if (frame.rotationQuaternion.toEulerAngles().y > 0) {
        frame.addRotation(0, -0.01, 0);
      };

      if (frame.rotationQuaternion.toEulerAngles().y < 0) {
        frame.addRotation(0, 0.01, 0);
      };

      if (frame.rotationQuaternion.toEulerAngles().z > 0) {
        frame.addRotation(0, 0, -0.01);
      };

      if (frame.rotationQuaternion.toEulerAngles().z < 0) {
        frame.addRotation(0, 0, 0.01);
      };
    });

    const newTile = new Tile({north: false, east: false, south: true, west: false});
    console.log(newTile.mesh);

    return this.scene
  }
};
