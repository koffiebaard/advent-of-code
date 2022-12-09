bingo_numbers=$(cat data | head -n1)
bingo_blocks=$(cat data | tail -n+2)
bingo_sum=""

sum_of_unmarked() {
  block="$1"
  bingo_sum=$(echo "$block" | sed 's/[*]*//g' | tr "\t\n\r" " " | xargs | sed 's/  */ + /g' | bc)
  echo "$bingo_sum"
}

check_for_bingo () {

  for column in {0..4}; do 
    offset=$(echo "$column * 3" | bc)
    vertical=$(echo "$bingo_blocks" | pcre2grep -m1 -M "^[0-9 *]{$offset}\*\* [0-9 *]*\n[0-9 *]{$offset}\*\* [0-9 *]*\n[0-9 **]{$offset}\*\* [0-9 *]*\n[0-9 *]{$offset}\*\* [0-9 *]*\n[0-9 *]{$offset}\*\*")
    
    if [[ $(echo "$vertical" | wc -l) -eq 5 ]]; then
      sum_of_unmarked "$vertical";
      line_number=$(echo "$bingo_blocks" | pcre2grep --line-offsets -m1 -M "^[0-9 *]{$offset}\*\* [0-9 *]*\n[0-9 *]{$offset}\*\* [0-9 *]*\n[0-9 **]{$offset}\*\* [0-9 *]*\n[0-9 *]{$offset}\*\* [0-9 *]*\n[0-9 *]{$offset}\*\*" | sed 's/\([0-9]*\):.*/\1/g')
      bingo_blocks=$(echo "$bingo_blocks" | sed "$(echo $line_number),$(echo "$line_number + 5" | bc)d")
    fi
  done

  horizontal=$(echo "$bingo_blocks" | fgrep '** ** ** ** **' -n -m1)

  if [[ $(echo "$horizontal" | wc -l) -eq 1 && "$horizontal" != "" ]]; then
  
    line_number=$(echo "$horizontal" | sed 's/\([0-9]*\):.*/\1/g')
    first_line=0

    if [[ "$line_number" != "" && $line_number -gt 5 ]]; then
      first_line=$(echo "$line_number - 5" | bc)
    fi
    rough_block=$(echo "$bingo_blocks" | sed -n "$(echo "$first_line"),$(echo "$line_number + 5" | bc)p")
    complete_block=$(echo "$rough_block" | pcregrep -M '^$\n[0-9 *]{14}\n[0-9 *]{14}\n[0-9 *]{14}\n[0-9 *]{14}\n[0-9 *]{14}')
    
    if [[ $(echo "$complete_block" | wc -l) -eq 5 ]]; then
      sum_of_unmarked "$complete_block"
    fi

    bingo_blocks=$(echo "$bingo_blocks" | sed "$(echo $line_number),$(echo "$line_number")d")
  fi
}

for bingo_number in ${bingo_numbers//,/ }
do
  if [[ ${#bingo_number} == 1 ]]; then
    bingo_blocks=$(echo "$bingo_blocks" | sed "s/^ $bingo_number/**/g" | sed "s/  $bingo_number/ **/g")
  else
    bingo_blocks=$(echo "$bingo_blocks" | sed "s/$bingo_number/**/g")
  fi
  
  check_for_bingo
  if [[ "$bingo_sum" != "" ]]; then
    echo "We have bingo!"
    echo "The sum is $bingo_sum"
    echo "The last mark was $bingo_number"
  fi
  bingo_sum=""
done
