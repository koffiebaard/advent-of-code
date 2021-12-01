previous_woot=0
number_of_woots=0

while read woot; do
  
  if [[ $previous_woot != 0 && $woot -gt $previous_woot ]]; then
    number_of_woots=$((number_of_woots+1))
  fi

  previous_woot=$woot
done <challenge_data

echo $number_of_woots
