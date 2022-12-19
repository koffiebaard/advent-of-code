import { readFileSync } from 'fs';

enum Collision {
  Side = 'Side',
  Bottom = 'Bottom',
  None = 'None',
  OutOfBounds = 'OutOfBounds'
}

type Coords = {
  x: number,
  y: number
}

const show_animation = process.argv[3] ? true : false;

const air_flow_directions = readFileSync(process.argv[2] ?? './input', 'utf-8')
  .split('\n')
  .filter(output => output !== '')[0].split('');

let block_shapes: {[key: string]: number[][]} = {
  hor_bar: [ [0, 0], [1,0], [2,0], [3,0] ],
  plus: [ [0,0], [1,0], [1,1], [1,-1], [2,0] ],
  l: [ [0,0], [1,0], [2,0], [2,-1], [2,-2] ],
  ver_bar: [ [0,0], [0,-1], [0,-2], [0,-3] ],
  block: [ [0,0], [1,0], [0,-1], [1,-1] ],
};

const block_types = ['hor_bar', 'plus', 'l', 'ver_bar', 'block'];
let block_draw_shapes: {[key: string]: string} = {
  'hor_bar': '#',
  'plus': '+',
  'l': '@',
  'ver_bar': '=',
  'block': '%',
}

const draw_fancy_block = (ascii_block: string) => ascii_block
  .replace('#', `🟦`)
  .replace('@', `🟧`)
  .replace('=', `🟪`)
  .replace('%', `🟥`) // previously 🟨
  .replace('+', `🟩`)
  .replace('.', `  `) // previously ➖
  .replace('-', `🟫`);

var blocks = generate_blocks();
var air_flow = generate_air_flow();

const grid: string[][] = Array.from({length: 14}, e => Array(7).fill('.', 0, 7));
grid.push(Array(7).fill('-', 0, 7));

function* generate_blocks() {
  yield* block_types;
}

function get_block(): string {
  let block = blocks.next();

  if (block.done) {
    blocks = generate_blocks();
    block = blocks.next();
  }

  if (block.done) {
    throw 'Well, shit.';
  }

  return block.value;
}

function* generate_air_flow() {
  yield* air_flow_directions;
}

function get_air_flow_direction() {
  let direction = air_flow.next();

  if (direction.done) {
    air_flow = generate_air_flow();
    direction = air_flow.next();
  }

  if (direction.done) {
    throw 'Well, shit.';
  }

  return direction.value;
}

function free(x: number, y: number): boolean {
  // out of bounds
  if (x < 0 || x > 6 || y < 0 || y >= grid.length)
    return false;

  // grid can either be air or non existent
  if (grid[y][x] !== '.')
    return false;

  return true;
}

function detect_collision(block_type: string, x: number, y: number): Collision {
  // out of bounds
  if (x < 0 || x > 6 || y < 0 || y >= grid.length)
    return Collision.OutOfBounds;

  // Check every y+1 to check if we match on the bottom
  let bottom_blocks = block_shapes[block_type].reduce((bottom: number[][], [bx, by]) => {
    if (by >= block_shapes[block_type][0][1]) {
      bottom.push([bx, by]);
    }

    return bottom;
  }, []);

  if (bottom_blocks.some(([bx, by]) => !free(x+bx, y+by)))
    return Collision.Bottom;

  if (block_shapes[block_type].some(([bx, by]) => !free(x+bx, y+by)))
    return Collision.Side;

  return Collision.None;
}

function get_highest_point(): number {
  let highest_point = grid.reduce((highest_point: number | null, row, index) => {
    if (!row.every(block => block === '.') && highest_point === null) {
      return index;
    }
    return highest_point;
  }, null);

  if (highest_point === null)
    throw 'Well, shit.';

  return highest_point;
}

function get_starting_coords(block_type: string = ''): Coords {
  let highest_point = get_highest_point();

  return {
    x: 2,
    y: highest_point - 4 - (block_type === 'plus' ? 1 : 0)
  };
}

