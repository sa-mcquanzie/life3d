import * as BABYLON from '@babylonjs/core';
import { createCell } from "../Helpers";
import { Cell } from "../Types";

export default class Grid3D {
  size: number;
  cells: Cell[];
  
  constructor (
    size: number
  ) {
    this.size = size;
    this.cells = [];

    for (let z = 0; z < this.size; z++) {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          let newCell = createCell(new BABYLON.Vector3(x, y, z));
          this.cells.push(newCell);
        }
      }
    }
  }
}
