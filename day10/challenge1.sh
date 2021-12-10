data=$(cat data)

points_to_griffindor=0

while read row; do
  stack=""
  which_char_wins=""

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
      if [[ ${stack: -1} == "(" ]]; then
        stack=$(echo "$stack" | sed 's/^\(.*\).\{1\}$/\1/g')
      else
        which_char_wins="${which_char_wins}\nparenthesis"
      fi
    elif [[ "${row:$i:1}" == "}" ]]; then
      if [[ ${stack: -1} != "{" ]]; then
        which_char_wins="${which_char_wins}\ncurly"
      fi
      stack=$(echo "$stack" | sed 's/^\(.*\).\{1\}$/\1/g')
    elif [[ "${row:$i:1}" == "]" ]]; then
      if [[ ${stack: -1} != "[" ]]; then
        which_char_wins="${which_char_wins}\nsquare"
      fi
      stack=$(echo "$stack" | sed 's/^\(.*\).\{1\}$/\1/g')
    elif [[ "${row:$i:1}" == ">" ]]; then
      if [[ ${stack: -1} != "<" ]]; then
        which_char_wins="${which_char_wins}\nlt"
      fi
      stack=$(echo "$stack" | sed 's/^\(.*\).\{1\}$/\1/g')
    fi
  done

  winner=$(echo "$which_char_wins" | sed '/^\s*$/d' | head -n1);
  if [[ "$winner" != "" ]]; then
    points_row=$(echo "$winner" | sed 's/parenthesis/3/g' | sed 's/square/57/g' | sed 's/curly/1197/g' | sed 's/lt/25137/g')
    points_to_griffindor=$(( $points_to_griffindor + $points_row ))
    echo "winner is $winner with $amount_of_brackets brackets and $points_row points"
  fi
done <data

echo "$points_to_griffindor POINTS FOR GRIFFINDOR!"
