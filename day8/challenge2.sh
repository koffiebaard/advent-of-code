intersect () {
  echo "${1}${2}" | sed 's/\(.\)/\1\n/g' | sort -n | uniq -d | wc -l
}

actual_digits=""
while read row; do
  signal_patterns=$(echo "$row" | sed 's/\([a-z ]*\) \| .*/\1/g')
  digits=$(echo "$row" | sed 's/[a-z ]* \| \([0-9 ]*\)/\1/g')

  one=$(echo "$signal_patterns" | tr " " "\n" | awk 'length($0)==2')
  four=$(echo "$signal_patterns" | tr " " "\n" | awk 'length($0)==4')
  seven=$(echo "$signal_patterns" | tr " " "\n" | awk 'length($0)==3')
  eight=$(echo "$signal_patterns" | tr " " "\n" | awk 'length($0)==7')

  for pattern in ${signal_patterns//,/ }; do
    if [[ ${#pattern} -eq 5 && $(intersect "$pattern" "$four") -eq 2 ]]; then
      two="$pattern"
    elif [[ ${#pattern} -eq 5 && $(intersect "$pattern" "$one") -eq 2 ]]; then
      three="$pattern"
    elif [[ ${#pattern} -eq 5 && $(intersect "$pattern" "$one") -eq 1 && $(intersect "$pattern" "$four") -eq 3 ]]; then
      five="$pattern"
    elif [[ ${#pattern} -eq 6 && $(intersect "$pattern" "$one") -eq 1 ]]; then
      six="$pattern"
    elif [[ ${#pattern} -eq 6 && $(intersect "$pattern" "$four") -eq 3 && $(intersect "$pattern" "$one") -eq 2 ]]; then
      zero="$pattern"
    elif [[ ${#pattern} -eq 6 && $(intersect "$pattern" "$four") -eq 4 ]]; then
      nine="$pattern"
    fi
  done

  actual_digit=""
  for digit in ${digits//,/ }; do
    if [[ ${#digit} -eq 2 ]]; then
      actual_digit_segment="1"
    elif [[ ${#digit} -eq 5 && $(intersect "$digit" "$two") -eq 5 ]]; then
      actual_digit_segment="2"
    elif [[ ${#digit} -eq 5 && $(intersect "$digit" "$three") -eq 5 ]]; then
      actual_digit_segment="3"
    elif [[ ${#digit} -eq 4 ]]; then
      actual_digit_segment="4"
    elif [[ ${#digit} -eq 5 && $(intersect "$digit" "$five") -eq 5 ]]; then
      actual_digit_segment="5"
    elif [[ ${#digit} -eq 6 && $(intersect "$digit" "$six") -eq 6 ]]; then
      actual_digit_segment="6"
    elif [[ ${#digit} -eq 3 ]]; then
      actual_digit_segment="7"
    elif [[ ${#digit} -eq 7 ]]; then
      actual_digit_segment="8"
    elif [[ ${#digit} -eq 6 && $(intersect "$digit" "$nine") -eq 6 ]]; then
      actual_digit_segment="9"
    elif [[ ${#digit} -eq 6 && $(intersect "$digit" "$zero") -eq 6 ]]; then
      actual_digit_segment="0"
    fi
    actual_digit="${actual_digit}${actual_digit_segment}"
  done

  actual_digits="${actual_digits}\n${actual_digit}"
done <data

sum=$(echo "$actual_digits" | sed -r '/^\s*$/d' | awk '{s+=$1} END {print s}')
echo "the sum of all things is $sum"
