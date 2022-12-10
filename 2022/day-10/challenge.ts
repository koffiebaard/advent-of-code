import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let cycles = 0;
let x = 1;
var signal_strength_sum = 0;
var position = 0;
var colors = [
   '38;2;255;0;0' // rid
  ,'38;2;255;165;0' // urrange
  ,'38;2;255;255;0' // yellah
  ,'38;2;0;208;0' // lit grin
  ,'38;2;0;158;0' // grin
  ,'38;2;0;0;255' // bluh
  ,'38;2;95;0;150' // purpl
  ,'38;2;255;145;255' // pnk
];

function write_to_screen(lit_pixel: boolean, position: number) {
  let color = colors[Math.floor((position+1) / 5)];

  if (lit_pixel)
    process.stdout.write(`\x1b[${color}m⬔\x1b[0m`);
  else
    process.stdout.write(`\x1b[8;1m⬔\x1b[0m`);
  
  if (position !== 0 && (position+1) % 5 === 0)
    process.stdout.write(`\x1b[8;1m⬔⬔\x1b[0m`);
}

function write_signal_strength(cycles: number, x: number) {
  if (cycles === 20 || (cycles-20) % 40 === 0)
    signal_strength_sum += cycles * x;
}

function draw_pixel(x: number) {
  let sprite_start = x - 1, sprite_end = x + 1;

  write_to_screen(position >= sprite_start && position <= sprite_end, position);

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

console.log('\n');
console.log(signal_strength_sum);
