heightmap=$(cat data);
# heightmap=$(cat <<-END
# 2199943210
# 3987894921
# 9856789892
# 8767896789
# 9899965678
# END
# )

calculate_offset () {
  offset=$1

  query="[0-9,]\{$offset\}"

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
      query="$query[0-9,]\{$current_offset\}"
      last_offset=$(echo "$last_offset - $current_offset" | bc)
    done
    query="$query[0-9,]\{$last_offset\}"
  fi
  echo "$query"
}

get_character_at_offset () {
  data=$1
  line=$2
  offset=$3

  query=$(calculate_offset $offset)
  echo "$data" | sed -n "${line}p" | sed "s/^$query\([0-9]\{1\}\).*/\1/g"
}

current_line=1
sum=0
while IFS= read -r heightmap_row; do
  row_length=${#heightmap_row};

  for index in $(seq 0 $(($row_length - 1))); do

    current=$(get_character_at_offset "$heightmap" $current_line $index 2>/dev/null | sed "s/[0-9]\{$row_length\}//g")
    left=$(get_character_at_offset "$heightmap" $current_line $(($index - 1)) 2>/dev/null | sed "s/[0-9]\{$row_length\}//g")
    right=$(get_character_at_offset "$heightmap" $current_line $(($index + 1)) 2>/dev/null | sed "s/[0-9]\{$row_length\}//g")
    top=$(get_character_at_offset "$heightmap" $(($current_line - 1)) $index 2>/dev/null | sed "s/[0-9]\{$row_length\}//g")
    bottom=$(get_character_at_offset "$heightmap" $(($current_line + 1)) $index 2>/dev/null | sed "s/[0-9]\{$row_length\}//g")

    lowest_character=$(echo "$left\n$right\n$top\n$bottom" | sed '/^\s*$/d' | sort -n | head -n1);

    if [[ $current -lt $lowest_character ]]; then
      echo "($current_line, $index) Lowest character found! It is $current"
      sum=$(( $sum + $current + 1 ))
    fi
  done
  current_line=$(($current_line + 1));
done <<< "$heightmap"

echo "The sum is $sum"
