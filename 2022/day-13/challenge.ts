import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

function compare_values(left: number | number[], right: number | number[]): boolean | null {
  left = !Array.isArray(left) ? [left] : left;
  right = !Array.isArray(right) ? [right] : right;

  let result = left.reduce((result: boolean | null, item, index) => {
    if (result !== null)
      return result;

    if (!Array.isArray(right) || right[index] === undefined)
      return false;

    if (Array.isArray(item) || Array.isArray(right[index]))
      return compare_values(item, right[index]);

    if (item < right[index] || item > right[index])
      return item < right[index] ? true : false;

    return result;
  }, null);

  if (result === null && left.length < right.length)
    return true;

  return result;
}

// Challenge 1
let packets = input
  .split('\n\n')
  .filter(output => output !== '')
  .map(line => ({
    left: JSON.parse(line.split('\n')[0]),
    right: JSON.parse(line.split('\n')[1])
  }));

let pairs_in_right_order = packets.reduce((indices, pair, index) => {
  return compare_values(pair.left, pair.right) ? indices + index + 1 : indices
}, 0);

// Challenge 2
let all_packets = input
  .split('\n')
  .filter(output => output !== '')
  .concat('[[2]]', '[[6]]')
  .sort((left, right) => {
    return compare_values(JSON.parse(left), JSON.parse(right)) ? -1 : 1
  });

let divider_packet_indices = (all_packets.indexOf('[[2]]') + 1) * (all_packets.indexOf('[[6]]') + 1);


let red = '38;2;255;0;0';
let green = '38;2;0;208;0';
let dark_green = '38;2;0;90;0';
let rs = `\x1b[${red}m`;
let gs = `\x1b[${green}m`;
let dgs = `\x1b[${dark_green}m`;
let ws = `\x1b[97m`;
let e = `\x1b[0m`;
console.log(`${ws}                                   .
      .              .   .'.     \\   /
    \\   /      .'. .' '.'   ' -= ${rs}${String(divider_packet_indices).padStart(4).padEnd(5)}${ws} =-
  -= ${rs}${String(pairs_in_right_order).padStart(3).padEnd(4)}${ws} =-  .'   '             / | \\
    / | \\${gs}                          |
      |                            |
      |                            |
      |                      .=====|
      |=====.                |${dgs}.---.${gs}|
      |${dgs}.---.${gs}|                |${dgs}|=o=|${gs}|
      |${dgs}|=o=|${gs}|                |${dgs}|   |${gs}|
      |${dgs}|   |${gs}|                |${dgs}|   |${gs}|
      |${dgs}|   |${gs}|                |${dgs}|___|${gs}|
      |${dgs}|___|${gs}|                |${dgs}[${gs}:::${dgs}]${gs}|
      |${dgs}[${gs}:::${dgs}]${gs}|                '-----'
      '-----'${e}`);
