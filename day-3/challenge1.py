with open('input') as file:
  rucksacks = file.read().splitlines()
  points = 0

  for rucksack in rucksacks:
    component1 = rucksack[:len(rucksack)//2]
    component2 = rucksack[len(rucksack)//2:]

    item = set(component1).intersection(component2).pop()
    points += ord(item) - (38 if (item == item.upper()) else 96)

print(points)
