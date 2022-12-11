import { readFileSync } from 'fs';

type Monkey = {
  items: number[]
  operation_operator: string
  operation: string
  test: number
  throw_if_true: number
  throw_if_false: number
}

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

// One mod to rule them all
let moddatnou = 1;

function calculate_worry_level(worry_level: number, operator: string, operation: string, relief: boolean): number {
  let operation_number = operation === 'old' ? worry_level : Number(operation);

  let new_worry_level = operator === '*' ? worry_level * operation_number : worry_level + operation_number;

  if (relief)
    return Math.floor(new_worry_level / 3);

  return new_worry_level;
}

let monkeys: Monkey[] = input
  .split('\n\n')
  .filter(output => output !== '')
  .map(monkey => {
    let test = Number(monkey.split('\n')[3].split('divisible by ')[1]);

    // One mod to find them
    moddatnou *= test;

    return {
      items: monkey.split('\n')[1].split(':')[1].split(', ').map(item => Number(item)),
      operation_operator: monkey.split('\n')[2].split(' ')[6].trim(),
      operation: monkey.split('\n')[2].split(' ')[7].trim(),
      test,
      throw_if_true: Number(monkey.split('\n')[4].split('throw to monkey ')[1].trim()),
      throw_if_false: Number(monkey.split('\n')[5].split('throw to monkey ')[1].trim()),
    };
  });

[{relief: true, rounds: 20}, {relief: false, rounds: 10000}].map(({relief, rounds}) => {
  let monkey_business = Array(monkeys.length).fill(0, 0, monkeys.length);
  let local_monkeys: Monkey[] = JSON.parse(JSON.stringify(monkeys));

  for (let round = 0; round < rounds; round++) {
    local_monkeys.forEach((monkey, monkey_number) => {
      if (monkey.items.length === 0)
        return;

      monkey.items.forEach((worry_level) => {
        monkey_business[monkey_number]++;

        // One mod to bring them all, and in darkness bind them
        worry_level %= moddatnou;

        worry_level = calculate_worry_level(worry_level, monkey.operation_operator, monkey.operation, relief);

        if (worry_level % monkey.test === 0) {
          local_monkeys[monkey.throw_if_true].items.push(worry_level);
        } else {
          local_monkeys[monkey.throw_if_false].items.push(worry_level);
        }
      });
      monkey.items = [];
    });
  }

  console.log(monkey_business.sort((a, b) => b - a).slice(0, 2).reduce((total, business) => total * business));
});

let red = '38;2;255;0;0';
let green = '38;2;0;208;0';
let white = '38;2;245;245;245';

let rs = `\x1b[${red}m`;
let gs = `\x1b[${green}m`;
let ws = `\x1b[${white}m`;
let e = `\x1b[0m`;

// MONKE
console.log(`
                ${rs}▓▓▓▓▓▓▓▓▓▓${e}                          
              ${rs}▓▓▓▓▓▓▓▓▓▓▓▓▓▓${e}                        
            ${rs}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓${e}                      
          ${rs}▓▓▓▓${gs}░░░░░░${rs}▓▓${gs}░░░░░░${rs}▓▓▓▓${e}                    
      ${gs}░░░░${rs}▓▓${gs}░░░░░░░░░░░░░░░░░░${rs}▓▓${gs}░░░░                
      ${gs}░░░░${rs}▓▓${gs}░░  ${ws}██${gs}░░░░░░  ${ws}██${gs}░░${rs}▓▓${gs}░░░░                
        ${gs}░░${rs}▓▓${gs}░░${ws}████${gs}░░░░░░${ws}████${gs}░░${rs}▓▓${gs}░░                  
          ${rs}▓▓${gs}░░░░░░░░░░░░░░░░░░${rs}▓▓${e}                    
            ${rs}▓▓${gs}░░░░░░░░░░░░░░${rs}▓▓${e}                      
              ${rs}▓▓▓▓${gs}░░░░░░${rs}▓▓▓▓${e}                        
                  ${rs}▓▓▓▓▓▓${e}        ${gs}░░                  
                ${rs}▓▓▓▓▓▓▓▓▓▓      ▓▓${e}                  
                ${rs}▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓${e}                  
              ${rs}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓${e}                    
              ${rs}▓▓▓▓${gs}░░${rs}▓▓${gs}░░${rs}▓▓▓▓${e}                        
`);
