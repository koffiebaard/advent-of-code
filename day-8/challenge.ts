import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let grid: string[][] = [];
let visible_trees = 0;
let highest_score = 0;

input.split('\n').filter(output => output !== '').forEach((treeline) => {
  grid.push(treeline.split(''));
});

grid.map((x, index_x) => {
  x.map((y, index_y) => {

    let left = x.slice(0, index_y).reverse().reduce((winning_index: number, tree, index) => tree >= y && !winning_index ? index+1 : winning_index, 0);
    let right = x.slice(index_y+1).reduce((winning_index: number, tree, index) => tree >= y && !winning_index ? index+1 : winning_index, 0);

    let top = grid.slice(0, index_x).reverse().reduce((winning_index: number, treeline, index) => treeline[index_y] >= y && !winning_index ? index+1 : winning_index, 0);
    let bottom = grid.slice(index_x+1).reduce((winning_index: number, treeline, index) => treeline[index_y] >= y && !winning_index ? index+1 : winning_index, 0);

    if (Math.min(top, left, bottom, right) === 0) {
      visible_trees++;
    }

    left = left !== 0 ? left : x.slice(0, index_y).length;
    right = right !== 0 ? right : x.slice(index_y+1).length;
    top = top !== 0 ? top : grid.slice(0, index_x).length;
    bottom = bottom !== 0 ? bottom : grid.slice(index_x+1).length;

    let score = top * left * bottom * right;

    if (score > highest_score) {
      highest_score = score;
    }
  });
});

console.log(visible_trees);
console.log(highest_score);
