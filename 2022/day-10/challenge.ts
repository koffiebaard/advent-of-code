import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let cycles = 0;
let x = 1;
var signal_strengths: {[key: number]: number} = {};
var position = 0;

function write_signal_strength(cycles: number) {
  if (cycles === 20 || (cycles-20) % 40 === 0)
      signal_strengths[cycles] = x;
}

function draw_pixel(cycles: number, x: number) {
  let sprite_start = x - 2, sprite_end = x;

  if (position >= sprite_start && position <= sprite_end)
    process.stdout.write('#');
  else
    process.stdout.write('.');

  position++;

  if (cycles % 40 === 0) {
    position = 0;
    process.stdout.write('\n');
  }
}

input
  .split('\n')
  .filter(output => output !== '')
  .map(instruction => {
    cycles++;

    write_signal_strength(cycles);
    draw_pixel(cycles, x); 

    if (instruction === 'noop')
      return;

    cycles++;
   
    write_signal_strength(cycles);

    let addx = Number(instruction.split(' ')[1]);
    x += addx;

    draw_pixel(cycles, x);
  });

let sum_signal_strengths = Object.keys(signal_strengths).reduce((total, value) => {
  return total + Number(value) * signal_strengths[Number(value)];
}, 0);

console.log(sum_signal_strengths);
