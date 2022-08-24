import * as BABYLON from '@babylonjs/core';
import Sketch from '../Sketch';
import { Grid3D } from './Classes';
import {
  buildAssetName,
  clonedMesh,
  findMeshByName,
  hideMesh,
  meshExists,
  showMesh
} from '../Sketch/Helpers';
import {
  cellExists,
  createCell,
  livingNeighbourCount,
  missingNeighbourCells,
  randomCell
} from './Helpers';


export default class Life extends Sketch {
  constructor(canvas: string) {
    super(canvas);
  }

	create(): BABYLON.Scene {
    // Consts

    const GRID_SIZE = 10;
    const BLOCK = BABYLON.MeshBuilder.CreateBox(
      'BLOCK',
      { size: 1, updatable: true }
    );

    BLOCK.material = new BABYLON.StandardMaterial('standard-material');
    BLOCK.checkCollisions = true;
    BLOCK.isPickable = true;
    BLOCK.isVisible = false;

    // Lights

    const hemiLight = new BABYLON.HemisphericLight(
      'hemiLight',
      new BABYLON.Vector3(1, 1, 1),
      this.scene
    );

    const spotLight = new BABYLON.SpotLight(
      'spotLight',
      new BABYLON.Vector3(60, 60, 60),
      new BABYLON.Vector3(1, 1, 1),
      Math.PI / 3, 2, this.scene
    );


    const sun = new BABYLON.DirectionalLight(
      'directionalLight',
      new BABYLON.Vector3(0, -1, 0),
      this.scene
    );
    

    // Camera

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
       -Math.PI / 4,
       Math.PI / 3,
       30,
       BABYLON.Vector3.Zero(),
       this.scene
    );
    
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(this.canvas, true);

    // Things


    const grid = new Grid3D(GRID_SIZE);

    for(let i = 0; i < 100; i++) {
      let cell = randomCell(grid);      
      cell.alive = true;
      this.meshes.push(clonedMesh(BLOCK, 'block', cell.position, true));
      missingNeighbourCells(grid, cell).forEach(neighbourCell => grid.cells.push(neighbourCell));
    }


    // Actions

    let frameCount = 0;

    this.scene.registerBeforeRender(() => {
      frameCount++;

      if (frameCount > 0 && frameCount % 15 === 0) {
        grid.cells.forEach((cell) => {
          let cellMesh = findMeshByName(buildAssetName('block', 'mesh', cell.position), this);
          let neighboursWithoutCells = cell.neighbours.filter(position => !cellExists(grid, position));
          
          switch(livingNeighbourCount(grid, cell)) {
            case 0:
            case 1:
            case 5:
            case 6:
              cell.alive = false;
              break;
            case 2:
            case 3:
            case 4:
              cell.alive = true;
              break;
            default:
              break;
          }

          if(!cell.alive) {
            if(cellMesh) hideMesh(cellMesh)
          }

          if(cell.alive) {
            neighboursWithoutCells.forEach(position => grid.cells.push(createCell(position)));

            if(!meshExists(cell.position, this)) {
              this.meshes.push(clonedMesh(BLOCK, 'block', cell.position, true));
            } else {
              showMesh(cellMesh);
            }
          }
        })
      }
    });

    return this.scene;
  }
}
