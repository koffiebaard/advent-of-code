<?php
$oxygen_data = $scrubber_data = explode("\n", file_get_contents("data"));

for ($index = 0; $index < 12; $index++) {
  $oxygen_data_0 = array_filter($oxygen_data, function ($binary) use($index){ return $binary[$index] == 0; });
  $oxygen_data_1 = array_filter($oxygen_data, function ($binary) use($index){ return $binary[$index] == 1; });
  $scrubber_data_0 = array_filter($scrubber_data, function ($binary) use($index){ return $binary[$index] == 0; });
  $scrubber_data_1 = array_filter($scrubber_data, function ($binary) use($index){ return $binary[$index] == 1; });

  $oxygen_data = count($oxygen_data_1) >= count($oxygen_data_0) ? $oxygen_data_1 : $oxygen_data_0;
  $scrubber_data = count($scrubber_data_1) >= count($scrubber_data_0) ? $scrubber_data_0 : $scrubber_data_1;

  if (count($oxygen_data) == 1) echo sprintf("oxygen rate is   %s\n", bindec(array_values($oxygen_data)[0]));
  if (count($scrubber_data) == 1) echo sprintf("scrubber rate is %s\n", bindec(array_values($scrubber_data)[0]));
}
