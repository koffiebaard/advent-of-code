gamma_rate=""
epsilon_rate=""

for index in {1..12}
do
  zero=$(awk -v turboindex="$index" '{print substr($0,turboindex, 1)}' data | grep 0 | wc -l | xargs)
  one=$(awk -v turboindex="$index" '{print substr($0,turboindex, 1)}' data | grep 1 | wc -l | xargs)

  if [[ $zero -gt $one ]]; then
    gamma_rate+="0"
    epsilon_rate+="1"
  else
    gamma_rate+="1"
    epsilon_rate+="0"
  fi
done

echo "gamma_rate: $gamma_rate"
echo "-> in decimal: $((2#$gamma_rate))"
echo "epsilon_rate: $epsilon_rate"
echo "-> in decimal: $((2#$epsilon_rate))"
