import { readFileSync } from 'fs';

type Coords = {
  x: number,
  y: number
}

type CubeSwitch = {
  coords: Coords,
  direction: number,
}

const is_number = (number: number|string) => !isNaN(parseInt(String(number)));

const is_example = process.argv[2] === 'example';
const cube_size = is_example ? 4 : 50;

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let map = input
  .split('\n\n')[0]
  .split('\n')
  .filter(output => output !== '')
  .map(line => line.split(''));

let directions = input
  .split('\n\n')[1]
  .split('\n')
  .filter(output => output !== '')
  .map(line => line.match(/[a-zA-Z]+|[0-9]+/g))[0];

const cube: Coords[][] = [];

for (let y = 0; y < map.length; y += cube_size) {
  let to_y = y + (cube_size - 1);
  
  for (let x = 0; x < (cube_size * 4); x += cube_size) {
    let to_x = x + (cube_size - 1);

    if (map?.[y]?.[x] !== undefined && map?.[to_y]?.[to_x] !== undefined) {
      if (map[y].slice(x, to_x).every(tile => tile !== ' ')) {
        cube.push([{y, x}, {y: to_y, x: to_x}]);
      }
    }
  }
}

function between(number: number, min: number, max: number): boolean {
  return number >= min && number <= max;
}

function which_cube_side(coords: Coords): number {
  return cube.findIndex((side) => between(coords.y, side[0].y, side[1].y) && between(coords.x, side[0].x, side[1].x));
}


// 0 for right (>)
// 1 for down (v)
// 2 for left (<)
// 3 for up (^)
function cube_side_switch(coords: Coords, current_direction: number): CubeSwitch {
  let new_coords: Coords = JSON.parse(JSON.stringify(coords));
  let cube_side = which_cube_side(coords);
  let right = 0, down = 1, left = 2, up = 3;

  // move to left of 3, going down 4
  if (cube_side === 2 && current_direction === left) {
    // x is now coord.y - cube side start_y
    // y is now new cube side start_y
    new_coords.x = coords.y - cube[cube_side][0].y;
    new_coords.y = cube[3][0].y
    return {coords: new_coords, direction: down};
  }

  // move to the right of 3, moving up 2
  if (cube_side === 2 && current_direction === right) {
    new_coords.x = (coords.y - cube[cube_side][0].y) + cube[1][0].x;
    new_coords.y = cube[1][1].y // the end of y
    return {coords: new_coords, direction: up};
  }

  // move to the left side of 1, towards 4, going right
  if (cube_side === 0 && current_direction === left) {
    // inverted
    new_coords.y = ((cube_size-1) - (coords.y - cube[cube_side][0].y)) + cube[3][0].y;
    new_coords.x = 0;
    return {coords: new_coords, direction: right};
  }

  // move to the top side of 1, towards 6 (left side), going right
  if (cube_side === 0 && current_direction === up) {
    new_coords.y = cube[5][0].y + (coords.x - cube[0][0].x);
    new_coords.x = cube[5][0].x;
    return {coords: new_coords, direction: right};
  }

  // move to the top side of 2, towards 6 (bottom side), going up
  if (cube_side === 1 && current_direction === up) {
    new_coords.y = cube[5][1].y;
    new_coords.x -= cube[cube_side][0].x;
    return {coords: new_coords, direction: up};
  }

  // move to the bottom side of 2, towards 3 (right side), going left
  if (cube_side === 1 && current_direction === down) {
    new_coords.y = (coords.x - cube[1][0].x) + cube[2][0].y;
    new_coords.x = cube[2][1].x;
    return {coords: new_coords, direction: left};
  }

  // move to the right side of 2, towards 5 (right side), going left
  if (cube_side === 1 && current_direction === right) {
    // inverted because 5 is upside down
    new_coords.y = ((cube_size-1) - (coords.y - cube[cube_side][0].y)) + cube[4][0].y;
    new_coords.x = cube[4][1].x;
    return {coords: new_coords, direction: left};
  }

  // move to the right side of 5, towards 2 (right side), going left
  if (cube_side === 4 && current_direction === right) {
    // inverted because 5 is upside down
    new_coords.y = ((cube_size-1) - (coords.y - cube[cube_side][0].y)) + cube[1][0].y;
    new_coords.x = cube[1][1].x;
    return {coords: new_coords, direction: left};
  }

  // move to the bottom side of 5, towards 6 (right side), going left
  if (cube_side === 4 && current_direction === down) {
    new_coords.y = (coords.x - cube[4][0].x) + cube[5][0].y;
    new_coords.x = cube[5][1].x;
    return {coords: new_coords, direction: left};
  }

  // move to the left side of 4, towards 1 (right side), going right
  if (cube_side === 3 && current_direction === left) {
    // inverted, 4 is upside down
    new_coords.y = ((cube_size-1) - (coords.y - cube[3][0].y));
    new_coords.x = cube[0][0].x;
    return {coords: new_coords, direction: right};
  }

  // move to the top side of 4, towards 3 (left side), going right
  if (cube_side === 3 && current_direction === up) {
    new_coords.y = coords.x + cube[2][0].y;
    new_coords.x = cube[2][0].x;
    return {coords: new_coords, direction: right};
  }

  // move to the left side of 6, towards 1 (top side), going down
  if (cube_side === 5 && current_direction === left) {
    // console.log(cube[5][0].y, cube[0][0].x, cube[0][0].x);
    new_coords.x = (coords.y - cube[5][0].y) + cube[0][0].x;
    new_coords.y = cube[0][0].y;
    return {coords: new_coords, direction: down};
  }

  // move to the bottom side of 6, towards 2 (top side), going down
  if (cube_side === 5 && current_direction === down) {
    new_coords.y = (coords.y - cube[cube_side][0].y);
    new_coords.x = coords.x + cube[1][0].x;
    return {coords: new_coords, direction: down};
  }

  // move to the right side of 6, towards 5 (bottom side), going up
  if (cube_side === 5 && current_direction === right) {
    new_coords.y = cube[4][1].y;
    new_coords.x = (coords.y - cube[cube_side][0].y) + cube[4][0].x;
    return {coords: new_coords, direction: up};
  }

  throw `Well, shit.`;
}


