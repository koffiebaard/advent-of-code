import { readFileSync } from 'fs';

const passports = readFileSync(process.argv[2] ?? './input', 'utf-8')
  .split('\n\n')
  .filter(output => output !== '');

let challenge1 = passports
  .map(passport => passport.match(new RegExp(`[a-z]{3}:`, 'g')) as string[])
  .map(passport => {
    if (passport?.length === 8)
      return 1;

    if (passport?.length === 7 && passport.indexOf('cid:') === -1)
      return 1;

    return 0;
  })
  .reduce((valid_passports: number, passport: number) => valid_passports + passport, 0);

console.log(challenge1);
