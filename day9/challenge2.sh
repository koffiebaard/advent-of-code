heightmap=$(cat data);

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

fetch_numbers_left() {
  data=$1
  line=$2
  offset=$3
  echo "$data" | sed -n "${line}p" | sed "s/\([0-9]\{$offset\}\)\([0-9]\{1\}\)[0-9]*/\1/g" | sed 's/.*9\([0-8]*\)$/\1/g'
}

fetch_numbers_right () {
  data=$1
  line=$2
  offset=$3
  echo "$data" | sed -n "${line}p" | sed "s/[0-9]\{$offset\}\([0-9]\{1\}\)\([0-8]*\)9*.*/\2/g"
}

fetch_numbers_top () {
  data=$1
  line=$(($2 - 1))
  offset=$3
  echo "$data" | pcre2grep -M "^[0-9]{$offset}[0-9]{1}.*\n" | sed "s/[0-9]\{$offset\}\([0-9]\{1\}\).*/\1/g" | tr -d "\n" | sed "s/\([0-9]\{$line\}\)\([0-8]\{1\}\)[0-9]*/\1/g" | sed 's/.*9\([0-8]*\)$/\1/g'
}

fetch_numbers_bottom () {
  data=$1
  line=$(($2 - 1))
  offset=$3
  echo "$data" | pcre2grep -M "^[0-9]{$offset}[0-9]{1}.*\n" | sed "s/[0-9]\{$offset\}\([0-9]\{1\}\).*/\1/g" | tr -d "\n" | sed "s/[0-9]\{$line\}\([0-9]\{1\}\)\([0-8]*\)9*.*/\2/g"
}

fetch_basin () {
  data=$1
  line=$2
  offset=$3

  numbers_left=$(fetch_numbers_left "$data" $line $offset)
  current_offset=$offset
  for (( i=0; i < ${#numbers_left}; i++ )); do
    current_number="${numbers_left:$i:1}"
    current_offset=$(($current_offset - 1))
    current_entry="$line.$current_offset left"

    if [[ $(echo "$current_basin" | grep "$current_entry" | wc -l) -eq 0 ]]; then
      current_basin="$current_basin\n$current_entry"

      fetch_basin "$heightmap" $line $current_offset
    fi
  done

  numbers_right=$(fetch_numbers_right "$data" $line $offset)
  current_offset=$offset
  for (( i=0; i < ${#numbers_right}; i++ )); do
    current_number="${numbers_right:$i:1}"
    current_offset=$(($current_offset + 1))
    current_entry="$line.$current_offset right"

    if [[ $(echo "$current_basin" | grep "$current_entry" | wc -l) -eq 0 ]]; then
      current_basin="$current_basin\n$current_entry"

      fetch_basin "$heightmap" $line $current_offset
    fi
  done

  numbers_top=$(fetch_numbers_top "$data" $line $offset)
  current_line=$line
  for (( i=0; i < ${#numbers_top}; i++ )); do
    current_number="${numbers_top:$i:1}"
    current_line=$(($current_line - 1))
    current_entry="$current_line.$offset top"
    
    if [[ $(echo "$current_basin" | grep "$current_entry" | wc -l) -eq 0 ]]; then
      current_basin="$current_basin\n$current_entry"
    
      fetch_basin "$heightmap" $current_line $offset
    fi
  done

  numbers_bottom=$(fetch_numbers_bottom "$data" $line $offset)
  current_line=$line
  for (( i=0; i < ${#numbers_bottom}; i++ )); do
    current_number="${numbers_bottom:$i:1}"
    current_line=$(($current_line + 1))
    current_entry="$current_line.$offset bottom"
    
    if [[ $(echo "$current_basin" | grep "$current_entry" | wc -l) -eq 0 ]]; then
      current_basin="$current_basin\n$current_entry"

      fetch_basin "$heightmap" $current_line $offset
    fi
  done
}

current_line_woot=1
basin_sizes=""
while IFS= read -r heightmap_row; do
  row_length=${#heightmap_row};

  for index in $(seq 0 $(($row_length - 1))); do

    current=$(get_character_at_offset "$heightmap" $current_line_woot $index 2>/dev/null | sed "s/[0-9]\{$row_length\}//g")
    left=$(get_character_at_offset "$heightmap" $current_line_woot $(($index - 1)) 2>/dev/null | sed "s/[0-9]\{$row_length\}//g")
    right=$(get_character_at_offset "$heightmap" $current_line_woot $(($index + 1)) 2>/dev/null | sed "s/[0-9]\{$row_length\}//g")
    top=$(get_character_at_offset "$heightmap" $(($current_line_woot - 1)) $index 2>/dev/null | sed "s/[0-9]\{$row_length\}//g")
    bottom=$(get_character_at_offset "$heightmap" $(($current_line_woot + 1)) $index 2>/dev/null | sed "s/[0-9]\{$row_length\}//g")

    lowest_character=$(echo "$left\n$right\n$top\n$bottom" | sed '/^\s*$/d' | sort -n | head -n1);

    if [[ $current -lt $lowest_character ]]; then
      current_basin=""
      fetch_basin "$heightmap" $current_line_woot $index
      basin_size=$(echo "$current_basin" | sed '/^\s*$/d' | awk '{print $1}' | sort -n | uniq | wc -l)
      basin_size=$(($basin_size + 1))
      echo "($current_line_woot, $index) Lowest character found! It is $current, with a basin size of $basin_size"

      basin_sizes="$basin_sizes\n$basin_size"
    fi
  done
  current_line_woot=$(($current_line_woot + 1));
done <<< "$heightmap"

top_three=$(echo "$basin_sizes" | sed '/^\s*$/d' | sort -n | tail -n3)
echo "$top_three"
