import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let valid_passwords_1 = 0, valid_passwords_2 = 0;

input
  .split('\n')
  .filter(output => output !== '')
  .map(output => output.split(' '))
  .map(line => {
    let character_limit = line[0].split('-').map(limit => parseInt(limit));
    let character = line[1].slice(0, -1);
    let password = line[2];

    let character_occurrence: number = password.match(new RegExp(`${character}`, 'g'))?.length || 0;
    if (character_occurrence >= character_limit[0] && character_occurrence <= character_limit[1])
      valid_passwords_1++;

    let first_offset = password.slice(character_limit[0]-1)[0] === character ? 1 : 0;
    let second_offset = password.slice(character_limit[1]-1)[0] === character ? 1 : 0;

    if (first_offset + second_offset === 1)
      valid_passwords_2++;
  });

console.log(valid_passwords_1, valid_passwords_2);
