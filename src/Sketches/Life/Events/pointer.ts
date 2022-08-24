import * as BABYLON from '@babylonjs/core';

export const handlePointerEvents = (pointerInfo: BABYLON.PointerInfo, scene?: BABYLON.Scene): void => {
  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERTAP:
        if(pointerInfo.pickInfo.hit) {
          let hit = pointerInfo.pickInfo.pickedMesh;
          // let thisCell = grid.cells.find(cell => cell.position === hit.position);
        } 
      break;
    }
  });
}

