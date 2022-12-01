import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

const calories_carried_by_elves = input.split(/\n\n/)
  .map(elf_calories => {
    return elf_calories
      .split(/\n/)
      .map(calories => parseInt(calories) || 0)
      .reduce((total, calories) => total + calories, 0);
  });

let highest_calories = Math.max(...calories_carried_by_elves);

console.log(highest_calories);
