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

      // Sort to prioritize highest distance
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

const count_rate_in_path = (path: string[]): number => {
  let minutes = 30;
  return path.reduce((total_rate, valve, index) => {
    if (index === 0)
      return total_rate;

    if (minutes < 0) {
      return -1;
    }

    let distance = shortest_distances[path[index-1]][path[index]] + 1;
    minutes -= distance;
    return total_rate + (minutes * valves[valve].rate);

    // console.log(`From ${path[index-1]} to ${path[index]} is a distance of ${distance} at ${minutes} minutes left. Total rate ${total_rate}`);
  }, 0);
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
  }, 30);
}

function which_valves_are_left(path: string[]) {
  return Object.keys(valves)
    .filter(valve => !path.includes(valve) && valves[valve].rate !== 0)
    .sort((a, b) => valves[b].rate - valves[a].rate);
}

const paths: Paths = {};
var highest_rate = 0;

function traverse_valve_path(path: string[]) {

  let remaining_valves = which_valves_are_left(path);

  remaining_valves.forEach(valve => {
    if (minutes_spent(path) < 0) {
      return;
    }

    traverse_valve_path([...path, valve]);
  });

  let total_rate = count_rate_in_path(path);

  if (total_rate > 0) {
    if (total_rate > highest_rate) {
      console.log(`highest rate is now ${total_rate}`);
      highest_rate = total_rate;
    }

    paths[path.join('/')] = total_rate;
  }
}

console.log(`Start traversing valve paths..`);
traverse_valve_path(['AA']);

let highest = 0;
Object.keys(paths).forEach(path => {
  if (paths[path] > highest)
    highest = paths[path];
});

console.log(`The highest rate is ${highest}`);
