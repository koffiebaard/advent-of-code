import { readFileSync } from 'fs';

type Coords = {
  x: number,
  y: number
}

type ElfMove = {
  from: Coords,
  to: Coords,
}

var moves = {
  'north': [{x: 0, y: -1}, {x: 1, y: -1}, {x: -1, y: -1}],
  'south': [{x: 0, y: +1}, {x: 1, y: +1}, {x: -1, y: +1}],
  'east': [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: -1}],
  'west': [{x: -1, y: 0}, {x: -1, y: 1}, {x: -1, y: -1}],
};

function draw_grid(map: string[][]) {
  let filtered_map = smallest_square_grid(map);
  // let filtered_map = map;

  for (let y = 0; y < filtered_map.length; y++) {
    for (let x = 0; x < filtered_map[0].length; x++) {
      process.stdout.write(filtered_map[y][x]);
    }
    process.stdout.write('\n');
  }
}

function smallest_square_grid(map: string[][]): string[][] {
  let top_y = map.reduce((top_y: number | null, row, y) => top_y ? top_y : row.some(col => col !== '.') ? y : null, null );
  let bottom_y = map.length - Number(map.slice().reverse().reduce((bottom_y: number | null, row, y) => bottom_y ? bottom_y : row.some(col => col !== '.') ? y : bottom_y, null ));

  let left_x = map.reduce((left_x: number, row) => {
    let closest_elf: number = row.findIndex(x => x !== '.');
    if (closest_elf < left_x && closest_elf !== -1)
      return closest_elf;

    return left_x;
  }, Infinity );

  let right_x = map[0].length - map.reduce((right_x: number, row) => {
    let closest_elf: number = row.slice().reverse().findIndex(x => x !== '.');
    if (closest_elf < right_x && closest_elf !== -1)
      return closest_elf;

    return right_x;
  }, Infinity );

  let map_copy = JSON.parse(JSON.stringify(map));

  map_copy.splice(bottom_y);
  map_copy.splice(0, top_y);

  for (let index = 0; index < map_copy.length; index++) {
    map_copy[index].splice(right_x);
    map_copy[index].splice(0, left_x);
  }

  return map_copy;
}

function create_map(): string[][] {
  const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

  let map: string[][] = input
    .split('\n\n')[0]
    .split('\n')
    .filter(output => output !== '')
    .map(line => line.split(''));

  map = add_padding_to_map(map);
  map = add_padding_to_map(map);
  map = add_padding_to_map(map);
  map = add_padding_to_map(map);

  return map;
}

function add_padding_to_map(map: string[][]): string[][] {

  map.forEach((row, y) => row.unshift('.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'));
  map.forEach((row, y) => row.push('.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'));
  map.unshift(...Array.from({length: 25}, e => Array(map[0].length).fill('.')));
  map.push(...Array.from({length: 25}, e => Array(map[0].length).fill('.')));

  return map;
}

function find_all_elves(map: string[][]): Coords[] {
  let elves: Coords[] = [];

  map.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col === '#')
        elves.push({y, x});
    })
  });

  return elves;
}

function is_dobby_a_free_elf(map: string[][], elf: Coords): boolean {
  if (
    moves.north.every((coord => map[elf.y+coord.y][elf.x+coord.x] === '.')) &&
    moves.east.every((coord => map[elf.y+coord.y][elf.x+coord.x] === '.')) &&
    moves.south.every((coord => map[elf.y+coord.y][elf.x+coord.x] === '.')) &&
    moves.west.every((coord => map[elf.y+coord.y][elf.x+coord.x] === '.'))
  )
  return true;

  return false;
}

function move_elves(map: string[][], rounds: number = 10): number {
  let last_round = 0;
  let directions = [
    'north',
    'south',
    'west',
    'east',
  ];

  for (let round = 0; round < rounds; round++) {
    let elves = find_all_elves(map);
    let proposed_moves: ElfMove[] = [];

    elves.forEach(elf => {
      if (is_dobby_a_free_elf(map, elf))
        return;

      let proposed_move = directions.reduce((chosen_move: ElfMove | null, direction) => {
        if (chosen_move !== null)
          return chosen_move;

        if (direction === 'north' && moves.north.every((coord => map[elf.y+coord.y][elf.x+coord.x] === '.'))) {
          return {
            from: elf,
            to: {y: elf.y-1, x: elf.x}
          };
        }
        if (direction === 'south' && moves.south.every((coord => map[elf.y+coord.y][elf.x+coord.x] === '.'))) {
          return {
            from: elf,
            to: {y: elf.y+1, x: elf.x}
          };
        }
        if (direction === 'east' && moves.east.every((coord => map[elf.y+coord.y][elf.x+coord.x] === '.'))) {
          return {
            from: elf,
            to: {y: elf.y, x: elf.x+1}
          };
        }
        if (direction === 'west' && moves.west.every((coord => map[elf.y+coord.y][elf.x+coord.x] === '.'))) {
          return {
            from: elf,
            to: {y: elf.y, x: elf.x-1}
          };
        }

        return chosen_move;
      }, null);

      if (proposed_move) {
        proposed_moves.push(proposed_move);
      }
    });

    last_round = round;
    if (proposed_moves.length === 0)
      break;


    proposed_moves.forEach(move => {
      if (proposed_moves.filter(filter_move => filter_move.to.x === move.to.x && filter_move.to.y === move.to.y).length === 1) {
        map[move.from.y][move.from.x] = '.';
        map[move.to.y][move.to.x] = '#';
      }
    });

    let first_direction = String(directions.shift());
    directions.push(first_direction);
    
  }

  return last_round;
}


let map_1 = create_map();
// let map_2: string[][] = JSON.parse(JSON.stringify(map_1));
move_elves(map_1, 10);
draw_grid(map_1);

console.log(smallest_square_grid(map_1).reduce((total, row) => {
  return total + row.filter(x => x === '.').length;
}, 0));


let map_2 = create_map();
let rounds = move_elves(map_2, 99999);
console.log('rounds when elves stop moving', rounds+1);
