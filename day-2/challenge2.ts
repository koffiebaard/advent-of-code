import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

var opponent: {[key: string]: number} = {
  A: 1, // Rock
  B: 2, // Paper
  C: 3, // Scissors
};

var goals: {[key: string]: string} = {
  X: 'lose', // Lose
  Y: 'draw', // Draw
  Z: 'win', // Win
}

const list_of_points = input
  .split(/\n/)
  .map(round => {
    if (round.length === 0)
      return 0;

    let actions = round.split(' ');
    let opponents_hand = opponent[actions[0]];
    let goal = goals[actions[1]];

    let points = 0;

    if (goal === 'draw') {
      points += 3 + opponents_hand;
    }
    else if (goal === 'win') {
      points += 6;
      points +=
        opponents_hand === 3 ? 1 :
        opponents_hand === 2 ? 3 : 2;
    }
    else if (goal === 'lose') {
      points +=
        opponents_hand === 3 ? 2 :
        opponents_hand === 2 ? 1 : 3;
    }

    return points;
  });

console.log(list_of_points.reduce((total, points) => total + points, 0));
