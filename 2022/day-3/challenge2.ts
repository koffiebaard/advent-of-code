import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

let rucksacks = input.split(/\n/);
let badges: string[] = [];

function find_badge(rucksack1: string, rucksack2: string, rucksack3: string): string {
  return rucksack1.split('').filter(item => rucksack2.includes(item) && rucksack3.includes(item))[0];
}

for (let group = 0; group < rucksacks.length - 1; group += 3) {
  badges.push(find_badge(rucksacks[group], rucksacks[group+1], rucksacks[group+2]));
}

let points_list = badges.map(item => item.charCodeAt(0) - (item == item.toUpperCase() ? 38 : 96));

console.log(points_list.reduce((total, points) => total + points, 0));
