import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

const calorie_chunks = input.split(/\n\n/)
  .map(chunk => { 
    return chunk
      .split(/\n/)
      .map(calories => parseInt(calories))
      .reduce((total,calories) => total + calories, 0);
  })
  .filter(calorie_chunk => !isNaN(calorie_chunk));

console.log(Math.max(...calorie_chunks));
