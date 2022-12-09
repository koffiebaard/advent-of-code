#!/bin/bash
pwd=`pwd`

rm -rf fs && mkdir fs;

while read line; do
  # cd
  if [[ $line =~ ^\$\ cd ]]; then
    dir=${line:5};
    dir=${dir/\//fs};

    cd $dir;

    # Make sure we stay within bounds
    if ! [[ $(pwd) =~ fs ]]; then
      echo "Well, shit.";
      exit 1;
    fi
  # mkdir
  elif [[ $line =~ dir ]]; then
    mkdir -p ${line:4};

  # create file with fake size
  elif [[ $line =~ ^[0-9] ]]; then
    truncate -s $line;
  fi
done < input

cd $pwd;

function count_size() {
  ls -Rgo "$1" | grep '^-' | awk '{s+=$3} END {print s}'
}

storage_shortage=$((`count_size fs` - $((70000000 - 30000000))));

small_dirs_size=0;
smallest_dir_size=70000000;

for dir in $(find fs/ -type d); do
  dir_size=$(count_size $dir);

  if [[ $dir_size -le 100000 ]]; then
    small_dirs_size=$((small_dirs_size + dir_size));
  fi

  if [[ $dir_size -ge $storage_shortage && $dir_size -lt $smallest_dir_size ]]; then
    smallest_dir_size=$dir_size;
  fi
done

printf "$small_dirs_size\n$smallest_dir_size\n";
