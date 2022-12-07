import { readFileSync } from 'fs';

const input = readFileSync('./aoc_2022_day07_deep.txt', 'utf-8');

var fs: {[key: string]: number} = {};
let path: string[] = [];

input.split('\n').filter(output => output !== '').map(output => {
  if (output.slice(0,4) === '$ cd') {
    if (output.includes('..'))
      path.pop();
    else {
      path.push(output.split(' ')[2]);

      if (!fs.hasOwnProperty(path.join('/')))
        fs[path.join('/')] = 0;
    }
    return;
  }

  if (['$ ls', 'dir '].includes(output.slice(0,4))) {
    return;
  }

  let size = output.split(' ')[0];

  for (let i = path.length; i > 0; i--) {
    fs[path.slice(0, i).join('/')] += parseInt(size);
  };
});

let storage_shortage = fs['/'] - (70000000 - 30000000);

let small_dirs_size = 0;
let smallest_dir_size = 70000000;

for (const dir in fs) {
  if (fs[dir] <= 100000) {
    small_dirs_size += fs[dir];
  }
  if (fs[dir] >= storage_shortage && fs[dir] < smallest_dir_size) {
    smallest_dir_size = fs[dir];
  }
}

console.log(small_dirs_size);
console.log(smallest_dir_size);
