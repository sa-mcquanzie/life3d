import * as BABYLON from '@babylonjs/core';


type KeyProps = {
  lookLeft: number[]
  lookUp: number[]
  lookRight: number[]
  lookDown: number[]
  walkForwards: number[]
  walkBackwards: number[]
  strafeLeft: number[]
  strafeRight: number[]
}

export default class PlayerCameraKeyboardInput implements BABYLON.ICameraInput<BABYLON.Camera> {
  camera: BABYLON.UniversalCamera;
  keys: KeyProps;
  lookingSpeed: number;
  movingSpeed: number;
  sprintingSpeed: number;
  playerBox: BABYLON.Mesh;
  walkingSpeed: number;
  
  #keys: number[];
  #onKeyboardObserver: BABYLON.Nullable<BABYLON.Observer<BABYLON.KeyboardInfo>>
  #scene: BABYLON.Scene;

  
  constructor(playerBox: BABYLON.Mesh) {
    this.playerBox = playerBox;
    this.walkingSpeed = 0.1;
    this.sprintingSpeed = 0.15;
    this.movingSpeed = this.walkingSpeed;
    this.lookingSpeed = 0.01;
    this.keys = {
      lookLeft: [37],
      lookUp: [38],
      lookRight: [39],
      lookDown: [40],
      walkForwards: [87],
      walkBackwards: [83],
      strafeLeft: [65],
      strafeRight: [68]
    }
    this.#keys = [];
  }


  #customKeyPressed = (keyCode: number, keyArray?: number[]): boolean => {
    if(keyArray) return keyArray.indexOf(keyCode) !== -1

    return Object.values(this.keys).some((arr) => {
      return arr.indexOf(keyCode) !== -1
    });
  }

  getClassName(): string {
    return "PlayerCameraKeyboardInput";
  }

  getSimpleName(): string {
    return "simple";
  }

  attachControl(noPreventDefault?: boolean): void {
    this.#scene = this.camera.getScene();
    this.#onKeyboardObserver = this.#scene.onKeyboardObservable.add((kbInfo) => {
      const kbEvent = kbInfo.event;

      if(kbInfo.event.shiftKey) {
        this.movingSpeed = this.sprintingSpeed;
      } else {
        this.movingSpeed = this.walkingSpeed;
      }

      if (
        kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN &&
        this.#customKeyPressed(kbEvent.keyCode)
      ) {
        const index = this.#keys.indexOf(kbEvent.keyCode);

        if (index === -1) {
          this.#keys.push(kbEvent.keyCode);
        }

        if (kbEvent.preventDefault) {
          if (!noPreventDefault) {
            kbEvent.preventDefault();
          }
        }
      } else if (this.#customKeyPressed(kbEvent.keyCode)) {
        const index = this.#keys.indexOf(kbEvent.keyCode);

        if (index >= 0) {
          this.#keys.splice(index, 1);
        }

        if (kbEvent.preventDefault) {
          if (!noPreventDefault) {
            kbEvent.preventDefault();
          }
        }
      }
    });
  }

  detachControl(): void {
    if (this.#scene) {
      if (this.#onKeyboardObserver) {
        this.#scene.onKeyboardObservable.remove(this.#onKeyboardObserver);
      }

      this.#onKeyboardObserver = null;
    }

    this.#keys = [];
  }

  checkInputs(): void {
    if (this.#onKeyboardObserver) {
      const camera = this.camera;
      const right = camera.getDirection(new BABYLON.Vector3(this.movingSpeed, 0, 0));
      const left = camera.getDirection(new BABYLON.Vector3(-this.movingSpeed, 0, 0));
      const forwards = camera.getDirection(new BABYLON.Vector3(0, 0, this.movingSpeed));
      const backwards = camera.getDirection(new BABYLON.Vector3(0, 0, -this.movingSpeed));
      const walls = this.playerBox.getScene().meshes.filter(mesh => mesh.name.includes('Wall'));      

      const colliding = (): boolean => {
        return !!walls.find(wall => this.playerBox.intersectsMesh(wall));
      };

      const move = (): void => {        
        for (let index = 0; index < this.#keys.length; index++) {
          const keyCode = this.#keys[index];

          
          if (this.#customKeyPressed(keyCode, this.keys.lookLeft)) {
            camera.cameraRotation.y -= this.lookingSpeed;
          } else if (this.#customKeyPressed(keyCode, this.keys.lookUp)) {
            camera.cameraRotation.x -= this.lookingSpeed;
          } else if (this.#customKeyPressed(keyCode, this.keys.lookRight)) {
            camera.cameraRotation.y += this.lookingSpeed;
          } else if (this.#customKeyPressed(keyCode, this.keys.lookDown)) {
            camera.cameraRotation.x += this.lookingSpeed;
          } else if (this.#customKeyPressed(keyCode, this.keys.walkForwards)) {
            this.playerBox.moveWithCollisions(forwards);
          } else if (this.#customKeyPressed(keyCode, this.keys.walkBackwards)) {
            this.playerBox.moveWithCollisions(backwards);
            camera.position = this.playerBox.position;
          } else if (this.#customKeyPressed(keyCode, this.keys.strafeLeft)) {
            this.playerBox.moveWithCollisions(left);
          } else if (this.#customKeyPressed(keyCode, this.keys.strafeRight)) {
            this.playerBox.moveWithCollisions(right);
          }
        }

        camera.position = this.playerBox.position;
        camera.position.y = 3;   
      };

      move();
    }
  }
}
