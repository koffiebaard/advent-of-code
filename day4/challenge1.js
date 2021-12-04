var fs = require('fs');
let raw_data = fs.readFileSync('data').toString();

bingo_numbers = raw_data.split('\n')[0].split(',');
bingo_boards = raw_data.split('\n\n').splice(1);

bingo_boards = bingo_boards.map(board => {
  return board.split('\n').map(numbers => {
    return numbers.split(' ').filter(number => {
      return number !== "";
    });
  });
})

function mark(mark_number) {
  bingo_boards = bingo_boards.map(board => {
    return board.map(rows => {
      return rows.map(number => {
        return number == mark_number ? '**' : number; 
      });
    });
  });
}

function board_sum(board) {
  sum = 0;
  board.map(row => {
    row.map(number => {
      if (isNaN(number) === false)
        sum += parseInt(number);
    });
  });
  
  return sum;
}

function bingo() {
  bingo_having_board = null;

  bingo_boards.map(board => {
    board.map(row => {
      if (row.length == 5 && row.every(number => { return number === '**'; }) === true) {
        if (bingo_having_board == null) {
          bingo_having_board = board;
        }
      }
    });

    for (index = 0; index < board[0].length; index++) {
      got_bingo = true;
      board.forEach(rows => { if (rows[index] != '**') got_bingo = false; });
      if (got_bingo == true && bingo_having_board == null) {
        bingo_having_board = board;
      }
    }
  });

  return bingo_having_board;
}

bingo_numbers.every(bingo_number => {
  mark(bingo_number);
  board_with_bingo = bingo();
   
  if (board_with_bingo) {
    console.log('BINGO');
    console.log(`The sum of the board is ${board_sum(board_with_bingo)}`);
    console.log(`The last mark was ${bingo_number}`);
    console.log(board_with_bingo);
    return false;
  };
  return true;
});
