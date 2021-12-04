bingo_numbers=$(cat data | head -n1)
bingo_blocks=$(cat data | tail -n+2)

sum_of_unmarked() {
  block="$1"
  echo "$block" | sed 's/[*]*//g' | tr "\t\n\r" " " | xargs | sed 's/  */ + /g' | bc
}

check_for_bingo () {

  for column in {0..4}; do 
    offset=$(echo "$column * 3" | bc)
    vertical=$(echo "$bingo_blocks" | pcre2grep -M "^[0-9 *]{$offset}\*\* [0-9 *]*\n[0-9 *]{$offset}\*\* [0-9 *]*\n[0-9 **]{$offset}\*\* [0-9 *]*\n[0-9 *]{$offset}\*\* [0-9 *]*\n[0-9 *]{$offset}\*\*")
    
    if [[ $(echo "$vertical" | wc -l) -eq 5 ]]; then
      sum_of_unmarked "$vertical";
    fi
  done

  horizontal=$(echo "$bingo_blocks" | fgrep '** ** ** ** **' -n)

  if [[ $(echo "$horizontal" | wc -l) -eq 1 && "$horizontal" != "" ]]; then
    line_number=$(echo "$horizontal" | sed 's/\([0-9]*\):.*/\1/g')
    complete_block=$(echo "$bingo_blocks" | sed -n "$(echo "$line_number - 5" | bc),$(echo "$line_number + 5" | bc)p" | pcregrep -M '^$\n[0-9 *\n]{70}')

    sum_of_unmarked "$complete_block"
  fi
}

for bingo_number in ${bingo_numbers//,/ }
do
  if [[ ${#bingo_number} == 1 ]]; then
    bingo_blocks=$(echo "$bingo_blocks" | sed "s/^ $bingo_number/**/g" | sed "s/  $bingo_number/ **/g")
  else
    bingo_blocks=$(echo "$bingo_blocks" | sed "s/$bingo_number/**/g")
  fi

  possible_bingo_sum=$(check_for_bingo)
  if [[ "$possible_bingo_sum" != "" ]]; then
    echo "We have bingo!"
    echo "The sum is $possible_bingo_sum"
    echo "The last mark was $bingo_number"
    break
  fi
done
