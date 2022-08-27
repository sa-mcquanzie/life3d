import { Cell } from '../Types';


export const sample = (arr: Cell[]): Cell => {
  return arr[Math.floor((Math.random() * arr.length))];
};

export const generateMaze = (size: number): Cell[] => {
  let start = -(Math.floor(size / 2));
  let finish = Math.floor(size / 2);
  let c = [];

  for(let z = start; z <= finish; z+=4) {
    for(let x = start; x <= finish; x+=4) {
      c.push({
        x: x,
        z: z,
        exits: { north: false, east: false, south: false, west: false },
        visited: false
      } as Cell);
    }
  }

  let cells = c as Cell[];

  cells.forEach((cell) => {
    cell.neighbours = cells.filter((c) => {
      return (
        (c.x === cell.x + 4 && c.z === cell.z) ||
        (c.x === cell.x - 4 && c.z === cell.z) ||
        (c.x === cell.x && c.z === cell.z + 4) ||
        (c.x === cell.x && c.z === cell.z - 4)
      );
    }).filter(c => c)
  });

  let currentCell = sample(cells);
  const lastCell = [currentCell];
  const maze = [currentCell];

  currentCell.visited = true;

  while(cells.filter(c => c.visited).length > 0) {
    if(lastCell.length === 0) break;

    let neighbours = currentCell.neighbours.filter(n => !n.visited)

    if(neighbours.length === 0) {
      currentCell = lastCell.pop();
    } else {
      let nextCell = sample(neighbours);

      if(nextCell.z === currentCell.z + 4) {
        currentCell.exits.north = true;
        nextCell.exits.south = true
      }

      if(nextCell.x === currentCell.x + 4) {
        currentCell.exits.east = true;
        nextCell.exits.west = true;
      }

      if(nextCell.z === currentCell.z - 4) {
        currentCell.exits.south = true;
        nextCell.exits.north = true;
      }

      if(nextCell.x === currentCell.x - 4) {
        currentCell.exits.west = true;
        nextCell.exits.east = true;
      }

      maze.push(nextCell);
      lastCell.push(nextCell);
      currentCell = nextCell;
      nextCell.visited = true;
    };
  }

  return maze;
};
