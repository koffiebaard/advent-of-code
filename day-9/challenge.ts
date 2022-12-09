import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

type Rope = [ Coords ];

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

[2, 10].map(amount_of_rope => {
  let rope: Rope = (Array(amount_of_rope).fill({ x: 0, y: 0 }, 0, amount_of_rope) as Rope);
  let tail_coords = new Set([JSON.stringify(rope.slice(-1)[0])]);

  input
    .split('\n')
    .filter(output => output !== '')
    .map((move): Movement => ({
      direction: move.split(' ')[0] as Direction,
      steps: parseInt(move.split(' ')[1])
    }))
    .map((movement) => {
      for (let step = 0; step < movement.steps; step++) {
        rope[0] = move_head(rope[0], movement.direction);

        for (let tail = 1; tail < rope.length; tail++) {
          rope[tail] = move_tail(rope[tail], rope[tail-1]);
        }

        tail_coords.add(JSON.stringify(rope.slice(-1)[0]));
      }
  })

  console.log(tail_coords.size);
});
