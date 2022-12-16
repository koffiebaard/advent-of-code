import { readFileSync } from 'fs';

type Adjacent = { [key: string]: string[] };

type Discovered = { [key: string]: boolean };
type Edges = { [key: string]: number };
type Distances = { [key: string]: number[] };
type Predecessors = { [key: string]: string | null };

type ShortestDistance = { [key: string]: number };
type ShortestDistances = { [key: string]: ShortestDistance };
type Paths = { [key: string]: number };

type Valve = {
  current: string
  rate: number
  leading_to_valves: string[]
}
type Valves = { [key: string]: Valve };

type EntResult = {
  edges: number
  distance: number[]
  path: string
}

const sum = (value: number[]) => value.reduce((partialSum, a) => partialSum + a, 0);

class Ent {
  vertices: string[] = [];
  adjacent: Adjacent = {};

  vertex(valve: string, rate: number): string {
    return `${valve} ${rate}`;
  }

  addVertex(value: string) {
    this.vertices.push(value);

    if (this.adjacent[value] === undefined)
      this.adjacent[value] = [];
  }

  addEdge(value: string, edge: string) {
    if (this.adjacent[value] === undefined)
      this.adjacent[value] = [];

    if (this.adjacent[edge] === undefined)
      this.adjacent[edge] = [];

    this.adjacent[value].push(edge);
    this.adjacent[edge].push(value);
  }

  build_path (goal: string, predecessors: Predecessors) {
    const path = [goal];
    let predecessor = predecessors[goal];

    while (predecessor !== null) {
      path.push(predecessor);
      predecessor = predecessors[predecessor];
    }

    return path.reverse().join(' - ');
  }

  bfs(goal: string, root = this.vertices[0]): EntResult | null {

    const queue: string[] = [root];
    const discovered: Discovered = {[root]: true};
    const edges: Edges = {[root]: 0};
    const distances: Distances = {[root]: []};
    const predecessors: Predecessors = {[root]: null};

    const rate = (value: string): number => Number(value.split(' ')[1]);

    while (queue.length) {
      let value: string = String(queue.shift());

      if (value === goal) {
        return {
          edges: edges[goal],
          distance: distances[goal],
          path: this.build_path(goal, predecessors)
        };
      }

      this.adjacent[value].sort((a, b) => sum(distances[b] || []) - sum(distances[a] || []));

      this.adjacent[value].forEach(edge => {

        if (!discovered[edge]) {
          discovered[edge] = true;
          queue.push(edge);

          edges[edge] = edges[value] + 2;

          distances[edge] = [...distances[value], rate(value)];

          predecessors[edge] = value;
        }
      });
    }

    return null;
  }
}

function retrieve_valves(): Valves {
  const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

  const valves: Valves = {};

  // build valves
  input
    .split('\n')
    .filter(output => output !== '')
    .map(line => {
      let [_, current_valve, rate, leading_to_valves] = (line.match(/Valve ([A-Z]+) has flow rate=([0-9]+); tunnel[s]* lead[s]* to valve[s]* ([A-Z, ]*)$/) || [])
        .map((value, index) => index === 3 ? value.split(', ') : value);

      valves[(current_valve as string)] = {
        current: String(current_valve),
        rate: Number(rate),
        leading_to_valves: leading_to_valves as string[]
      }
    });

  return valves;
}

function calculate_shortest_distances(valves: Valves): ShortestDistances {
  console.log(`Calculating shortest distances..`);
  // build tree
  const tree_beard = new Ent();

  Object.keys(valves).map(current => {
    let valve = valves[current];
    let vertex = tree_beard.vertex(valve.current, valve.rate);

    tree_beard.addVertex(vertex);

    valve.leading_to_valves.forEach(valve => {
      tree_beard.addEdge(vertex, tree_beard.vertex(valve, valves[valve].rate));
    });
  });

  // map all distances
  const shortest_distances: ShortestDistances = {};

  Object.keys(valves).map(root => {
    Object.keys(valves).map(goal => {
      if (root === goal)
        return;

      let result = tree_beard.bfs(
        tree_beard.vertex(goal, valves[goal].rate),
        tree_beard.vertex(root, valves[root].rate)
      );

      if (shortest_distances[root] === undefined)
        shortest_distances[root] = {};

      shortest_distances[root][goal] = result!.distance.length;
    });
  });
  console.log(`Shortest distances done.`);

  return shortest_distances;
}

const valves = retrieve_valves();
const shortest_distances = calculate_shortest_distances(valves);

const count_rate_in_paths = (path: string[], second_path: string[]): number => {
  let total_rate = 0;
  let total_minutes = 26;

  const count_rate = (path: string[], minutes: number) => {
    let distance_traversed = 0;
    return path.reduce((total_rate, valve, index) => {
      if (index === 0)
        return total_rate;

      if (minutes < 0) {
        return total_rate;
      }
  
      distance_traversed += shortest_distances[path[index-1]][path[index]] + 1;

      if (minutes === distance_traversed) {
        return total_rate + ((total_minutes - minutes) * valves[valve].rate);
      }

      return total_rate;
    }, 0);
  }

  for (let minutes = 1; minutes <= total_minutes; minutes++) {
    let rate_path = count_rate(path, minutes);
    let rate_second_path = count_rate(second_path, minutes);

    if (rate_path > 0)
      total_rate += rate_path;

    if (rate_second_path > 0)
      total_rate += rate_second_path;
  }

  return total_rate;
}

const minutes_spent = (path: string[]) => {
  return path.reduce((minutes, valve, index) => {
    if (index === 0)
      return minutes;

    if (minutes < 0) {
      return -1;
    }

    let distance = shortest_distances[path[index-1]][path[index]] + 1;
    return minutes - distance;
  }, 26);
}

function which_valves_are_left(path: string[], second_path: string[]) {
  return Object.keys(valves)
    .filter(valve => !path.includes(valve) && valves[valve].rate !== 0)
    .filter(valve => !second_path.includes(valve) && valves[valve].rate !== 0)
    .sort((a, b) => valves[b].rate - valves[a].rate);
    // .sort((a, b) => Number(Math.random));
}

const paths: Paths = {};
var highest_rate = 0;

function traverse_valve_paths(path: string[], second_path: string[]) {
  let remaining_valves = which_valves_are_left(path, second_path);

  for (let index = 0; index < remaining_valves.length; index += 1) {
    if (minutes_spent(path) < 0 && minutes_spent(second_path) < 0) {
      continue;
    }

    let first_valve = remaining_valves[index];

    if (remaining_valves[index+1] === undefined) {
      traverse_valve_paths([...path, first_valve], [...second_path]);
    } else {
      let second_valve = remaining_valves[index+1];

      if (Math.random() < 0.5)
        traverse_valve_paths([...path, first_valve], [...second_path, second_valve]);
      else
        traverse_valve_paths([...path, second_valve], [...second_path, first_valve]);
    }
  }

  let total_rate = count_rate_in_paths(path, second_path);

  if (total_rate > 0) {
    if (total_rate > highest_rate) {
      console.log(`highest rate is now ${total_rate}`);
      console.log(path.join('/'), second_path.join('/'));
      highest_rate = total_rate;
    }

    paths[path.join('/')] = total_rate;
  }
}

console.log(`Start traversing valve paths..`);

for (let fuck = 0; fuck < 10000; fuck++) {
  traverse_valve_paths(['AA'], ['AA']); // AAAAAAA
  for (let path in paths) delete paths[path];
}


// let highest = 0;
// Object.keys(paths).forEach(path => {
//   if (paths[path] > highest)
//     highest = paths[path];
// });

// console.log(`The highest rate is ${highest}`);
