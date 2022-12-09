import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

var opponent: {[key: string]: number} = {
  A: 1, // Rock
  B: 2, // Paper
  C: 3, // Scissors
};

var me: {[key: string]: number} = {
  X: 1, // Rock
  Y: 2, // Paper
  Z: 3, // Scissors
}

const list_of_points = input
  .split(/\n/)
  .map(round => {
    if (round.length === 0)
      return 0;

    let actions = round.split(' ');
    let opponents_hand = opponent[actions[0]];
    let my_hand = me[actions[1]];

    let points = my_hand;

    if (my_hand === opponents_hand) {
      points += 3;
    }
    else if ((my_hand + opponents_hand) === 3) { // Rock vs paper
      points += (my_hand > opponents_hand) ? 6 : 0; // paper is 2, rock is 1, so the highest wins
    }
    else if ((my_hand + opponents_hand) === 4) { // Rock vs scissors
      points += (my_hand < opponents_hand) ? 6 : 0; // rock is 1, scissors is 3, so the lowest wins
    }
    else if ((my_hand + opponents_hand) === 5) { // Scissors vs paper
      points += (my_hand > opponents_hand) ? 6 : 0; // scissors is 3, paper is 2, so the highest wins
    }

    return points;
  });

console.log(list_of_points.reduce((total, points) => total + points, 0));
