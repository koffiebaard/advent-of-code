import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

type Rope = Coords[];

type Direction = 'R' | 'L' | 'U' | 'D';

type Movement = {
  direction: Direction
  steps: number
}

type Coords = {
  x: number,
  y: number
}

function distance(from: Coords, to: Coords): Coords {
  return { x: to.x - from.x, y: to.y - from.y, };
}

function move_head(coords: Coords, direction: Direction): Coords {
  if (direction === 'R')
    return { ...coords, x: coords.x + 1 };
  if (direction === 'L')
    return { ...coords, x: coords.x - 1 };
  if (direction === 'U')
    return { ...coords, y: coords.y + 1 };
  if (direction === 'D')
    return { ...coords, y: coords.y - 1 };

  throw 'Well shit.';
}

function move_tail(tail: Coords, tail_in_front: Coords): Coords {
  const diff = distance(tail, tail_in_front);

  // stand still
  if (diff.x >= -1 && diff.x <= 1 && diff.y >= -1 && diff.y <= 1)
    return { x: tail.x, y: tail.y };

  // move right
  if (diff.x === 2 && diff.y >= -1 && diff.y <= 1)
    return { x: tail.x + 1, y: tail.y + diff.y }

  // move left
  if (diff.x === -2 && diff.y >= -1 && diff.y <= 1)
    return { x: tail.x - 1, y: tail.y + diff.y }

  // move up
  if (diff.y === 2 && diff.x >= -1 && diff.x <= 1)
    return { x: tail.x + diff.x, y: tail.y + 1 }
  
  // move down
  if (diff.y === -2 && diff.x >= -1 && diff.x <= 1)
    return { x: tail.x + diff.x, y: tail.y - 1 }

  // move diagonal for corners
  if (diff.x === 2 && diff.y === 2) 
    return { x: tail.x + 1, y: tail.y + 1 }

  if (diff.x === 2 && diff.y === -2) 
    return { x: tail.x + 1, y: tail.y - 1 }

  if (diff.x === -2 && diff.y === -2) 
    return { x: tail.x - 1, y: tail.y - 1 }

  if (diff.x === -2 && diff.y === 2) 
    return { x: tail.x - 1, y: tail.y + 1 }

  throw 'Well shit.';
}

let tail_positions: number[] = [];

[2, 10].map(amount_of_rope => {
  let rope: Rope = (Array(amount_of_rope).fill({ x: 0, y: 0 }, 0, amount_of_rope) as Rope);

  let tail_coords_1 = new Map<string, boolean>();
  let tail_coords_2 = new Map<string, boolean>();

  input
    .split('\n')
    .filter(output => output !== '')
    .map((move): Movement => ({
      direction: move.split(' ')[0] as Direction,
      steps: parseInt(move.split(' ')[1])
    }))
    .map((movement, index) => {
      for (let step = 0; step < movement.steps; step++) {
        rope[0] = move_head(rope[0], movement.direction);

        for (let tail = 1; tail < rope.length; tail++) {
          rope[tail] = move_tail(rope[tail], rope[tail-1]);
        }

        (index < 980000 ? tail_coords_1 : tail_coords_2).set(`${rope.slice(-1)[0].x} ${rope.slice(-1)[0].y}`, true);
      }
      // console.log(tail_coords_1.size, tail_coords_2.size);
    })

  let tail_position = tail_coords_1.size;

  for (const key of tail_coords_2.keys()) {
    if (!tail_coords_1.has(key))
      tail_position++;
  }

  tail_positions.push(tail_position);
});

console.log(tail_positions);
