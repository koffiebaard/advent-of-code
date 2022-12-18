import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let grid: number[][][] = Array.from({length: 25}, e => Array.from({length: 25}, e => Array(25).fill(-1)));


input
  .split('\n')
  .filter(output => output !== '')
  .map(line => line.split(',').map(coord => Number(coord)))
  .map(cube => {
    let [x, y, z] = cube;
    console.log(x, y, z);
    grid[z][y][x] = 6;
  });


grid.map((planes, z) => {
  planes.map((rows, y) => {
    rows.map((value, x) => {
      if (grid[z][y][x] === -1)
        return;

      // left
      if (grid[z][y][x-1] !== undefined && grid[z][y][x-1] !== -1) {
        grid[z][y][x]--;
      }

      // right
      if (grid[z][y][x+1] !== undefined && grid[z][y][x+1] !== -1) {
        grid[z][y][x]--;
      }

      // up
      if (grid[z][y-1]?.[x] !== undefined && grid[z][y-1]?.[x] !== -1) {
        grid[z][y][x]--;
      }

      // down
      if (grid[z][y+1]?.[x] !== undefined && grid[z][y+1]?.[x] !== -1) {
        grid[z][y][x]--;
      }

      if (grid[z][y][x] < 0)
        grid[z][y][x] = 0;
    });
  });
})

grid.map((planes, z) => {
  planes.map((rows, y) => {
    rows.map((value, x) => {
      if (grid[z][y][x] === -1)
        return;

      if (grid[z-1]?.[y][x] !== undefined && grid[z-1][y][x] !== -1) {
        console.log('yesSSSSsss', grid[z][y][x], grid[z-1][y][x] - 1);
        grid[z][y][x]--;
      }

      if (grid[z+1]?.[y][x] !== undefined && grid[z+1][y][x] !== -1) {
        console.log('yesSSSSsss', grid[z][y][x], grid[z+1][y][x] - 1);
        grid[z][y][x]--;
      }

      if (grid[z][y][x] < 0)
        grid[z][y][x] = 0;
    });
  });
})

const sum = (value: number[]) => value.reduce((partialSum, a) => a > 0 ? partialSum + a : partialSum, 0);


console.log(grid.reduce((total_z, z) => total_z + z.reduce((total_y, y) => total_y + sum(y), 0), 0));
