import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf-8');

let buffer = input.split('');

[4, 14].map(marker_size => {
  let marker_location = buffer.filter(data => data !== '\n').reduce((marker_location, char, index) => {
    let marker = buffer.slice(index, index + marker_size).join('');
    if (marker.match(/^(?:([A-Za-z])(?!.*\1))*$/) && marker_location === '') {
      marker_location = `${index + marker_size} ${marker}`;
    }
    return marker_location;
  }, '')

  console.log(marker_location);
});
