oxygen_rate=""
scrubber_rate=""

data=$(cat data)

for index in {0..11}
do
  zero_data=$(echo "$data" | egrep "^[0-9]{$index}0")
  one_data=$(echo "$data" | egrep "^[0-9]{$index}1")

  zero_count=$(echo "$zero_data" | wc -l | xargs)
  one_count=$(echo "$one_data" | wc -l | xargs)

  if [[ $zero_count -gt $one_count ]]; then
    data="$zero_data"
  elif [[ $zero_count -eq $one_count ]]; then
    data="$one_data"
  else
    data="$one_data"
  fi

  if [[ $(echo "$data" | wc -l) -eq 1 ]]; then
    oxygen_rate="$data"
    break;
  fi
done

echo "oxygen_rate is $oxygen_rate"
echo "-> in decimal: $((2#$oxygen_rate))"


data=$(cat data)

for index in {0..11}
do
  zero_data=$(echo "$data" | egrep "^[0-9]{$index}0")
  one_data=$(echo "$data" | egrep "^[0-9]{$index}1")

  zero_count=$(echo "$zero_data" | wc -l | xargs)
  one_count=$(echo "$one_data" | wc -l | xargs)

  if [[ $zero_count -gt $one_count ]]; then
    data="$one_data"
  elif [[ $zero_count -eq $one_count ]]; then
    data="$zero_data"
  else
    data="$zero_data"
  fi

  if [[ $(echo "$data" | wc -l) -eq 1 ]]; then
    scrubber_rate="$data"
    break;
  fi
done

echo "scrubber_rate: $scrubber_rate"
echo "-> in decimal: $((2#$scrubber_rate))"
