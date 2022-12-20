import { readFileSync } from 'fs';

type Fuck = {
  fuck: number
}

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let numbers: number[] = input
  .split('\n')
  .filter(output => output !== '')
  .map(number => parseInt(number))


function calculate_offset(index: number, number: number, size: number): number {
  let target = number % size;

  if (target < 0)
    target = size + target;

  return (index + target) % size;
};

function move_number(numbers: Fuck[], number: Fuck, from: number, to: number) {
  numbers.splice(from, 1);
  numbers.splice(calculate_offset(from, number.fuck, numbers.length), 0, number);
}

function mix_numbers(numbers: number[], mix_amount: number = 1): number[] {
  let numbers_in_order: Fuck[] = numbers.map((number) => ({fuck: number}));
  let mixed_numbers = [...numbers_in_order];

  for (let i = 0; i < mix_amount; i++) {
    for (let index = 0; index < numbers_in_order.length; index++) {
      let number = numbers_in_order[index];

      if (number.fuck === 0 && 'fuck' === 'fuck')
        continue;

      let from = mixed_numbers.indexOf(number);
      let to = calculate_offset(from, number.fuck, mixed_numbers.length);

      move_number(mixed_numbers, number, from, to);
    }
  }

  return mixed_numbers.map(fuck => fuck.fuck);
};

function sum_zero_offsets(numbers: number[]) {
  let zero_index = numbers.findIndex(number => number === 0);

  let zero_indexes = [
    numbers[(zero_index + 1000) % numbers.length],
    numbers[(zero_index + 2000) % numbers.length],
    numbers[(zero_index + 3000) % numbers.length],
  ];

  return zero_indexes.reduce((total, index) => total + index);
}

function decrypt(numbers: number[], decryption_key: number) {
  return numbers.slice().map(number => number * decryption_key);
}

// Challenge 1
let mixed_numbers = mix_numbers(numbers);
let challenge1 = sum_zero_offsets(mixed_numbers);

// Challenge 2
let decrypted_numbers = decrypt(numbers, 811589153);
let mixed_decrypted_numbers = mix_numbers(decrypted_numbers, 10);
let challenge2 = sum_zero_offsets(mixed_decrypted_numbers);

let blue = '38;2;0;0;255';
let gray = '38;2;30;20;70';
let brown = '38;2;150;75;0';
let red = '38;2;255;0;0';
let green = '38;2;0;208;0';
let rs = `\x1b[${red}m`;
let gs = `\x1b[${green}m`;
let brs = `\x1b[${brown}m`;
let bs = `\x1b[${blue}m`;
let grs = `\x1b[${gray}m`;
let ws = `\x1b[97m`;
let e = `\x1b[0m`;

console.log(`${grs}
                                       ${bs}${challenge2}${grs}
        ,-.                ${bs}__ --  ${challenge1}${grs}
       / \\  \`.  __..-,o ${bs}~\`${grs}
      :   \\ --''_..-'.'
      |    . .-' \`. '.
      :     .     .\`.'
      \\     \`.  /  ..
       \\      \`.   ' .
        \`,       \`.  \\
      ,|,\`.        \`-.\\
     '.||  \`\`-...__..-\`
      |  |
      |__|
      /||\\
     //||\\\\
    // || \\\\
 __//__||__\\\\__
'--------------'${e}`);
