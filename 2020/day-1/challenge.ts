import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

let expenses = input
    .split('\n')
    .filter(output => output !== '')
    .map(expense => parseInt(expense));

let challenge1 = expenses.reduce((expense_sum, expense) => expenses.includes(2020 - expense) ? expense * (2020 - expense) : expense_sum, 0);
console.log(challenge1);

let challenge2 = expenses
  .reduce((expense_sum_three, expense_three) => expenses.reduce((expense_sum, expense) => expenses.includes(2020 - expense_three - expense) ? expense * expense_three * (2020 - expense_three - expense) : expense_sum, 0) || expense_sum_three, 0);
console.log(challenge2);
