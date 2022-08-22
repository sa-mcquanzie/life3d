import * as BABYLON from '@babylonjs/core';
import Sketch from '../Sketch';

export default class Maze extends Sketch {
  constructor(canvas: string) {
    super(canvas);
  }

  create(): BABYLON.Scene {
    this.scene.enablePhysics();

    const camera = new BABYLON.FreeCamera(
      'freeCamera',
      new BABYLON.Vector3(0, 8, -8),
      this.scene
    );
    
    camera.setTarget(BABYLON.Vector3.Zero());

    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );

    const ball = BABYLON.MeshBuilder.CreateSphere('ball');

    const ground = BABYLON.MeshBuilder.CreateBox(
      'ground',
      { width: 6, depth: 6, height: 0.1 },
      this.scene
    );

    const topWall = BABYLON.MeshBuilder.CreateBox(
      'topWall',
      { width: 6, depth: 0.1, height: 2 },
      this.scene
    );

    const rightWall = BABYLON.MeshBuilder.CreateBox(
      'rightWall',
      { width: 0.1, depth: 6, height: 2 },
      this.scene
    );

    const bottomWall = BABYLON.MeshBuilder.CreateBox(
      'bottomWall',
      { width: 6, depth: 0.1, height: 2 },
      this.scene
    );

    const leftWall = BABYLON.MeshBuilder.CreateBox(
      'leftWall',
      { width: 0.1, depth: 6, height: 2 },
      this.scene
    );

    ball.position.y += 4;
    topWall.position.z += 3;
    rightWall.position.x += 3;
    bottomWall.position.z -= 3;
    leftWall.position.x -= 3;

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

    return this.scene
  }
};
