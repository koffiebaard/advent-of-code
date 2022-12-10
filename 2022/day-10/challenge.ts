import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let cycles = 0;
let x = 1;
var signal_strength_sum = 0;
var position = 0;

function write_signal_strength(cycles: number, x: number) {
  if (cycles === 20 || (cycles-20) % 40 === 0)
    signal_strength_sum += cycles * x;
}

function draw_pixel(x: number) {
  let sprite_start = x - 1, sprite_end = x + 1;

  if (position >= sprite_start && position <= sprite_end)
    process.stdout.write('#');
  else
    process.stdout.write('.');

  position++;

  if (position === 40) {
    position = 0;
    process.stdout.write('\n');
  }
}

input
  .split('\n')
  .filter(output => output !== '')
  .map(instruction => {
    cycles++;
    write_signal_strength(cycles, x);
    draw_pixel(x); 

    if (instruction === 'noop')
      return;

    cycles++;
    write_signal_strength(cycles, x);
    draw_pixel(x);

    let addx = Number(instruction.split(' ')[1]);
    x += addx;
  });

console.log(signal_strength_sum);
