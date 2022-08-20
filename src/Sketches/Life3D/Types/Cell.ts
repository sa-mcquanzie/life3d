import * as BABYLON from '@babylonjs/core';


export type Cell = {
  alive: boolean;
  position: BABYLON.Vector3;
  neighbours: BABYLON.Vector3[];
};
