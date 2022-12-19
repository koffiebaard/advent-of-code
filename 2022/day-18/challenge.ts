import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let grid: number[][][] = Array.from({length: 25}, e => Array.from({length: 25}, e => Array(25).fill(-1)));


input
  .split('\n')
  .filter(output => output !== '')
  .map(line => line.split(',').map(coord => Number(coord)))
  .map(cube => {
    let [x, y, z] = cube;
    grid[z][y][x] = 6;
  });


grid.map((planes, z) => {
  planes.map((rows, y) => {
    rows.map((value, x) => {
      if (grid[z][y][x] === -1)
        return;

      // left
      if (grid[z][y][x-1] !== undefined && grid[z][y][x-1] !== -1) {
        grid[z][y][x]--;
      }

      // right
      if (grid[z][y][x+1] !== undefined && grid[z][y][x+1] !== -1) {
        grid[z][y][x]--;
      }

      // up
      if (grid[z][y-1]?.[x] !== undefined && grid[z][y-1]?.[x] !== -1) {
        grid[z][y][x]--;
      }

      // down
      if (grid[z][y+1]?.[x] !== undefined && grid[z][y+1]?.[x] !== -1) {
        grid[z][y][x]--;
      }

      if (grid[z][y][x] < 0)
        grid[z][y][x] = 0;
    });
  });
})

grid.map((planes, z) => {
  planes.map((rows, y) => {
    rows.map((value, x) => {
      if (grid[z][y][x] === -1)
        return;

      if (grid[z-1]?.[y][x] !== undefined && grid[z-1][y][x] !== -1) {
        grid[z][y][x]--;
      }

      if (grid[z+1]?.[y][x] !== undefined && grid[z+1][y][x] !== -1) {
        grid[z][y][x]--;
      }

      if (grid[z][y][x] < 0)
        grid[z][y][x] = 0;
    });
  });
})

const cube_present = (z: number, y: number, x: number) => {
  return grid[z]?.[y]?.[x] !== undefined && grid[z]?.[y]?.[x] !== -1;
}

const cube_visible = (z: number, y: number, x: number): boolean => {
  // z
  let visible = true;
  for (let i = 0; i < 30; i++) {
    if (cube_present(z+i, y, x))
      visible = false;
    if (cube_present(z-i, y, x))
      visible = false;
  }

  if (visible)
    return true;

  // y
  visible = true;
  for (let i = 0; i < 30; i++) {
    if (cube_present(z, y+i, x))
      visible = false;
    if (cube_present(z, y-i, x))
      visible = false;
  }

  if (visible)
    return true;

  // x
  visible = true;
  for (let i = 0; i < 30; i++) {
    if (cube_present(z, y, x+i))
      visible = false;

    if (cube_present(z, y, x-i))
      visible = false;
  }

  if (visible)
    return true;

  return false;
}

const cube_sides_visible = (z: number, y: number, x: number) => {
  let sides_visible = 0;

  // z - deeper
  if (cube_visible(z+1, y, x))
    sides_visible++;

  // z - closer
  if (cube_visible(z-1, y, x))
    sides_visible++;
 
  // y - down
  if (cube_visible(z, y+1, x))
    sides_visible++;

  // y - up
  if (cube_visible(z, y-1, x))
    sides_visible++;

  // x - right
  if (cube_visible(z, y, x+1))
    sides_visible++;

  // x - left
  if (cube_visible(z, y, x-1))
    sides_visible++;

  return sides_visible;
}

let actual_surface_area = 0;

grid.map((planes, z) => {
  planes.map((rows, y) => {
    rows.map((value, x) => {
      if (!cube_present(z, y, x))
        return;

        let sides_visible = cube_sides_visible(x, y, x);
        actual_surface_area += sides_visible;
    });
  });
})

const sum = (value: number[]) => value.reduce((partialSum, a) => a > 0 ? partialSum + a : partialSum, 0);


let total_surface_area = grid.reduce((total_z, z) => total_z + z.reduce((total_y, y) => total_y + sum(y), 0), 0);

let blue = '38;2;0;0;255';
let gray = '38;2;30;20;70';
let brown = '38;2;150;75;0';
let red = '38;2;255;0;0';
let green = '38;2;0;208;0';
let rs = `\x1b[${red}m`;
let gs = `\x1b[${green}m`;
let brs = `\x1b[${brown}m`;
let bs = `\x1b[${blue}m`;
let grs = `\x1b[${gray}m`;
let ws = `\x1b[97m`;
let e = `\x1b[0m`;

console.log(`${rs}
     _ _   --   ${total_surface_area}    - -__     -_
               --  --___ ${actual_surface_area} _ __--__ -" _
                          _ --        -_ "-_${brs}
${gs}          __    ${brs}                      _--,_
${gs}     /">^/",,\\ ${brs}                       /"("\\"\\
${gs}   </">LX<"<,\\ ${brs}                   _/"/"|\\ )\\>_
${gs} / >/ >O-,\\"   ${brs}              _/"_." _/ / / \\"\\
${gs}  ^" V"O^  V    ${brs}           /""_-" ,/"  /\\  \\ ) "-,_
     ${gs}'${brs}  \\>              _-"/ ( .-/ \\ !   )  \\ _\\"-_"\\_
${rs} ___ ___${brs} \\>${rs} _ ___  ${brs} _-"/_-"   / (    |  / \\  | \\  \\_- "-_  __ _ _
${rs}-   - --  ${brs}\\">   -<_"__" /  _/|   \\ \\ | /! \\  \\  -_( _"-<_">-- -
${rs}-    _ ___${brs}",">${rs}-____ _">${brs} ""${rs}_${brs}" "--"--"-" "-"' "-"  '"  ${rs}_
${rs}  C"" -_O   "O-'           '">        __ -  -
 __)    - O         __ - - "      - -
_ .-- "      - """${e}`);
