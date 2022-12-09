import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');
let stacks: string[] = [];

input.split(/\n\n/)[0]
  .split(/\n/)
  .filter(line => line !== '' && line.trim().substring(0, 1) === '[' )
  .map(line => {
    line.slice(1).split('').reduce((stacks: string[], crate, i) => {
      if (i % 4 === 0 && crate !== ' ') {
        stacks[i / 4] = stacks[i / 4] || '';
        stacks[i / 4] = stacks[i / 4].concat(crate);
      }
      return stacks;
    }, stacks);
  });

let stacks_2: string[] = JSON.parse(JSON.stringify(stacks));

input
  .split(/\n\n/)[1]
  .split(/\n/)
  .filter(line => line !== '')
  .forEach(async (line, index) => {
  let [amount, from, to] = (line.match(/\d+/g) || []).map(move => parseInt(move));

  // Challenge 1
  stacks[to-1] = [stacks[from-1].slice(0, amount).split('').reduce((reversed, character) => character + reversed, ''), stacks[to-1]].join('');
  stacks[from-1] = stacks[from-1].slice(amount);

  // Challenge 2
  stacks_2[to-1] = [stacks_2[from-1].slice(0, amount), stacks_2[to-1]].join('');
  stacks_2[from-1] = stacks_2[from-1].slice(amount);

  index % 10000 === 0 && process.stdout.write('.');
});

console.log(stacks.map(stack => stack[0]).join(''));
console.log(stacks_2.map(stack => stack[0]).join(''));