function draw_block(block: string, coords: Coords) {

  block_shapes[block].map(([bx, by]) => {
    grid[coords.y+by][coords.x+bx] = block_draw_shapes[block];
  });

  // more fancy height calculation for showing the animation
  if (show_animation && get_highest_point() < 6) {
    let compensate_height = 6 - get_highest_point();
    grid.unshift(...Array.from({length: compensate_height}, e => Array(7).fill('.')));
  }

  if (!show_animation && get_starting_coords().y < 4) {
    grid.unshift(
      Array(7).fill('.', 0, 7),
      Array(7).fill('.', 0, 7),
      Array(7).fill('.', 0, 7),
      Array(7).fill('.', 0, 7)
    );
  }
}

function draw_grid(draw_block?: string, draw_block_coords?: Coords, nth_block?: number) {
  // Map temporary drawing coords so we can easily find them later
  let temporary_draw_coords: string[] = (draw_block && draw_block_coords) ? block_shapes[draw_block].map(([bx, by]) => {
    return `${draw_block_coords.y+by}:${draw_block_coords.x+bx}`;
  }) : [];

  for (let y = 0; y < grid.length; y++) {
    let line = '';
    for (let x = 0; x < 7; x++) {
      if (draw_block && temporary_draw_coords && temporary_draw_coords.includes(`${y}:${x}`)) {
        line += draw_fancy_block(block_draw_shapes[draw_block]);
      } else {
        line += draw_fancy_block(grid[y][x]);
      }
    }

    let left_wall = y > 3 && y < 11 ? `🟫`.repeat(2).concat(y === 7 ? String(nth_block).padStart(7).padEnd(12) : '  '.repeat(6)).concat('🟫'.repeat(2)) : `🟫`.repeat(10);
    // let right_wall = `🟫`.repeat(10);

    let index = block_types.findIndex(block => block === draw_block);
    let next_block = block_types[index+1] !== undefined ? block_types[index+1] : block_types[0];

    let right_wall = y > 3 && y < 11 ? `🟫`.repeat(2).concat(y === 6 ? String('').padStart(7).padEnd(12) : '  '.repeat(6)).concat('🟫'.repeat(2)) : `🟫`.repeat(10);
    block_shapes[next_block].map(([bx, by]) => {
      if (y === 8+by)
        right_wall = right_wall.substring(0, 7+(bx*2)) + draw_fancy_block(block_draw_shapes[next_block]) + right_wall.substring(7+(bx*2) + 2);
    });
    process.stdout.write(`${left_wall}${line}${right_wall}\n`);

    if (show_animation && y > 15)
      break;
  }
}

async function draw_animated_grid(nth_block: number, block?: string, coords?: Coords) {
  await new Promise(resolve => setTimeout(resolve, 40));
  process.stdout.write('\x1Bc');
  draw_grid(block, coords, nth_block);
}

async function solve() {
  for (let i = 0; i < 2022; i++) {
    let block = get_block();
    let coords = get_starting_coords(block);

    while ('falling') {
      if (show_animation)
        await draw_animated_grid(i+1, block, coords);

      // First the air flow, then moving down
      let direction = get_air_flow_direction();

      // left or right
      let move = direction === '<' ? -1 : +1;

      let collision_sideways = detect_collision(block, coords.x + move, coords.y);

      if (collision_sideways === Collision.None) {
        coords.x += move;
        if (show_animation)
          await draw_animated_grid(i+1, block, coords);
      }

      // move down
      let collision_down = detect_collision(block, coords.x, coords.y + 1);

      if (collision_down === Collision.None) {
        coords.y++;
        if (show_animation)
          await draw_animated_grid(i+1, block, coords);
      }

      // We're done. Pack it up boys.
      if (collision_down === Collision.Bottom) {
        draw_block(block, coords);
        if (show_animation)
          await draw_animated_grid(i+1);
        break;
      }
    }
  };
}

solve();

if (!show_animation) {
  draw_grid();

  let red = '38;2;255;0;0';

  let rs = `\x1b[${red}m`;
  let e = `\x1b[0m`;
  let answer = grid.length - get_highest_point() - 1;

  let wall = `🟫`.repeat(10);
  console.log(`\n${wall}    🟨🟨      ${wall}
${wall}🟪  🟨🟨      ${wall}
${wall}🟪 ${rs}${answer}${e} 🟩🟩  ${wall}
${wall}🟪🟪  🟩🟩    ${wall}`);
}
