<?php

$rucksacks = explode(PHP_EOL, file_get_contents('input'));

$points = 0;

foreach ($rucksacks as $rucksack) {
  if (empty($rucksack))
    continue;

  $component1 = substr($rucksack, 0, strlen($rucksack) / 2);
  $component2 = substr($rucksack, strlen($rucksack) / 2);

  $item = array_values(array_intersect(str_split($component1), str_split($component2)))[0];
  $points += ord($item) - ($item === strtoupper($item) ? 38 : 96);
}

var_dump($points);
