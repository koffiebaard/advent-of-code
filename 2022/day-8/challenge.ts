import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let grid: string[][] = input.split('\n').filter(output => output !== '').map((treeline) => treeline.split(''));

let visible_trees = 0, highest_score = 0;

grid.map((x, index_x) => {
  x.map((y, index_y) => {
    let left = x
      .slice(0, index_y)
      .reverse()
      .reduce((windex: number, tree, index) => tree >= y && !windex ? index+1 : windex, 0);
    let right = x
      .slice(index_y+1)
      .reduce((windex: number, tree, index) => tree >= y && !windex ? index+1 : windex, 0);
    let top = grid
      .slice(0, index_x)
      .reverse()
      .reduce((windex: number, treeline, index) => treeline[index_y] >= y && !windex ? index+1 : windex, 0);
    let bottom = grid
      .slice(index_x+1)
      .reduce((windex: number, treeline, index) => treeline[index_y] >= y && !windex ? index+1 : windex, 0);

    if (Math.min(top, left, bottom, right) === 0)
      visible_trees++;

    left = left !== 0 ? left : x.slice(0, index_y).length;
    right = right !== 0 ? right : x.slice(index_y+1).length;
    top = top !== 0 ? top : grid.slice(0, index_x).length;
    bottom = bottom !== 0 ? bottom : grid.slice(index_x+1).length;

    let score = top * left * bottom * right;

    if (score > highest_score)
      highest_score = score;
  });
});

console.log(visible_trees);
console.log(highest_score);
