import { readFileSync } from 'fs';

type Coords = {
  x: number,
  y: number
}

enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

type Blizzard = {
  direction: Direction,
  coords: Coords
}

type Grid = string[][];

type Queue = {
  minute: number,
  location: Coords,
  path: string[]
}

function build_grid() {
  const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

  return input
    .split('\n')
    .filter(output => output !== '')
    .map(line => line.split(''));
}

function starting_point(grid: Grid): Coords {
  return {y: -1, x: grid[0].findIndex(x => x === '.')-1};
}

function finish_line(grid: Grid): Coords {
  return {y: grid.length-3, x: grid[grid.length-1].findIndex(x => x === '.')-1};
}

function build_blizzards(grid: Grid): Blizzard[] {
  let blizzards: Blizzard[] = [];

  grid.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col !== '#' && col !== '.') {
        let direction = col === '^' ? Direction.Up : col === 'v' ? Direction.Down : col === '<' ? Direction.Left : Direction.Right

        blizzards.push({
          coords: {y: y-1, x: x-1},
          direction,
        });
      }
    });
  });

  return blizzards;
}

function calculate_index(index: number, number: number, size: number, forward: boolean = true): number {
  let target = number % size;

  if (target < 0)
    target = size + target;

  return (index + target) % size;
}

function blizzards_at_minute(width: number, height: number, blizzards: Blizzard[], minute: number) {
  blizzards = JSON.parse(JSON.stringify(blizzards));

  blizzards.forEach(blizzard => {
    if (blizzard.direction === Direction.Up)
      blizzard.coords.y = calculate_index(blizzard.coords.y, -minute, height);
    if (blizzard.direction === Direction.Down)
      blizzard.coords.y = calculate_index(blizzard.coords.y, minute, height);

    if (blizzard.direction === Direction.Left)
      blizzard.coords.x = calculate_index(blizzard.coords.x, -minute, width);
    if (blizzard.direction === Direction.Right)
      blizzard.coords.x = calculate_index(blizzard.coords.x, minute, width);
  });

  return blizzards;
}

function draw_grid(grid: Grid, blizzards: Blizzard[]) {
  let directions = {
    [Direction.Up]: '^',
    [Direction.Down]: 'v',
    [Direction.Left]: '<',
    [Direction.Right]: '>',
  }
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      let blizz = blizzards.find(blizzard => blizzard.coords.x === x && blizzard.coords.y === y);
      let count = blizzards.filter(blizzard => blizzard.coords.x === x && blizzard.coords.y === y).length;
      if (count > 1)
        process.stdout.write(`${count}`);
      else if (blizz)
        process.stdout.write(directions[blizz.direction]);
      else
        process.stdout.write('.');
    }
    process.stdout.write('\n');
  }
}

function free_moves(location: Coords, width: number, height: number, blizzards: Blizzard[]) {
  let moves: Coords[] = [
    {x:  0,  y: -1},
    {x:  0,  y:  1},
    {x:  1,  y:  0},
    {x: -1,  y:  0},
    {x:  0,  y:  0},
  ];

  return moves.filter(move => {
    let x = location.x + move.x;
    let y = location.y + move.y;

    return (x === 0 && y === -1) || (blizzards.every(blizzard => blizzard.coords.x !== x || blizzard.coords.y !== y) &&
      x >= 0 && x < width &&
      y >= 0 && y < height);
  });
}

function solve(): Queue {
  let grid = build_grid();
  let start = starting_point(grid);
  let end = finish_line(grid);

  let height = grid.length - 2;
  let width = grid[0].length - 2;

  let blizzies = build_blizzards(grid);

  return go_to(start, end, 0, width, height, blizzies);
}

function go_to(start: Coords, end: Coords, minute: number, width: number, height: number, blizzies: Blizzard[]): Queue {
  console.log(`finish line`, end);

  let queue: Queue[] = [{location: start, minute, path: []}];
  let paths_taken: string[] = [];

  while (queue.length) {
    let current = queue.shift()!;

    // Done!
    if (current.location.x === end.x && current.location.y === end.y)
      return current;

    current.minute;

    if (current.location.x >= 80 || current.location.y >= 20)
      console.log(`minute`, current.minute, `location`, current.location, current.path.length);

    let blizzards = blizzards_at_minute(width, height, blizzies, current.minute);
    let moves = free_moves(current.location, width, height, blizzards);

    moves.forEach(move => {
      let location = {x: current.location.x + move.x, y: current.location.y + move.y};
      let new_queue = {
        location,
        minute: current.minute + 1,
        path: [...current.path, `${location.x}:${location.y}`]
      };

      if (paths_taken.includes(new_queue.path.join('/')))
        return;

      // Only add to queue if it isn't already
      if (queue.findIndex(q => q.minute === new_queue.minute && q.location.x === new_queue.location.x && q.location.y === new_queue.location.y) === -1)
        queue.push(new_queue);

      paths_taken.push(new_queue.path.join('/'));
    });
  }

  throw `Well, shit. Apply solve to burn.`;
}

console.log(solve());
