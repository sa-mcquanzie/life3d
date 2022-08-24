import * as BABYLON from '@babylonjs/core';
import { Exits } from '../Types';

export default class Tile {
  exits: Exits
  uid: number
  mesh: BABYLON.Mesh

  constructor(exits: Exits) {
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

    [wallHorizontal, wallVertical].forEach((wall) => {
      wall.position.y += (0.5 - 0.05);
      wall.isVisible = false;
    });

    if(!this.exits.north) {
      let northWall = wallHorizontal.clone(`northWall-${this.uid}`);

      northWall.position.z += 0.45;
      meshes.push(northWall);
    };

    if(!this.exits.east) {
      let eastWall = wallVertical.clone(`eastWall-${this.uid}`);

      eastWall.position.x += 0.45;
      meshes.push(eastWall);
    };

    if(!this.exits.south) {
      let southWall = wallHorizontal.clone(`southWall-${this.uid}`);

      southWall.position.z -= 0.45;
      meshes.push(southWall);
    };

    if(!this.exits.west) {
      let westWall = wallVertical.clone(`westWall-${this.uid}`);

      westWall.position.x -= 0.45;
      meshes.push(westWall);
    };

    let tileMesh = BABYLON.Mesh.MergeMeshes(meshes);

    tileMesh.checkCollisions = true;
 
    // tileMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
    //   tileMesh,
    //   BABYLON.PhysicsImpostor.MeshImpostor,
    //   { mass: 0 }
    // );

    return tileMesh;
  }
}
