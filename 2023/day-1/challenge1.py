import re

with open('input') as file:
  challenge = file.read()

  numbers = re.findall(r"[a-z]*(\d?).*(\d{1})[a-z]*", challenge)

  numbers_per_row = list(map(lambda n: int(n[0] + n[1] if n[0] is not "" else n[1] + n[1]), numbers))

  sum(numbers_per_row)
