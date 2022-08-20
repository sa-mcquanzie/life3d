import * as BABYLON from '@babylonjs/core';

export default class Sketch {
  canvas: (
    HTMLCanvasElement
    | OffscreenCanvas
    | WebGLRenderingContext
    | WebGL2RenderingContext
  );
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  meshes: (BABYLON.Mesh)[];

  constructor(canvas: string) {
    this.canvas = document.getElementById(canvas) as HTMLCanvasElement;
    this.engine = new BABYLON.Engine(this.canvas);
    this.scene = new BABYLON.Scene(this.engine);
    this.meshes = [];
  }


	create(): BABYLON.Scene {
    return this.scene;
  }


  render(): void {
    this.engine.runRenderLoop(() => {
        this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }
}
