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
console.log(total_surface_area)

console.log(actual_surface_area);

console.log(`
     _ _   --           - -__     -_
               --  --___     _ __--__ -" _
                          _ --        -_ "-_
          __                          _--,_
     /">^/",,\\                        /"("\\"\\
   </">LX<"<,\\                    _/"/"|\\ )\\>_
 / >/ >O-,\\"                 _/"_." _/ / / \\"\\
  ^" V"O^  V               /""_-" ,/"  /\\  \\ ) "-,_
     '  \\>              _-"/ ( .-/ \\ !   )  \\ _\\"-_"\\_
 ___ ___ \\> _ ___   _-"/_-"   / (    |  / \\  | \\  \\_- "-_  __ _ _
-   - --  \\">   -<_"__" /  _/|   \\ \\ | /! \\  \\  -_( _"-<_">-- -
-    _ ___",">-____ _"> ""_" "--"--"-" "-"' "-"  '"  _
  C"" -_O   "O-'           '">        __ -  -
 __)    - O         __ - - "      - -
_ .-- "      - """`);
