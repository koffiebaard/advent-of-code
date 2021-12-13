grid=$(cat data | egrep -v '^fold' | sed '/^\s*$/d')
first_move=$(cat data | egrep -v '^[0-9]' | sed '/^\s*$/d' | awk '{print $3}' | head -n1)
first_move_axis="${first_move:0:1}"
first_move_line=$(echo $first_move | sed 's/[x,y]*=//g')

new_grid=""
while IFS= read -r line; do
  x=$(echo "$line" | sed 's/,[0-9]*//g');
  y=$(echo "$line" | sed 's/[0-9]*,//g');

  if [[ $first_move_axis == "y" && $y -gt $first_move_line ]]; then
    difference=$(( $y - $first_move_line ));
    y=$(( $first_move_line - $difference ))
  elif [[ $first_move_axis == "x" && $x -lt $first_move_line ]]; then
    difference=$(( $first_move_line - $x ));
    x=$(( $first_move_line + $difference ))
  fi
  new_grid="$new_grid\n$x,$y"
done <<< "$grid"

echo "$new_grid" | sed '/^\s*$/d' | sort -n | uniq | wc -l
