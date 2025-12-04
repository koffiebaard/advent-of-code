import sys
import queue
import threading

input_file = "input_example" if len(sys.argv) > 1 else "input"

def part_one(data):
  total_joltage = 0

  for battery_pack in data.splitlines():
    battery_pack_len = len(battery_pack)
    highest_joltage = 0
  
    for battery_index in range(0, battery_pack_len):
      for battery_index_comparison in range(0, battery_pack_len):
        if battery_index == battery_index_comparison:
          continue

        if battery_index < battery_index_comparison:
          current_joltage = battery_pack[battery_index] + battery_pack[battery_index_comparison]
        else:
          current_joltage = battery_pack[battery_index_comparison] + battery_pack[battery_index]

        if int(current_joltage) > highest_joltage:
          highest_joltage = int(current_joltage)

    total_joltage += int(highest_joltage)
  return total_joltage


def part_two(data):
  def find_highest_joltage(batteries, size, results, index):
    highest_joltage = []
    start = 0

    for i in range(size):
      end = len(batteries) - (size - i) + 1

      max_digit = max(batteries[start:end])
      max_pos = batteries.index(max_digit, start, end)
      highest_joltage.append(max_digit)
      start = max_pos + 1

    results[index] = int(''.join(highest_joltage))

    print(f"Highest joltage for battery pack {index}: {results[index]}")

  threads = [None] * len(data.splitlines())
  results = [None] * len(data.splitlines())

  # run each battery pack asynchronously
  for index, battery_pack in enumerate(data.splitlines()):
    threads[index] = threading.Thread(target=find_highest_joltage, args=(battery_pack, 12, results, index))
    threads[index].start()
  
  # Wait for the highest joltages from the threads
  for thread in threads:
    thread.join()

  total_joltage = sum(results)
  return total_joltage

with open(input_file) as f:
  data = f.read()

  part_one_result = part_one(data)
  part_two_result = part_two(data)

print(f"Part One: {part_one_result}")
print(f"Part Two: {part_two_result}")
