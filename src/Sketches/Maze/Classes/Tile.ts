import * as BABYLON from '@babylonjs/core';
import { Exits } from '../Types';

export default class Tile {
  exits: Exits
  uid: number
  meshes: BABYLON.Mesh[]
  originX: number
  originZ: number

  constructor(exits: Exits, originX: number, originZ: number) {
    this.exits = exits;
    this.uid = this.createUID();
    this.originX = originX;
    this.originZ = originZ;
    this.meshes = this.createMeshes();
  }

  createUID = (): number => {
    let number = 0;

    if(this.exits.north) number += 1
    if(this.exits.east) number += 2
    if(this.exits.south) number += 4
    if(this.exits.west) number += 8

    return number;
  }

  createMeshes = (): BABYLON.Mesh[] => {
    let meshes = [];

    let tileGround = BABYLON.MeshBuilder.CreateBox(
      `tileGround-${this.uid}`,
      { width: 4, depth: 4, height: 0.1 },
    );

    tileGround.material = new BABYLON.StandardMaterial('standardMaterial');

    const tileGroundMaterial = <BABYLON.StandardMaterial>tileGround.material;

    tileGroundMaterial.diffuseTexture = new BABYLON.Texture(
      'src/Assets/Maze/Textures/floor.png'
    );

    meshes.push(tileGround);

    let wallHorizontal = BABYLON.MeshBuilder.CreateBox(
      `tileWallHorizontal-${this.uid}`,
      { width: 4, depth: 0.1, height: 4 }
    );

    let wallVertical = BABYLON.MeshBuilder.CreateBox(
      `tileWallVertical-${this.uid}`,
      { width: 0.1, depth: 4, height: 4 }
    );

    [wallHorizontal, wallVertical].forEach((wall) => {
      wall.position.y += (2 - 0.05);
      wall.isVisible = false;

      wall.material = new BABYLON.StandardMaterial('standardMaterial');

      let wallMaterial = <BABYLON.StandardMaterial>wall.material;

      wallMaterial.diffuseTexture = new BABYLON.Texture(
        'src/Assets/Maze/Textures/wall.png'
      );
    });

    if(!this.exits.north) {
      let northWall = wallHorizontal.clone(`northWall-${this.uid}`);

      northWall.position.z += 2;
      meshes.push(northWall);
    };

    if(!this.exits.east) {
      let eastWall = wallVertical.clone(`eastWall-${this.uid}`);

      eastWall.position.x += 2;
      meshes.push(eastWall);
    };

    if(!this.exits.south) {
      let southWall = wallHorizontal.clone(`southWall-${this.uid}`);

      southWall.position.z -= 2;
      meshes.push(southWall);
    };

    if(!this.exits.west) {
      let westWall = wallVertical.clone(`westWall-${this.uid}`);

      westWall.position.x -= 2;
      meshes.push(westWall);
    };

    meshes.forEach((mesh) => {
      mesh.checkCollisions = true;
      mesh.isVisible = true;
      mesh.position.x = mesh.position.x + this.originX;
      mesh.position.z = mesh.position.z + this.originZ;
    });

    wallVertical.dispose();
    wallHorizontal.dispose();

    return meshes;
  }
}
