data=$(curl -b "session=$AOC_SESSION_TOKEN" https://adventofcode.com/2021/leaderboard/private/view/$AOC_LEADERBOARD_ID.json -s)

echo $data | jq -r '.members[] | "\(.local_score) \(.name)"' | sort -rn -k1.2 | sed 's/\([0-9]*\) \([a-zA-Z_ ]*\)/\2\ - \1/g'
