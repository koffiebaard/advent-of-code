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

let packets = input.split('\n\n').filter(output => output !== '')

let pairs_in_right_order = packets.reduce((indices, line, index) => {
    let left = JSON.parse(line.split('\n')[0]);
    let right = JSON.parse(line.split('\n')[1]);

    let result = compare_values(left, right);

    return result ? indices + index + 1 : indices;
  }, 0);

let all_packets = input.split('\n').filter(output => output !== '').concat('[[2]]', '[[6]]');

all_packets.sort((line1, line2) => {
  let left = JSON.parse(line1);
  let right = JSON.parse(line2);

  let result = compare_values(left, right);

  return result ? -1 : 1;
})

console.log(pairs_in_right_order);

console.log((all_packets.indexOf('[[2]]') + 1) * (all_packets.indexOf('[[6]]') + 1));
