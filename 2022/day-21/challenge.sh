#!/bin/bash
input_file="${1:-input}";
monkeys=$(cat "$input_file" | awk '{ print length, $0 }' | sort -n -s | cut -d" " -f2-);

for (( i=1; i <= $(echo "$monkeys" | wc -l | xargs); i++ )); do
  monkey=$(echo "$monkeys" | sed -n "${i}p");

  name=$(echo "$monkey" | cut -d: -f1);
  shout=$(echo "$monkey" | cut -d: -f2 | sed 's/\//\\\//g');

  monkeys=$(echo "$monkeys" | sed "/^${name}/! s/${name}\$*/(${shout})/g");
done

echo "$monkeys" | grep ^root | cut -d: -f2 | bc;
