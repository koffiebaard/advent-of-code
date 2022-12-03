#!/bin/bash
cat input | sed 's/ //g' | xargs -I{} bash -c 'echo -n {} | od -An -tuC' | sed 's/ //g' | xargs -n1 -I{} bash -c "echo {} | cut -c 3- | sed 's/\(.*\)/1 \+ \1-88/g' | bc | tr '\n' '+' ; echo \"scale=0; (((\$(echo {} | cut -c -2) - 65) - (\$(echo {} | cut -c 3-) - 88) + 3) % 3)\" | bc -l | tr 2 6 | tr 0 3 | tr 1 0" | bc | awk '{s+=$1} END {print s}'
