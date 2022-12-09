crabbies=$(cat data)
fuelies=""

for optimal_move in $(seq 310 340); do
  fuel_spent_total=0
  for crabby in ${crabbies//,/ }; do
    fuel_spent_crabby=$(echo "$crabby - $optimal_move" | bc)
    fuel_spent_crabby=${fuel_spent_crabby#-}
    fuel_spent_total=$(echo "$fuel_spent_total + $fuel_spent_crabby" | bc)
  done
  fuelies="$fuelies\n$fuel_spent_total"
  echo "Spent $fuel_spent_total on moving crabs to $optimal_move"
done

bestest_fuely=$(echo "$fuelies" | sed '/^$/d' | sort -n | head -n1)
echo "done. lets move to $bestest_fuely"
