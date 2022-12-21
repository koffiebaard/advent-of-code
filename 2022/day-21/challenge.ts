import { readFileSync } from 'fs';

type Monkeys = { [key: string]: number|string };

const valid_number = (number: number|string) => !isNaN(parseInt(String(number)));
const valid_numbers = (numbers: (number|string)[]) => numbers.every(number => valid_number(number));
const evil = (statement: string) => new Function('return ' + statement)();

let monkeys: Monkeys = readFileSync(process.argv[2] ?? './input', 'utf-8')
  .split('\n')
  .filter(output => output !== '')
  .reduce((monkeys, line) => ({...monkeys, [line.split(': ')[0]]: valid_number(line.split(': ')[1]) ? parseInt(line.split(': ')[1]) : line.split(': ')[1]}), {});

let queue: string[] = Object.keys(monkeys).filter(mon_key => !valid_number(monkeys[mon_key]));

while (queue.length) {
  let mon_key = String(queue.shift());

  let numbers = String(monkeys[mon_key])
    .split(/ [+\-\/\*]{1} /)
    .map(number => (monkeys[number] !== undefined && valid_number(monkeys[number])) ? monkeys[number] : number);

  if (valid_numbers(numbers)) {
    let operator = String(monkeys[mon_key]).match(new RegExp(`[+\-\/\*]{1}`, 'g'))?.[0];
    monkeys[mon_key] = evil(`${numbers[0]} ${operator} ${numbers[1]}`);
    continue;
  }

  queue.push(mon_key);
}

console.log(monkeys.root);
