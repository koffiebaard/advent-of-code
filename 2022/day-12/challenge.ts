import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

type Adjacent = { [key: string]: string[] };

type Discovered = { [key: string]: boolean };
type Edges = { [key: string]: number };
type Predecessors = { [key: string]: string | null };

type EntResult = {
  distance: number
  path: string
}

class Ent {
  vertices: string[] = [];
  adjacent: Adjacent = {};

  vertex(x: number, y: number, value: string): string {
    return `${x} ${y} ${value.trim()}`;
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
    const predecessors: Predecessors = {[root]: null};

    const letter = (value: string) => value.split(' ')[2];

    while (queue.length) {
      let value: string = String(queue.shift());

      if (value === goal) {
        return {
          distance: edges[goal],
          path: this.build_path(goal, predecessors)
        };
      }

      for (let i = 0; i < this.adjacent[value].length; i++) {
        let edge: string = this.adjacent[value][i];

        if (!discovered[edge] && (letter(edge) === 'E' || letter(value) === 'S' || letter(value).charCodeAt(0) - letter(edge).charCodeAt(0) >= -1)) {
          discovered[edge] = true;
          queue.push(edge);

          edges[edge] = edges[value] + 1;
          predecessors[edge] = value;
        }
      }
    }

    return null;
  }
}


const tree_beard = new Ent();

let grid = input.split('\n').filter(output => output !== '');
let part1 = '';
let part2: string[] = [];
let goal = '';

grid.map((line, y) => {
  line.split('').map((character, x) => {
    let vertex = tree_beard.vertex(x, y, character);

    tree_beard.addVertex(vertex);

    if (character === 'E')
      goal = vertex;

    if (character === 'S')
      part1 = vertex;

    if (character === 'S' || character === 'a')
      part2.push(vertex);

    if (y-1 >= 0)           tree_beard.addEdge(vertex, tree_beard.vertex(x, y-1, grid[y-1][x]))
    if (y+1 < grid.length)  tree_beard.addEdge(vertex, tree_beard.vertex(x, y+1, grid[y+1][x]));
    if (x-1 >= 0)           tree_beard.addEdge(vertex, tree_beard.vertex(x-1, y, grid[y][x-1]));
    if (x+1 < line.length)  tree_beard.addEdge(vertex, tree_beard.vertex(x+1, y, grid[y][x+1]));
  });
});

let least_steps = Infinity;

part2.map(start => {
  let steps = tree_beard.bfs(goal, start)?.distance;
  if (steps && steps < least_steps)
  least_steps = steps;
});


let red = '38;2;255;0;0';
let green = '38;2;0;208;0';
let rs = `\x1b[${red}m`;
let gs = `\x1b[${green}m`;
let ws = `\x1b[97m`;
let e = `\x1b[0m`;

console.log(`${ws}   __   __             __                     __  ___
 _(  )_(  )_          (  )     __            (_ )(  _)
(_ ${gs}${tree_beard.bfs(goal, part1)?.distance} ${least_steps}${ws} _)         (__)    (__)            (_)(__)
  (_) (____)${e}`);

console.log(`${rs}          /\\
         /${ws}**${rs}\\
        /${ws}****${rs}\\   /\\
       /      \\ /${ws}**${rs}\\                     
      /  /\\    /    \\        /\\    /\\  /\\      /\\            /\\/\\/\\  /\\
     /  /  \\  /      \\      /  \\/\\/  \\/  \\  /\\/  \\/\\  /\\  /\\/ / /  \\/  \\
    /  /    \\/ /\\     \\    /    \\ \\  /    \\/ /   /  \\/  \\/  \\  /    \\   \\
   /  /  ${gs}*${rs}   \\/${gs}*${rs} \\/\\   \\  /      \\    /   / ${gs}*${rs}  \\  ${gs}*${rs}  \\    ${gs}*${rs}    
${gs}__${rs}/${gs}__${rs}/${gs}___|___${rs}/${gs}_|_${rs}/${gs}__${rs}\\${gs}___${rs}\\${gs}___________________|_____|_______|________________${e}`);
