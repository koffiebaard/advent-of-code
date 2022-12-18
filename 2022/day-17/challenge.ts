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

var blocks = generate_blocks();
var air_flow = generate_air_flow();
const grid: string[][] = [
  Array(7).fill('.', 0, 7),
  Array(7).fill('.', 0, 7),
  Array(7).fill('.', 0, 7),
  Array(7).fill('.', 0, 7),
  Array(7).fill('-', 0, 7)
];

function* generate_blocks() {
  yield* ['hor_bar', 'plus', 'l', 'ver_bar', 'block'];
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
  let block_type: {[key: string]: string} = {
    'hor_bar': '#',
    'plus': '+',
    'l': '@',
    'ver_bar': '=',
    'block': '%',
  }

  block_shapes[block].map(([bx, by]) => {
    grid[coords.y+by][coords.x+bx] = block_type[block];
  });


  // let ys = block_shapes[block].reduce((height: number[], [bx, by]) => {
  //   if (!height.includes(by))
  //     height.push(by);

  //   return height;
  // }, []);
  // console.log(`${block} is ${ys.length} high`);
  
  // grid.unshift(...Array(ys.length+4).fill(Array(7).fill('.', 0, 7).slice(), 0, ys.length+4));


  if (get_starting_coords().y < 4) {
    grid.unshift(
      Array(7).fill('.', 0, 7),
      Array(7).fill('.', 0, 7),
      Array(7).fill('.', 0, 7),
      Array(7).fill('.', 0, 7)
    );
  }
}

function draw_grid() {
  let gray = '38;2;30;20;70';
  let grs = `\x1b[${gray}m`;
  let e = `\x1b[0m`;

  process.stdout.write(`${grs}`);

  let drawn_lines = 0;

  for (let y = 0; y < grid.length; y++) {

    if (grid[y].every(block => block === '.'))
      continue

    for (let x = 0; x < 7; x++) {
      process.stdout.write(
        grid[y][x]
          .replace('#', `🟦`)
          .replace('@', `🟧`)
          .replace('=', `🟪`)
          .replace('%', `🟨`)
          .replace('+', `🟩`)
          .replace('.', `➖`)
      );
    }
    process.stdout.write(`\n`);
    drawn_lines++;
    
    if (show_animation && drawn_lines > 15)
      break;
  }

  process.stdout.write(`${e}`);
}

async function solve() {
  for (let i = 0; i < 2022; i++) {
    let block = get_block();
    let coords = get_starting_coords(block);

    if (show_animation) {
      await new Promise(resolve => setTimeout(resolve, 300));
      process.stdout.write('\x1Bc');
      draw_grid();
    } else {
      // console.log(i, grid.length - get_highest_point() - 1);
    }

    while ('falling') {
      // First the air flow, then moving down
      let direction = get_air_flow_direction();

      // left or right
      let move = direction === '<' ? -1 : +1;

      let collision_sideways = detect_collision(block, coords.x + move, coords.y);

      if (collision_sideways === Collision.None)
        coords.x += move;

      // move down
      let collision_down = detect_collision(block, coords.x, coords.y + 1);

      if (collision_down === Collision.None)
        coords.y++;

      // We're done. Pack it up boys.
      if (collision_down === Collision.Bottom) {
        draw_block(block, coords);
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
  console.log(`\n    🟨🟨
🟪  🟨🟨
🟪 ${rs}${answer}${e} 🟩🟩
🟪🟪  🟩🟩`);
}
