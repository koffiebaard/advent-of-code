import { readFileSync } from 'fs';
import './number.extensions';

const input = readFileSync('./input', 'utf-8');

let result = input
  .split(/\n/)
  .filter(line => line !== '')
  .reduce((total, line) => {
    let sections = line.split(',').map(pair => pair.split('-').map(section => parseInt(section)));

    if (sections[0][0].between(sections[1][0], sections[1][1]) ||
        sections[0][1].between(sections[1][0], sections[1][1]) ||
        sections[1][0].between(sections[0][0], sections[0][1]) ||
        sections[1][1].between(sections[0][0], sections[0][1])
        ) {
      return total + 1;
    }

    return total;
  }, 0);

console.log(result);
