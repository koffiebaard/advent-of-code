
fishies=$(cat data)

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
  offset=$1

  query=$(calculate_offset $offset)
  echo "$fishies" | sed "s/^$query\([0-9]\{1\}\).*/\1/g"
}

update_character_at_offset () {
  new_character=$1
  offset=$2

  query=$(calculate_offset $offset)
  fishies=$(echo "$fishies" | sed "s/^\($query\)./\1${new_character}/g")
}

for day in {1..80}; do
  nr_new_fishies=$(echo "$fishies" | tr "," "\n" | grep 0 | wc -l);

  fishies=$(echo "$fishies" | sed '/0/ s//9/g')
  fishies=$(echo "$fishies" | sed '/1/ s//0/g')
  fishies=$(echo "$fishies" | sed '/2/ s//1/g')
  fishies=$(echo "$fishies" | sed '/3/ s//2/g')
  fishies=$(echo "$fishies" | sed '/4/ s//3/g')
  fishies=$(echo "$fishies" | sed '/5/ s//4/g')
  fishies=$(echo "$fishies" | sed '/6/ s//5/g')
  fishies=$(echo "$fishies" | sed '/7/ s//6/g')
  fishies=$(echo "$fishies" | sed '/8/ s//7/g')
  fishies=$(echo "$fishies" | sed '/9/ s//6/g')


  if [[ $nr_new_fishies -gt 0 ]]; then
    new_fishies=$(printf ',8%.0s' $(seq 1 $nr_new_fishies))
    fishies="$fishies$new_fishies"
  fi
  echo "processing day $day"
done

number_of_fishies=$(echo "$fishies" | tr "," "\n" | wc -l)
echo "There are $number_of_fishies fishies after 80 days"
