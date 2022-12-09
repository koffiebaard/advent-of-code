use std::fs;

fn main() {
  let mut points: u64 = 0;
  let rucksacks = fs::read_to_string("input").expect("Unable to read file");

  for rucksack in rucksacks.lines() {
    let component1 = &rucksack[0..rucksack.chars().count() / 2];
    let component2 = &rucksack[rucksack.chars().count() / 2..];

    let result = component1.chars().find(|&x| component2.contains(x));

    if result.unwrap() == result.unwrap().to_uppercase().collect::<Vec<_>>()[0] {
      points += u64::from(result.unwrap() as u8) - 38;
    }
    else {
      points += u64::from(result.unwrap() as u8) - 96;
    }
  }

  println!("{}", points);
}
