sum=""
previous_sum=""
number_of_woots=0

while read woot; do
  sum=$(echo "$sum,$woot" | sed 's/.*,\([0-9]*\),\([0-9]*\),\([0-9]*\)/\1,\2,\3/g')

  if [[ $(echo $sum | egrep -o '[0-9]+' | wc -l) -eq 3 && $(echo $previous_sum | egrep -o '[0-9]+' | wc -l) -eq 3 ]]; then
    if [[ $(echo $sum | tr ',' '+' | bc) -gt $(echo $previous_sum | tr ',' '+' | bc) ]]; then
      number_of_woots=$((number_of_woots+1))
    fi
  fi

  previous_sum=$sum
done <challenge_data

echo $number_of_woots
