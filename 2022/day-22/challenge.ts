import { readFileSync } from 'fs';

type Coords = {
  x: number,
  y: number
}

const is_number = (number: number|string) => !isNaN(parseInt(String(number)));

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
let coords: Coords = {x: 0, y: 0};

directions?.forEach(direction => {
  // Step in the current direction
  if (is_number(direction)) {
    let steps = parseInt(direction);
    for (let step = 0; step < steps; step++) {
      let new_coords = {
        x: coords.x + moves[current_direction].x,
        y: coords.y + moves[current_direction].y,
      };

      // empty space, no probs
      if (map?.[new_coords.y]?.[new_coords.x] === '.') {
        coords = new_coords;
      }
      // wall
      else if (map?.[new_coords.y]?.[new_coords.x] === '#') {
        break;
      }
      // wrap around
      else if (map?.[new_coords.y]?.[new_coords.x] === undefined || map[new_coords.y][new_coords.x] === ' ') {
        // direction is right, so we end up left
        if (current_direction === 0) {
          let x_next_tile = map[new_coords.y].findIndex(tile => ['.', '#'].includes(tile));

          if (map[new_coords.y][x_next_tile] === '.')
            coords.x = x_next_tile;
        }
        // direction is left, so we end up right
        else if (current_direction === 2) {
          let x_next_tile = map[coords.y].length - 1;
          for (; x_next_tile >= 0; x_next_tile--) {
            if (!['.', '#'].includes(map[coords.y][x_next_tile]))
              continue;
            break;
          }

          if (map[new_coords.y][x_next_tile] === '.')
            coords.x = x_next_tile;
        }
        // direction is up, so we end up down
        else if (current_direction === 3) {
          let y_next_tile = map.length - 1;
          for (; y_next_tile >= 0; y_next_tile--) {
            if (!['.', '#'].includes(map[y_next_tile][coords.x]))
              continue;
            break;
          }

          if (map[y_next_tile][coords.x] === '.')
            coords.y = y_next_tile;
        }
        // direction is down, so we move to the top
        else if (current_direction === 1) {
          let y_next_tile = 0;
          for (; y_next_tile < map.length; y_next_tile++) {
            if (!['.', '#'].includes(map[y_next_tile][coords.x]))
              continue;
            break;
          }

          if (map[y_next_tile][coords.x] === '.')
            coords.y = y_next_tile;
        }
      }
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

console.log(coords, current_direction);
console.log(1000 * (coords.y+1) + 4 * (coords.x+1) + current_direction);
