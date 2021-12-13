grid=$(cat data | egrep -v '^fold' | sed '/^\s*$/d')
moves=$(cat data | egrep -v '^[0-9]' | sed '/^\s*$/d' | awk '{print $3}')

calculate_offset () {
  offset=$1

  query="[\.# ]\{$offset\}"

  if [[ $offset -gt 250 ]]; then
    last_offset=$offset
    query=""

    regex_chunks=25
    if [[ $offset -gt 25000 ]]; then
      regex_chunks=230
    elif [[ $offset -gt 12000 ]]; then
      regex_chunks=100
    elif [[ $offset -gt 6000 ]]; then
      regex_chunks=50
    fi

    for index in $(seq 1 $regex_chunks); do
      current_offset=$(echo "$offset / $regex_chunks" | bc)
      query="$query[\.# ]\{$current_offset\}"
      last_offset=$(echo "$last_offset - $current_offset" | bc)
    done
    query="$query[\.# ]\{$last_offset\}"
  fi
  echo "$query"
}

update_character_at_offset () {
  new_character=$1
  offset_line=$(($2 + 1))
  offset_char=$3

  query=$(calculate_offset $offset_char)
  draw_grid=$(echo "$draw_grid" | sed "${offset_line}s/^\($query\)./\1${new_character}/g")
}

while IFS= read -r move; do
  new_grid=""
  move_axis="${move:0:1}"
  move_line=$(echo $move | sed 's/[x,y]*=//g')

  while IFS= read -r line; do
    x=$(echo "$line" | sed 's/,[0-9]*//g');
    y=$(echo "$line" | sed 's/[0-9]*,//g');

    if [[ "$move_axis" == "y" && $y -gt $move_line ]]; then
      difference=$(( $y - $move_line ));
      y=$(( $move_line - $difference ));
    fi
    
    if [[ "$move_axis" == "x" && $x -lt $move_line ]]; then
      x=$(( $move_line - $x -1 ));
    elif [[ "$move_axis" == "x" && $x -gt $move_line ]]; then
      x=$(( $x - $move_line -1 ));
    fi

    new_grid="$new_grid\n$x,$y"
  done <<< "$grid"

  grid=$(echo "$new_grid" | sed '/^\s*$/d' | sort -n | uniq);
done <<< "$moves"

line=""
for bleep in {1..42}; do
  line="$line "
done

draw_grid="$line\n$line\n$line\n$line\n$line\n$line"

while IFS= read -r line; do
  x=$(echo "$line" | sed 's/,[0-9]*//g');
  y=$(echo "$line" | sed 's/[0-9]*,//g');
  update_character_at_offset "#" "$y" "$x"
done <<< "$grid"

echo "$draw_grid"
