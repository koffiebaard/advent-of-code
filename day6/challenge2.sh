
fishies=$(cat data)

num_fishies_0=$(echo "$fishies" | tr "," "\n" | grep 0 | wc -l | xargs)
num_fishies_1=$(echo "$fishies" | tr "," "\n" | grep 1 | wc -l | xargs)
num_fishies_2=$(echo "$fishies" | tr "," "\n" | grep 2 | wc -l | xargs)
num_fishies_3=$(echo "$fishies" | tr "," "\n" | grep 3 | wc -l | xargs)
num_fishies_4=$(echo "$fishies" | tr "," "\n" | grep 4 | wc -l | xargs)
num_fishies_5=$(echo "$fishies" | tr "," "\n" | grep 5 | wc -l | xargs)
num_fishies_6=$(echo "$fishies" | tr "," "\n" | grep 6 | wc -l | xargs)
num_fishies_7=$(echo "$fishies" | tr "," "\n" | grep 7 | wc -l | xargs)
num_fishies_8=$(echo "$fishies" | tr "," "\n" | grep 8 | wc -l | xargs)

for day in {1..256}; do
  add_fishies=0
  if [[ $num_fishies_0 -gt 0 ]]; then
    add_fishies=$num_fishies_0
  fi

  num_fishies_0=$num_fishies_1
  num_fishies_1=$num_fishies_2
  num_fishies_2=$num_fishies_3
  num_fishies_3=$num_fishies_4
  num_fishies_4=$num_fishies_5
  num_fishies_5=$num_fishies_6
  num_fishies_6=$num_fishies_7
  num_fishies_7=$num_fishies_8
  num_fishies_8=0

  if [[ $add_fishies -gt 0 ]]; then
    num_fishies_6=$(echo "$num_fishies_6 + $add_fishies" | bc)
    num_fishies_8=$(echo "$num_fishies_8 + $add_fishies" | bc)
  fi

  echo "processing day $day"
done

number_of_fishies=$(echo "$num_fishies_0 + $num_fishies_1 + $num_fishies_2 + $num_fishies_3 + $num_fishies_4 + $num_fishies_5 + $num_fishies_6 + $num_fishies_7 + $num_fishies_8" | bc)
echo "There are $number_of_fishies fishies after 256 days"
