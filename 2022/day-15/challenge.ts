import { readFileSync } from 'fs';

type Sensor = {
  location: Coords,
  beacon: Coords
}

type Coords = {
  x: number,
  y: number
}

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

function line_to_sensor(line: string): Sensor {
  return {
    location: {
      x: Number(line
        .split(':')[0]
        .split('at ')[1]
        .split(',')[0].replace('x=', '').replace('y=', '').trim()),
      y: Number(line
        .split(':')[0]
        .split('at ')[1]
        .split(',')[1].replace('x=', '').replace('y=', '').trim())
    },
    beacon: {
      x: Number(line
        .split(':')[1]
        .split('at ')[1]
        .split(',')[0].replace('x=', '').replace('y=', '').trim()),
      y: Number(line
        .split(':')[1]
        .split('at ')[1]
        .split(',')[1].replace('x=', '').replace('y=', '').trim())
    },
  };
}

let sensors: Sensor[] = input
  .split('\n')
  .filter(output => output !== '')
  .map(line => line_to_sensor(line));

var grid: { [key: number]: Set<string> } = {};

function grid_add(x_range: string, y: number) {
  if (grid[y] === undefined) {
    grid[y] = new Set();
  }

  grid[y].add(x_range);
}

sensors.map(sensor => {
  let diff = Math.abs(sensor.location.x - sensor.beacon.x) + Math.abs(sensor.location.y - sensor.beacon.y);
  // console.log(sensor, diff);
  for (let i = 0; i <= diff; i++) {
    // up
    grid_add(`${sensor.location.x - (diff - i)} ${sensor.location.x + (diff - i)}`, sensor.location.y + i);

    // down
    grid_add(`${sensor.location.x - (diff - i)} ${sensor.location.x + (diff - i)}`, sensor.location.y - i);
  }
});


let count = 0;
let completed_ranges: number[][] = [];


let y = process.argv[2] === 'example' ? 10 : 2000000;

console.log(grid[y]);

Array.from(grid[y])
  .sort((a, b) => b.length - a.length)
  .forEach(range => {
    let x1 = Number(range.split(' ')[0]);
    let x2 = Number(range.split(' ')[1]);
    console.log(`---- ${[x1, x2]}`);
    let new_range = completed_ranges.reduce((new_x: number[], prev_range: number[]) => {
      let [x1, x2] = new_x;
      // new_x is completely swamped within a previous range
      if (new_x[0] >= prev_range[0] && new_x[0] <= prev_range[1] && new_x[1] >= prev_range[0] && new_x[1] <= prev_range[1]) {
        console.log(`range ${x1}:${x2} is swamped within ${prev_range}, new range: 0,0`);
        return [0, 0];
      }

      // prev range is swamped
      if (prev_range[0] >= new_x[0] && prev_range[0] <= new_x[1] && prev_range[1] >= new_x[0] && prev_range[1] <= new_x[1]) {
        console.log('prev range is swamped!', prev_range, new_x);
      }

      if (new_x[0] >= prev_range[0] && new_x[0] <= prev_range[1]) {
        new_x[0] = prev_range[1];
        console.log(`range ${x1}:${x2} overlaps with range ${prev_range}, new range: ${new_x}`);
      }

      if (new_x[1] >= prev_range[0] && new_x[1] <= prev_range[1]) {
        new_x[1] = prev_range[0];
        console.log(`range ${x1}:${x2} overlaps with range ${prev_range}, new range: ${new_x}`);
      }

      return new_x;
    }, [x1, x2]);

  console.log(`---- new range: ${new_range}`);

  if (new_range[0] === 0 && new_range[1] === 0)
    return;

  let blaat = new_range[1] === new_range[0] ? 1 : new_range[1] - new_range[0];

  count += blaat;
  console.log(`count + ${blaat} is ${count}`);

  completed_ranges.push(new_range);
});

console.log(count);