let moves: Coords[] = [
  {x: 1, y: 0}, // right
  {x: 0, y: 1}, // down
  {x: -1, y: 0}, // left
  {x: 0, y: -1}, // up
];

// 0 for right (>)
// 1 for down (v)
// 2 for left (<)
// 3 for up (^)
let current_direction = 0;
let coords: Coords = is_example ? {y: 0, x: 8} : {y: 0, x: 50};

directions?.forEach(direction => {
  // Step in the current direction
  if (is_number(direction)) {
    let steps = parseInt(direction);
    for (let step = 0; step < steps; step++) {
      let new_coords = {
        x: coords.x + moves[current_direction].x,
        y: coords.y + moves[current_direction].y,
      };
      let current_side = which_cube_side(coords);
      let new_side = which_cube_side(new_coords);

      // still on the same cube side (or adjacent), and the next move is an empty space
      if (map?.[new_coords.y]?.[new_coords.x] === '.') {
        coords = new_coords;
        continue;
      }

      // same cube side (or adjacent), but hitting a wall
      if (map?.[new_coords.y]?.[new_coords.x] === '#') {
        break;
      }

      if (new_side !== -1)
        throw 'We should always be living on the edge here.';

      console.log(`--- potential cube side move`, current_side, coords, current_direction);

      let new_cube_side = cube_side_switch(coords, current_direction);

      if (map?.[new_cube_side.coords.y]?.[new_cube_side.coords.x] === '#') {
        break;
      }

      console.log(new_cube_side);
      coords = new_cube_side.coords;
      current_direction = new_cube_side.direction;
    }
  }
  // Turn clockwise
  else if (direction === 'R') {
    current_direction = current_direction === 3 ? 0 : current_direction + 1;
  }
  // Counter clockwise
  else if (direction === 'L') {
    current_direction = current_direction === 0 ? 3 : current_direction - 1;
  }
});

// console.log(coords, current_direction);
console.log(1000 * (coords.y+1) + 4 * (coords.x+1) + current_direction);
