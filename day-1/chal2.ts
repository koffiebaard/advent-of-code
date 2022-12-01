import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

const calorie_chunks = input.split(/\n\n/)
  .map(chunk => {
    return chunk
      .split(/\n/)
      .map(calories => parseInt(calories) || 0)
      .reduce((total,calories) => total + calories, 0);
  })

let calorie_amount = calorie_chunks
  .sort((n1, n2) => n2 - n1)
  .slice(0, 3)
  .reduce((total,calories) => total + calories, 0);

console.log(calorie_amount);
