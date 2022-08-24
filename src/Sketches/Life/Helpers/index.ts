import * as BABYLON from '@babylonjs/core';
import { Grid3D } from '../Classes';
import { Cell } from '../Types';


export const createCell = (position: BABYLON.Vector3, cellSize?: number): Cell => {
  let size = cellSize ? cellSize : 1;
  
  let newCell: Cell = ({
    alive: false,
    position: position,
    neighbours: [
      new BABYLON.Vector3(
        position.x * size + size,
        position.y * size,
        position.z * size,
      ),
      new BABYLON.Vector3(
        position.x * size - size,
        position.y * size,
        position.z * size,
      ),
      new BABYLON.Vector3(
        position.x * size,
        position.y * size + size,
        position.z * size,
      ),
      new BABYLON.Vector3(
        position.x * size,
        position.y * size - size,
        position.z * size,
      ),
      new BABYLON.Vector3(
        position.x * size,
        position.y * size,
        position.z * size + size,
      ),
      new BABYLON.Vector3(
        position.x * size,
        position.y * size,
        position.z * size - size,
      ),                                                                                    
    ],
  });

  return newCell;
}

export const cellExists = (grid: Grid3D, position: BABYLON.Vector3): boolean => {
  return grid.cells.some(cell => cell.position.equals(position));
}

export const neighbouringCells = (grid: Grid3D, cell: Cell): Cell[] => {
  let cells = grid.cells.filter((c) => {
    return cell.neighbours.some(position => position.equals(c.position))
  });

  return cells;
} 

export const livingNeighbours = (grid: Grid3D, cell: Cell): Cell[] => {
  return neighbouringCells(grid, cell).filter(cell => cell.alive)
}

export const livingNeighbourCount = (grid: Grid3D, cell: Cell): number => {
  return livingNeighbours(grid, cell).length;
};

export const missingNeighbourCells = (grid: Grid3D, cell: Cell): Cell[] => {
  return cell.neighbours
    .filter(position => !cellExists(grid, position))
    .map(pos => createCell(pos))
}

export const randomCell = (grid: Grid3D): Cell => {
  return grid.cells[Math.floor((Math.random() * grid.size ** 3))];
};

export default {
  createCell,
  cellExists,
  neighbouringCells,
  livingNeighbours,
  livingNeighbourCount,
  missingNeighbourCells,
  randomCell
};
