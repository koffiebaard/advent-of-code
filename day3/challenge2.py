oxygen_data = scrubber_data = open('data', 'r').read().splitlines()

for index in range(0, 12):
  oxygen_data_0 = [binary for binary in oxygen_data if binary[index] == "0"]
  oxygen_data_1 = [binary for binary in oxygen_data if binary[index] == "1"]
  scrubber_data_0 = [binary for binary in scrubber_data if binary[index] == "0"]
  scrubber_data_1 = [binary for binary in scrubber_data if binary[index] == "1"]

  oxygen_data = oxygen_data_1 if len(oxygen_data_1) >= len(oxygen_data_0) else oxygen_data_0
  scrubber_data = scrubber_data_0 if len(scrubber_data_1) >= len(scrubber_data_0) else scrubber_data_1

  if len(oxygen_data) == 1: print("oxygen rate is {oxygen_rate}".format(oxygen_rate=oxygen_data[0]))
  if len(scrubber_data) == 1: print("scrubber rate is {scrubber_rate}".format(scrubber_rate=scrubber_data[0]))
