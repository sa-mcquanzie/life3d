import * as BABYLON from '@babylonjs/core';

// Types

type Block = {
  name: string;
  mesh: BABYLON.InstancedMesh;
}

type Cell = {
  num: number;
  alive: boolean;
  position: BABYLON.Vector3;
  block?: Block;
  neighbours: BABYLON.Vector3[];
};


// Classes

class Grid3D {
  cells?: Cell[];
  size: number;
  
  constructor (
    cells: Cell[],
    size: number
  ) {
    this.cells = cells;
    this.size = size;
  }
}


class Scene {
  canvas: (
    HTMLCanvasElement
    | OffscreenCanvas
    | WebGLRenderingContext
    | WebGL2RenderingContext
  );
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;

  constructor(canvas: string) {
    this.canvas = document.getElementById(canvas) as HTMLCanvasElement;
    this.engine = new BABYLON.Engine(this.canvas);
    this.scene = new BABYLON.Scene(this.engine);
  }


	createScene(): BABYLON.Scene {  
     
    // Consts

    const COLOURS = [
      BABYLON.Color3.Gray(),
      BABYLON.Color3.Red(),
      BABYLON.Color3.Green(),
      BABYLON.Color3.Blue()
    ];

    const GRID_SIZE = 10;


    // Functions

    const modIncrement = (num: number, mod: number, inc: number = 1) => {
      return (num + inc) % mod;
    }

    const cellAt = (grid: Grid3D, position: BABYLON.Vector3): Cell => {
      return grid.cells.find(cell => cell.position = position);
    }


    // Lights

    const hemiLight = new BABYLON.HemisphericLight(
      'hemiLight',
      new BABYLON.Vector3(1, 1, 1),
      this.scene
    );

    const spotLight = new BABYLON.SpotLight(
      'spotLight',
      new BABYLON.Vector3(0, 30, -10),
      new BABYLON.Vector3(0, -1, 0),
      Math.PI / 3, 2, this.scene
    );
    

    // Camera

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
       -Math.PI / 4,
       Math.PI / 3,
       6,
       BABYLON.Vector3.Zero(),
       this.scene
    );
    
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(this.canvas, true);


    // Things

    const blockTemplate = BABYLON.MeshBuilder.CreateBox(
      'cubeTemplate',
      { size: 0.1, updatable: true },
      this.scene
    );

    blockTemplate.material = new BABYLON.StandardMaterial(
      'block-material',
      this.scene
    );

    blockTemplate.checkCollisions = true;
    blockTemplate.isPickable = true;
    blockTemplate.isVisible = false;

    const cubeSize = 0.1;
    let cells = [] as Cell[];
    let cellNumber = 0;

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          cellNumber++

          const cell: Cell = ({
            alive: false,
            block: null,
            neighbours: [
              new BABYLON.Vector3(
                x * cubeSize + cubeSize,
                y * cubeSize,
                z * cubeSize,
              ),
              new BABYLON.Vector3(
                x * cubeSize - cubeSize,
                y * cubeSize,
                z * cubeSize,
              ),
              new BABYLON.Vector3(
                x * cubeSize,
                y * cubeSize + cubeSize,
                z * cubeSize,
              ),
              new BABYLON.Vector3(
                x * cubeSize,
                y * cubeSize - cubeSize,
                z * cubeSize,
              ),
              new BABYLON.Vector3(
                x * cubeSize,
                y * cubeSize,
                z * cubeSize + cubeSize,
              ),
              new BABYLON.Vector3(
                x * cubeSize,
                y * cubeSize,
                z * cubeSize - cubeSize,
              ),                                                                                    
            ],
            num: cellNumber,
            position: new BABYLON.Vector3(
              x * cubeSize,
              y * cubeSize,
              z * cubeSize,
            ),
          });
            
          cells.push(cell);
        }
      }
    }

    const grid = new Grid3D(cells, GRID_SIZE);

    grid.cells.forEach(cell => {
      let block = blockTemplate.createInstance(`block-${cell.num}`);
      block.position = cell.position;
      block.isVisible = false;
    })

    grid.cells[20].neighbours.forEach(neighbour => {
      let cell = cellAt(grid, neighbour);
      let block = blockTemplate.createInstance(`block-${cell.num}`);

      block.position = cell.position;
      block.isVisible = true;

      cell.block = {name: `block-${cell.num}`, mesh: block};
    });


    // Actions

    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERTAP:
          if(pointerInfo.pickInfo.hit) {
            let hit = pointerInfo.pickInfo.pickedMesh;

            if(hit.name.includes('block')) {
              hit.isVisible
              ? hit.isVisible = false
              : hit.isVisible = true
            }
          }
        break;
      }
    });

    return this.scene;
  }


  renderScene(): void {
    this.engine.runRenderLoop(() => {
        this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }
}

export default Scene;
