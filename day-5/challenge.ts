import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');
let stacks: string[][] = [];

input.split(/\n\n/)[0]
  .split(/\n/)
  .filter(line => line !== '' && line.trim().substring(0, 1) === '[' )
  .map(line => {
    let stack_number = 0;
    for (let i = 1; i < line.length; i = i + 4) {
      let block = line.substring(i, i + 1);
      
      if (stacks[stack_number] === undefined)
          stacks[stack_number] = [];

      if (block.trim() !== '') {
        stacks[stack_number].push(block);
      }

      stack_number++;
    }
  });

let stacks_2: string[][] = JSON.parse(JSON.stringify(stacks));

input.split(/\n\n/)[1]
  .split(/\n/)
  .filter(line => line !== '')
  .map(line => {
    let move = line
      .replace(/move ([0-9]+) from ([0-9]+) to ([0-9]+)/, '$1 $2 $3')
      .split(' ')
      .map(item => parseInt(item));
    
    let amount = move[0];
    let from = move[1];
    let to = move[2];

    // Challenge 1
    for (let i = 0; i < amount; i++) {
      let crate = stacks[from-1].shift();
      stacks[to-1].unshift(String(crate));
    }

    // Challenge 2
    let crates = stacks_2[from-1].slice(0, amount);
    stacks_2[from-1] = stacks_2[from-1].slice(amount);
    
    while (crates.length > 0) {
      stacks_2[to-1].unshift(String(crates.pop()));
    }
  });

console.log(stacks.map(stack => stack[0]).join(''));
console.log(stacks_2.map(stack => stack[0]).join(''));
