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

var grid: { [key: string]: Set<string> } = {};

function grid_add(x_range: string, y: string) {
  if (grid[y] === undefined) {
    grid[y] = new Set();
  }

  grid[y].add(x_range);
}

sensors.map(sensor => {
  let diff = Math.abs(sensor.location.x - sensor.beacon.x) + Math.abs(sensor.location.y - sensor.beacon.y);

  grid_add(`${sensor.location.x - diff} ${sensor.location.x + diff}`, `${sensor.location.y - diff} ${sensor.location.y + diff}`);
});



Object.keys(grid).forEach(y => {
  Array.from(grid[y]).sort((a, b) => b.length - a.length)
  .forEach(x => {
    if (Number(y.split(' ')[0]) < 0 || Number(y.split(' ')[1]) > 4000000)
      return;
    if (Number(x.split(' ')[0]) < 0 || Number(x.split(' ')[1]) > 4000000)
      return;

    console.log(y, x);
  })
});
