digit1=$(cat data | sed 's/[a-z ]* \|\([0-9 ]*\)/\1/g' | sed 's/^ //g' | tr "\n" " " | tr " " "\n" | awk 'length($0)==2' | wc -l)
digit4=$(cat data | sed 's/[a-z ]* \|\([0-9 ]*\)/\1/g' | sed 's/^ //g' | tr "\n" " " | tr " " "\n" | awk 'length($0)==4' | wc -l)
digit7=$(cat data | sed 's/[a-z ]* \|\([0-9 ]*\)/\1/g' | sed 's/^ //g' | tr "\n" " " | tr " " "\n" | awk 'length($0)==3' | wc -l)
digit8=$(cat data | sed 's/[a-z ]* \|\([0-9 ]*\)/\1/g' | sed 's/^ //g' | tr "\n" " " | tr " " "\n" | awk 'length($0)==7' | wc -l)

echo "$digit1 + $digit4 + $digit7 + $digit8" | bc
