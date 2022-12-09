import { readFileSync } from 'fs';

// const input = readFileSync('./input', 'utf-8');
const input = readFileSync('./aoc_2022_day05_large_input.txt', 'utf-8');
let stacks: string[][] = [];

input.split(/\n\n/)[0]
  .split(/\n/)
  .filter(line => line !== '' && line.trim().substring(0, 1) === '[' )
  .map(line => {
    line.slice(1).split('').reduce((stacks: string[][], crate, i) => {
      if (i % 4 === 0 && crate !== ' ') {
        stacks[i / 4] = stacks[i / 4] || [];
        stacks[i / 4].push(crate);
      }
      return stacks;
    }, stacks);
  });

let stacks_2: string[][] = JSON.parse(JSON.stringify(stacks));

input.split(/\n\n/)[1]
  .split(/\n/)
  .filter(line => line !== '')
  .map(line => {
    let [amount, from, to] = (line.match(/\d+/g) || []).map(move => parseInt(move));

    // Challenge 1
    let crates = stacks[from-1].splice(0, amount);
    stacks[to-1] = crates.reverse().concat(stacks[to-1]);

    // Challenge 2
    crates = stacks_2[from-1].splice(0, amount);
    stacks_2[to-1] = crates.concat(stacks_2[to-1]);
  });

console.log(stacks.map(stack => stack[0]).join(''));
console.log(stacks_2.map(stack => stack[0]).join(''));
