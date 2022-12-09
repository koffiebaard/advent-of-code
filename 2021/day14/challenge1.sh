polymer=$(cat data | head -n1)
insertions=$(cat data | tail -n +3)

insert_at_offset () {
  text="$1"
  insert="$2"
  offset=$3
  text="${text:0:offset}${insert}${text:offset}"
  echo "$text"
}

for round in $(seq 1 10); do
  for (( i=0; i<${#polymer}; i++ )); do
    current_polymer="${polymer:$i:2}"
    match_on_insertion=$(echo "$insertions" | egrep "^$current_polymer ");
    if [[ $(echo "$match_on_insertion" | xargs | wc -l) -eq 1 ]]; then
      character_to_insert=$(echo "$match_on_insertion" | sed 's/[A-Z]* -> //g')
      polymer=$(insert_at_offset "$polymer" $character_to_insert $(($i + 1)));
      i=$(($i + 1))
    fi
  done
done

echo "$polymer"

polymer_counts=""

for (( i=0; i<${#polymer}; i++ )); do
  current_polymer="${polymer:$i:1}"

  already_counted=$(echo "$polymer_counts" | egrep "^$current_polymer " | xargs | wc -l);
  if [[ $already_counted -eq 0 ]]; then
    polymer_count=$(echo "$polymer" | grep -o "$current_polymer" | wc -l | xargs)
    polymer_counts="${polymer_counts}\n$current_polymer $polymer_count"
  fi
done

lowest=$(echo "$polymer_counts" | sed '/^\s*$/d' | awk '{print $2}' | sort -n | head -n1);
highest=$(echo "$polymer_counts" | sed '/^\s*$/d' | awk '{print $2}' | sort -n | tail -n1);

echo $(( $highest - $lowest ));
