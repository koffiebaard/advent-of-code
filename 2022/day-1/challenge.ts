import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

const calories_carried_by_elves = input
  .split(/\n\n/)
  .map(elf_calories => {
    return elf_calories
      .split(/\n/)
      .map(calories => parseInt(calories) || 0)
      .reduce((total, calories) => total + calories, 0);
  });

let highest_calories_one_elf = Math.max(...calories_carried_by_elves);

let highest_calories_three_elves = calories_carried_by_elves
  .sort((n1, n2) => n2 - n1)
  .slice(0, 3)
  .reduce((total, calories) => total + calories, 0);

console.log(highest_calories_one_elf);
console.log(highest_calories_three_elves);
