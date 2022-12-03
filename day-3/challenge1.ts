import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

let duplicate_items: string[] = [];

input.split(/\n/).map(rucksack => {
  if (rucksack.length === 0)
    return;

  let components = [rucksack.slice(0, rucksack.length / 2), rucksack.slice(rucksack.length / 2)];
  duplicate_items.push(components[0].split('').filter(item => components[1].includes(item))[0]);
});

let points_list = duplicate_items.map(item => item.charCodeAt(0) - (item == item.toUpperCase() ? 38 : 96));

console.log(points_list.reduce((total, points) => total + points, 0));
