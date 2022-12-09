data=$(cat data)

reverse_string () {
  string="$1"
  reverse=""
  for ((i = ${#string} - 1; i >= 0; i--)); do
    reverse="$reverse${string:$i:1}"
  done
  echo "$reverse"
}

points_to_griffindor=""

while read row; do
  open_parenthesis=0
  open_curly=0
  open_square=0
  open_lt=0

  close_parenthesis=0
  close_curly=0
  close_square=0
  close_lt=0

  stack=""
  corrupt_line=""

  for (( i=0; i<${#row}; i++ )); do
    if [[ "${row:$i:1}" == "(" ]]; then
      open_parenthesis=$(( $open_parenthesis + 1 ));
      stack="$stack("
    elif [[ "${row:$i:1}" == "{" ]]; then
      open_curly=$(( $open_curly + 1 ));
      stack="$stack{"
    elif [[ "${row:$i:1}" == "[" ]]; then
      open_square=$(( $open_square + 1 ));
      stack="$stack["
    elif [[ "${row:$i:1}" == "<" ]]; then
      open_lt=$(( $open_lt + 1 ));
      stack="$stack<"
    fi

    if [[ "${row:$i:1}" == ")" ]]; then
      close_parenthesis=$(( $close_parenthesis + 1 ));
      if [[ $open_parenthesis -gt 0 ]]; then
        close_parenthesis=$(( $close_parenthesis - 1 ));
        open_parenthesis=$(( $open_parenthesis - 1 ));
      fi
      if [[ ${stack: -1} == "(" ]]; then
        stack=$(echo "$stack" | sed 's/^\(.*\).\{1\}$/\1/g')
      else
        corrupt_line="${corrupt_line}\nparenthesis"
      fi
    elif [[ "${row:$i:1}" == "}" ]]; then
      close_curly=$(( $close_curly + 1 ));
      if [[ $open_curly -gt 0 ]]; then
        close_curly=$(( $close_curly - 1 ));
        open_curly=$(( $open_curly - 1 ));
      fi
      if [[ ${stack: -1} != "{" ]]; then
        corrupt_line="${corrupt_line}\ncurly"
      fi
      stack=$(echo "$stack" | sed 's/^\(.*\).\{1\}$/\1/g')
    elif [[ "${row:$i:1}" == "]" ]]; then
      close_square=$(( $close_square + 1 ));
      if [[ $open_square -gt 0 ]]; then
        close_square=$(( $close_square - 1 ));
        open_square=$(( $open_square - 1 ));
      fi
      if [[ ${stack: -1} != "[" ]]; then
        corrupt_line="${corrupt_line}\nsquare"
      fi
      stack=$(echo "$stack" | sed 's/^\(.*\).\{1\}$/\1/g')
    elif [[ "${row:$i:1}" == ">" ]]; then
      close_lt=$(( $close_lt + 1 ));
      if [[ $open_lt -gt 0 ]]; then
        close_lt=$(( $close_lt - 1 ));
        open_lt=$(( $open_lt - 1 ));
      fi
      if [[ ${stack: -1} != "<" ]]; then
        corrupt_line="${corrupt_line}\nlt"
      fi
      stack=$(echo "$stack" | sed 's/^\(.*\).\{1\}$/\1/g')
    fi
  done

  if [[ "$corrupt_line" != "" ]]; then
    continue;
  fi

  closing_stack=$(reverse_string "$stack" | tr "[" "]" | tr "{" "}" | tr "<" ">" | tr "(" ")")
  points_row=0

  for (( i=0; i<${#closing_stack}; i++ )); do
    closing_char="${closing_stack:$i:1}"
    points_for_char=$(echo "$closing_char" | tr ")" "1" | tr "]" "2" | tr "}" "3" | tr ">" "4")
    points_row=$(( $points_row * 5 ))
    points_row=$(( $points_row + $points_for_char ))
  done

  points_to_griffindor="$points_to_griffindor\n$points_row"
done <data

points_to_griffindor=$(echo "$points_to_griffindor" | sed '/^\s*$/d')

middle_pointer=""
while IFS= read -r current_points; do

  higher_points=$(echo "$points_to_griffindor" | awk -v limit="$current_points" '{if($1>limit)print$1}' | wc -l | xargs)
  lower_points=$(echo "$points_to_griffindor" | awk -v limit="$current_points" '{if($1<limit)print$1}' | wc -l | xargs)
  if [[ $higher_points -eq $lower_points ]]; then
    middle_pointer=$current_points
  fi
done <<< "$points_to_griffindor"

echo "$middle_pointer POINTS FOR GRIFFINDOR!"
