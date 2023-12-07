import re

mapping = {
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
}

def add_numbers(num1: str, num2: str) -> int:
  clean_num1 = mapping[num1] if num1 in mapping else num1
  clean_num2 = mapping[num2] if num2 in mapping else num2

  return int(clean_num1 + clean_num2)


with open('input') as file:
  numbers = [re.findall(r"(?=(one|two|three|four|five|six|seven|eight|nine|\d))", line) for line in file]
  numbers_per_row = list(map(lambda n: add_numbers(n[0], n[-1]), numbers))
  
  print(sum(numbers_per_row))
