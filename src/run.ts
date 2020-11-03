import { table } from 'table';
import { probabilitiyOfScenarios } from './check';

const needleProbabilities = process.argv.slice(2);
let result: string[][] = [];
if (needleProbabilities.length === 3) {
  result = probabilitiyOfScenarios(
    parseFloat(needleProbabilities[0]),
    parseFloat(needleProbabilities[1]),
    parseFloat(needleProbabilities[2])
  );
} else {
  result = probabilitiyOfScenarios();
}

const finalBidenProbability = result[result.length - 1].reduce((acc, cur, idx) => {
  return Number.isNaN(parseFloat(cur)) ? 0 : acc + parseFloat(cur) * parseFloat(result[3][idx]);
}, 0);

console.log(table(result));

console.log(`Biden Probability to win presidency ${finalBidenProbability.toFixed(3)}`);
console.log(`Trump Probability to win presidency ${(1 - finalBidenProbability).toFixed(3)}`);
