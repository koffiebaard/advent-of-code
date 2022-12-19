import { readFileSync } from 'fs';

type Blueprint = {
  number: number,
  ore_robot_cost_ore: number,
  clay_robot_cost_ore: number,
  obsidian_robot_cost_ore: number,
  obsidian_robot_cost_clay: number,
  geode_robot_cost_ore: number,
  geode_robot_cost_obsidian: number,
}

type Robots = { [key: string]: number };
type Minerals = { [key: string]: number };
type Factory = { [key: string]: number };


function fetch_blueprints(): Blueprint[] {
  const input = readFileSync(process.argv[2] ?? './input', 'utf-8');

  let blueprints: Blueprint[] = input
    .split('\n')
    .filter(output => output !== '')
    .map(line => {
      let [
        number,
        ore_robot_cost_ore, 
        clay_robot_cost_ore, 
        obsidian_robot_cost_ore, 
        obsidian_robot_cost_clay, 
        geode_robot_cost_ore, 
        geode_robot_cost_obsidian
      ] = (line.match(/\d+/g) || []).map(move => parseInt(move));

      return {
        number,
        ore_robot_cost_ore, 
        clay_robot_cost_ore, 
        obsidian_robot_cost_ore, 
        obsidian_robot_cost_clay, 
        geode_robot_cost_ore, 
        geode_robot_cost_obsidian
      }
    });

  return blueprints;
}


function test_all_blueprints(blueprints: Blueprint[], minutes: number = 24, limit?: number): [number, number] {
  let mining_operations = ['ore', 'clay', 'obsidian', 'geode'];
  let quality_levels = 0;
  let geode_fuckery: number[] = [];

  blueprints.map(blueprint => {
    if (limit && blueprint.number > limit) 
      return;

    let highest_geode_count = 0;

    for (let i = 0; i < 12000; i++) {
      let robots: Robots = {ore: 1, clay: 0, obsidian: 0, geode: 0};
      let mined: Minerals = {ore: 0,clay: 0,obsidian: 0,geode: 0};
      let factory: Factory = {ore: 0,clay: 0,obsidian: 0,geode: 0};

      for (let minute = 1; minute <= minutes; minute++) {
        // Construct geode robots
        if (mined.ore >= blueprint.geode_robot_cost_ore && mined.obsidian >= blueprint.geode_robot_cost_obsidian) {
          mined.ore -= blueprint.geode_robot_cost_ore;
          mined.obsidian -= blueprint.geode_robot_cost_obsidian;
          factory.geode++;
        }

        // Construct obsidian robots
        else if (mined.ore >= blueprint.obsidian_robot_cost_ore && mined.clay >= blueprint.obsidian_robot_cost_clay) {
          mined.ore -= blueprint.obsidian_robot_cost_ore;
          mined.clay -= blueprint.obsidian_robot_cost_clay;
          factory.obsidian++;
        }

        // Construct clay robots
        else if (mined.ore >= blueprint.clay_robot_cost_ore && Math.random() > 0.5) {
          mined.ore -= blueprint.clay_robot_cost_ore;
          factory.clay++;
        }

        // Construct ore robots
        else if (
          mined.ore >= blueprint.ore_robot_cost_ore &&
          Math.random() > 0.5
          ) {
          mined.ore -= blueprint.ore_robot_cost_ore;
          factory.ore++;
        }

        // collect minerals
        mining_operations.map(mineral => {
          if (robots[mineral] > 0) {
            mined[mineral] += robots[mineral];
          }
        });

        // Factory releasing new robots
        mining_operations.map(mineral => {
          if (factory[mineral] > 0) {
            robots[mineral] += factory[mineral];
            factory[mineral] = 0;
          }
        });
      }

      if (mined.geode > highest_geode_count) {
        highest_geode_count = mined.geode;
      }
    }

    quality_levels += (blueprint.number * highest_geode_count);

    if (blueprint.number <= 3)
      geode_fuckery.push(highest_geode_count);
  });

  return [quality_levels, geode_fuckery.reduce((total, amount) => total * amount)];
}

let blueprints = fetch_blueprints();
let [quality_levels] = test_all_blueprints(blueprints, 24);
let [_, geode_fuckery] = test_all_blueprints(blueprints, 32, 3);

let blue = '38;2;0;0;255';
let gray = '38;2;30;20;70';
let brown = '38;2;150;75;0';
let red = '38;2;255;0;0';
let green = '38;2;0;208;0';
let rs = `\x1b[${red}m`;
let gs = `\x1b[${green}m`;
let brs = `\x1b[${brown}m`;
let bs = `\x1b[${blue}m`;
let grs = `\x1b[${gray}m`;
let ws = `\x1b[97m`;
let e = `\x1b[0m`;

console.log(`${grs}        //\\                                 ${brs}/\\/\\${grs}
        Y  \\\  ___             _ _          ${brs}/ /  \\${grs}
       _L   \\\/_/=|     ${ws}${String(geode_fuckery).padStart(5)}${grs}_L_|_\\          ${brs}/    \\${grs}
 ${brs}{${ws}..${grs}  (/\\)  ((|_L_|     L_|_____|__]              ${brs}\\${grs}
${brs}{}${grs}${brs}{}${grs}  ${ws}${String(quality_levels).padStart(3).padEnd(4)}${grs} (__(____)     (_(_)  (_)    ${brs}  {}{} ooO${e}`);
