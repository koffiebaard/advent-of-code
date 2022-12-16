import { readFileSync } from 'fs';

type Coords = {
  x: number,
  y: number
}

const input = readFileSync(process.argv[2] ?? './input', 'utf-8')
  .split('\n')
  .filter(output => output !== '')
  .map(line => line.split(' -> ')
    .map(coords => coords
      .split(',')
      .map(coord => Number(coord))));

function map_cave_system(input: number[][][], challenge: number) {
  let highest_y = input.flat().reduce((y, coords) => coords[1] > y ? coords[1] : y, 0) + (Number(challenge === 2) * 2);
  let highest_x = 500 + highest_y;

  let grid: string[][] = Array.from({length: highest_y+1}, e => Array(highest_x+1).fill('.'));

  if (challenge === 2)
    grid[highest_y].fill('#');

input.map(coords => {
      coords.forEach((coord, index) => {
        if (coords[index+1] === undefined)
          return;

        let [start_x, start_y] = coord;
        let [target_x, target_y] = coords[index+1];

        // draw vertical
        if (start_x === target_x) {
          for (let y = Math.min(start_y, target_y); y <= Math.max(start_y, target_y); y++) {
            grid[y][target_x] = '#';
          }
        }
        // draw horizontal
        if (start_y === target_y) {
          for (let x = Math.min(start_x, target_x); x <= Math.max(start_x, target_x); x++) {
            grid[target_y][x] = '#';
          }
        }
      });
    });
  
  return grid;
}

function drop_sand_like_its_hot(grid: string[][], starting_position: Coords | null) {
  let sandies = 0;

  infinity:
  while (true) {
    let x: number = starting_position!.x;
    let y: number = starting_position!.y;
    starting_position = null;

    sand:
    while (true) {
      if (grid[y+1]?.[x] === undefined)
        break infinity;

      // Continue to fall
      if (grid[y+1][x] === '.') {
        y++;
        continue;
      }

      // Keep track of starting position
      if (starting_position === null) {
        starting_position = {y: y-1, x: x};
      }
      
      // Down left diagonal
      if (grid[y+1][x-1] === '.') {
        y++;
        x--;
        continue;
      }
      
      // Down right diagonal
      if (grid[y+1][x+1] === '.') {
        y++;
        x++;
        continue;
      }

      // Can't move, stay put
      grid[y][x] = 'O';
      sandies++;

      // To infinity, and beyond!
      if (y === 0)
        break infinity;

      // Or not
      break sand;
    }
  }

  return sandies;
}


// Challenge 1
let grid = map_cave_system(input, 1);
let sandies = drop_sand_like_its_hot(grid, {y: 0, x: 500});

// Challenge 2
let grid_2 = map_cave_system(input, 2);
let sandies_2 = drop_sand_like_its_hot(grid_2, {y: 0, x: 500});

// Fancy shizzle
let blue = '38;2;0;0;255';
let gray = '38;2;30;20;70';
let brown = '38;2;150;75;0';
let red = '38;2;255;0;0';
let green = '38;2;0;208;0';
let rs = `\x1b[${red}m`;
let gs = `\x1b[${green}m`;
let brs = `\x1b[${brown}m`;
let bs = `\x1b[${blue}m`;
let grs = `\x1b[${gray}m`;
let ws = `\x1b[97m`;
let e = `\x1b[0m`;

let lowest_x = input.flat().reduce((x, coords) => coords[0] < x ? coords[0] : x, Infinity);
let lowest_y = input.flat().reduce((y, coords) => coords[1] < y ? coords[1] : y, Infinity);
let highest_y = input.flat().reduce((y, coords) => coords[1] > y ? coords[1] : y, 0);
let highest_x = input.flat().reduce((x, coords) => coords[0] > x ? coords[0] : x, 0);

let padding = ' '.repeat(500-(lowest_x-7)-13);

let pad_center = (line: string, count: number) => line.padStart(line.length / 2 + (count / 2), ' ').padEnd(count, ' ');
let sandies_challenge1 = pad_center(sandies.toString(), 4);
let sandies_challenge2 = pad_center(sandies_2.toString(), 5);

console.log(`${padding}${ws}     _o_    
${padding} ,-.'---\`.__
${padding}((j\`=====',-'${bs}o${ws}
${padding} \`-\\     /   ${bs}◒${ws}
${padding}    \`-=-'    ${bs}◒${e}`);

for (let y = lowest_y-2; y <= highest_y; y++) {
  for (let x = lowest_x-7; x <= highest_x+2; x++) {
    process.stdout.write(
      grid[y][x]
        .replace('O', `${bs}◒${e}`)
        .replace('.', `${grs}\u00B7${e}`)
        .replace('#', `${brs}⬔${e}`)
    );
  }
  process.stdout.write(`\n`);
}

console.log(`
${grs}    (    
   )  )  ${ws}
${rs} :------:${ws}         o0o0o
${rs}C|======|${ws}     ${rs}._${ws}o0o00o0oo${rs}_.
${rs} | ${gs}${sandies_challenge1}${rs} |      \\= ${gs}${sandies_challenge2}${rs} =/
 \`------'       \`-------'${e}`);
