import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

type Coords = {
  x: number,
  y: number
}

let slopes: Coords[] = [
  { y: 1, x: 1 },
  { y: 1, x: 3 },
  { y: 1, x: 5 },
  { y: 1, x: 7 },
  { y: 2, x: 1 },
];

let tree_totals: number[] = [];

let grid = input
    .split('\n')
    .filter(output => output !== '')
    .map(line => line.split(''));

slopes.map(slope => {
  let x = slope.x;
  let trees = 0;

  for (let y = 0; y < grid.length; y += slope.y) {
    if (x >= grid[y].length) {
      x -= grid[y].length;
    }

    if (y+slope.y in grid && grid[y+slope.y][x] === '#') {
      trees++;
    }

    x += slope.x;
  };

  tree_totals.push(trees);
});

console.log(tree_totals[1]);
console.log(tree_totals.reduce((total, trees) => total * trees));
