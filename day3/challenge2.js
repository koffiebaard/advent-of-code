var fs = require('fs');
let oxygen_data = scrubber_data = fs.readFileSync('data').toString().split("\n");

for (index = 0; index < 12; index++) {
  oxygen_data_0 = oxygen_data.filter((binary) => binary[index] == 0);
  oxygen_data_1 = oxygen_data.filter((binary) => binary[index] == 1);
  scrubber_data_0 = scrubber_data.filter((binary) => binary[index] == 0);
  scrubber_data_1 = scrubber_data.filter((binary) => binary[index] == 1);

  oxygen_data = oxygen_data_1.length >= oxygen_data_0.length ? oxygen_data_1 : oxygen_data_0;
  scrubber_data = scrubber_data_1.length >= scrubber_data_0.length ? scrubber_data_0 : scrubber_data_1;

  if (oxygen_data.length == 1) console.log(`oxygen rate is ${oxygen_data[0]}`);
  if (scrubber_data.length == 1) console.log(`scrubber rate is ${scrubber_data[0]}`);
}
