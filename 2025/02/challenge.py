import sys

input_file = "input_example" if len(sys.argv) > 1 else "input"

def part_one(data):
  product_id_ranges = data.split(",")
  product_id_sum = 0

  for product_id_range in product_id_ranges:
    id_start, id_end = map(int, product_id_range.split("-"))

    for product_id in range(id_start, id_end + 1):
      product_id_str = str(product_id)
      product_id_len = len(product_id_str)

      if product_id_len % 2 != 0:
        continue

      if product_id_str[: product_id_len // 2] * 2 == product_id_str:
        product_id_sum += product_id

  return product_id_sum

def part_two(data):
  product_id_ranges = data.split(",")
  product_id_sum = 0

  for product_id_range in product_id_ranges:
    id_start, id_end = map(int, product_id_range.split("-"))

    for product_id in range(id_start, id_end + 1):
      product_id_str = str(product_id)
      product_id_len = len(product_id_str)

      for id_len_range in range(1, product_id_len):
        if product_id_str[: id_len_range] * ( product_id_len // id_len_range) == product_id_str:
          product_id_sum += product_id
          break

  return product_id_sum

with open(input_file) as f:
  line = f.readline()
  part_one_result = part_one(line.strip())
  part_two_result = part_two(line.strip())

print(f"Part One: {part_one_result}")
print(f"Part Two: {part_two_result}")
