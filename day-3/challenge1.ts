import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

let duplicate_items: string[] = [];

input
  .split(/\n/)
  .map(rucksack_contents => {
    let component1 = rucksack_contents.substring(0, rucksack_contents.length / 2);
    let component2 = rucksack_contents.substring(rucksack_contents.length / 2);

    for (var offset = 0; offset < component1.length; offset++) {
      if (component2.includes(component1[offset])) {
        duplicate_items.push(component1[offset]);
        break;
      }
    }
  });

let points_list = duplicate_items.map(item => item.charCodeAt(0) - (item == item.toUpperCase() ? 38 : 96));

console.log(points_list.reduce((total, points) => total + points, 0));
