crabbies=$(cat data)
fuelies=""

calculate_fuel () {
  moves=$1
  fuel_spent=$(echo "$moves * ( $moves + 1) / 2" | bc)
  echo $fuel_spent
}

for optimal_move in $(seq 470 475); do

  fuel_spent_total=0
  for crabby in ${crabbies//,/ }; do
    moves_for_crabby=$(echo "$crabby - $optimal_move" | bc)
    moves_for_crabby=${moves_for_crabby#-}
    fuel_spent_crabby=$(calculate_fuel $moves_for_crabby)
    fuel_spent_total=$(echo "$fuel_spent_total + $fuel_spent_crabby" | bc)
  done
  fuelies="$fuelies\n$fuel_spent_total"
  echo "Spent $fuel_spent_total on moving crabs to $optimal_move"
done

bestest_fuely=$(echo "$fuelies" | sed '/^$/d' | sort -n | head -n1)
echo "done. lets move to $bestest_fuely"
