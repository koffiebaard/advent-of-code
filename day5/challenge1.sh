board=""

create_board () {
  highest_x1=$(cat data | awk '{print $1}' | sed 's/\([0-9]\),.*/\1/g' | sort -n | tail -n1)
  highest_x2=$(cat data | awk '{print $1}' | sed 's/[0-9]*,\([0-9]\)/\1/g' | sort -n | tail -n1)
  
  highest_y1=$(cat data | awk '{print $3}' | sed 's/\([0-9]\),.*/\1/g' | sort -n | tail -n1)
  highest_y2=$(cat data | awk '{print $3}' | sed 's/[0-9]*,\([0-9]\)/\1/g' | sort -n | tail -n1)

  board_size=$(echo "$highest_x1\n$highest_x2\n$highest_y1\n$highest_y2" | sort -n | tail -n1)
  for index in $(seq 1 $board_size); do
    board="${board}$(printf '0%.0s' $(seq 1 $board_size))\n"
  done
}

plot_on_board () {
  x="$1"
  y=$(echo "$2 + 1" | bc)
  
  x_offset_1=$x
  x_offset_2=0
  x_offset_3=0
  x_offset_4=0

  if [[ $x -gt 250 ]]; then
    x_offset_1=$(echo "$x / 4" | bc)
    x_offset_2=$(echo "$x / 4" | bc)
    x_offset_3=$(echo "$x / 4" | bc)
    x_offset_4=$(echo "$x - $x_offset_1 - $x_offset_2 - $x_offset_3" | bc)
  fi

  old_number=$(echo "$board" | sed "${y}q;d" | sed "s/^[0-9]\{$x_offset_1\}[0-9]\{$x_offset_2\}[0-9]\{$x_offset_3\}[0-9]\{$x_offset_4\}\([0-9]\{1\}\).*/\1/g")
  
  new_number=$(echo "$old_number + 1" | bc)
  if [[ $new_number -gt 9 ]]; then
    new_number=9
  fi

  board=$(echo "$board" | sed "${y}s/^\([0-9]\{$x_offset_1\}[0-9]\{$x_offset_2\}[0-9]\{$x_offset_3\}[0-9]\{$x_offset_4\}\)./\1${new_number}/g")
}

create_board

while read coords; do
  first_coords=$(echo "$coords" | awk '{print $1}')
  second_coords=$(echo "$coords" | awk '{print $3}')

  x1=$(echo "$first_coords" | sed 's/\([0-9]\),.*/\1/g')
  y1=$(echo "$first_coords" | sed 's/[0-9]*,\([0-9]\)/\1/g')
  x2=$(echo "$second_coords" | sed 's/\([0-9]\),.*/\1/g')
  y2=$(echo "$second_coords" | sed 's/[0-9]*,\([0-9]\)/\1/g')

  for index_y in $(seq $y1 $y2); do
    for index_x in $(seq $x1 $x2); do
      plot_on_board $index_x $index_y
    done
  done
done <data

echo "$board"

echo "$board" | sed 's/0//g' | sed 's/1//g' | tr -d "\n" | sed 's/\(.\)/\1\'$' \+ /g'
echo "-------------------------"
echo "$board" | sed 's/0//g' | sed 's/1//g' | wc -l
