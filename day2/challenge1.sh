cake_position=0
cake_depth=0

while read cake; do
  coord_change=$(echo $cake | sed 's/[a-z]* //g')

  if [[ $(echo $cake | egrep '^forward ' | wc -l) -eq 1 ]]; then
    cake_position=$(echo "$cake_position + $coord_change" | bc)
  fi
  
  if [[ $(echo $cake | egrep '^down ' | wc -l) -eq 1 ]]; then
    cake_depth=$(echo "$cake_depth + $coord_change" | bc)
  fi
  
  if [[ $(echo $cake | egrep '^up ' | wc -l) -eq 1 ]]; then
    cake_depth=$(echo "$cake_depth - $coord_change" | bc)
  fi
  
done <challenge_data

echo position: $cake_position
echo depth: $cake_depth
echo "$cake_position * $cake_depth" | bc
