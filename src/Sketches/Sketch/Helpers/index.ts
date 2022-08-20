import * as BABYLON from '@babylonjs/core';
import Sketch from '..';


export const buildAssetName = (id: string, type: string, position: BABYLON.Vector3): string => {
  return (
    id.toLowerCase()
    + type.charAt(0).toUpperCase()
    + type.slice(1).toLowerCase()
    + '-'
    + [position.x, position.y, position.z].join('_')
  )
};

export const clonedMesh = (
  original: BABYLON.Mesh,
  id: string,
  position: BABYLON.Vector3,
  visible: boolean
): BABYLON.Mesh => {
  let clone = original.clone(buildAssetName(id, 'mesh', position));

  clone.position = position;
  clone.isVisible = visible;

  return clone;
};

export const findMeshByName = (name: string, sketchClass: Sketch): BABYLON.Mesh => {
  let sketch = sketchClass ? sketchClass : this;

  return sketch.meshes.find(mesh => mesh.name === name);
};

export const hideMesh = (mesh: BABYLON.Mesh): void => { mesh.isVisible = false };

export const meshExists = (position: BABYLON.Vector3, sketchClass?: Sketch): boolean => {
  let sketch = sketchClass ? sketchClass : this;

  return sketch.meshes.some(mesh => mesh.position.equals(position));
}
export const modIncrement = (num: number, mod: number, inc: number = 1) => {
  return (num + inc) % mod;
}

export const showMesh = (mesh: BABYLON.Mesh): void => { mesh.isVisible = true };

export const toggleMeshVisibility = (mesh: BABYLON.Mesh): void => { mesh.isVisible = !mesh.isVisible };
