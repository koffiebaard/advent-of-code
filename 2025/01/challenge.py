class Dial:
  def __init__(self):
    self.current_position = 50
    self.zero_count_part_one = 0
    self.zero_count_part_two = 0

  def rotate(self, direction: str) -> None:
    turn = direction[0]
    distance = int(direction[1:])
    sign = "LCR".index(turn) - 1

    new_position = self.current_position + sign * (distance % 100)

    # Part one
    if (new_position == 0 or new_position == 100):
      self.zero_count_part_one += 1

    # Part two
    self.zero_count_part_two += distance // 100

    if distance % 100 > 0:
      if (sign > 0 and new_position >= 100) or (sign < 0 and new_position < 1 and self.current_position > 0):
        self.zero_count_part_two += 1

    self.current_position = (new_position + 100) % 100

dial = Dial()

with open("input") as f:
  for line in f:
    dial.rotate(line.strip())

print(f"Part one: {dial.zero_count_part_one}")
print(f"Part two: {dial.zero_count_part_two}")
