import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

let rucksacks = input.split(/\n/);
let badges: string[] = [];

function find_badge(rucksack1: string, rucksack2: string, rucksack3: string): string {
  for (var offset = 0; offset < rucksack1.length; offset++) {
    if (rucksack2.includes(rucksack1[offset]) && rucksack3.includes(rucksack1[offset]))
      return rucksack1[offset];
  }

  throw 'Well shit.';
}

for (let group = 0; group < rucksacks.length - 1; group += 3) {
  badges.push(find_badge(rucksacks[group], rucksacks[group+1], rucksacks[group+2]));
}

let points_list = badges.map(item => item.charCodeAt(0) - (item == item.toUpperCase() ? 38 : 96));

console.log(points_list.reduce((total, points) => total + points, 0));
