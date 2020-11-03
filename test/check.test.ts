import { baseProbabilities, scenarios, probabilitiyOfScenarios } from '../src/check';

// just some very basic sanity checks to catch for basic math issues or typos
test('Probabilities add to 1', () => {
  expect(
    baseProbabilities
      .map((b) => b.probabilities.bidenWin + b.probabilities.trumpWin)
      .every((e) => e === 1)
  ).toBeTruthy();

  expect(
    scenarios
      .map((s) => s.nationalWinProbabilities.bidenWin + s.nationalWinProbabilities.trumpWin)
      .every((e) => e === 1)
  ).toBeTruthy();

  const scenarioTable = probabilitiyOfScenarios();
  const probabilities = scenarioTable[scenarioTable.length - 1].slice(1);
  // If this was to be maintained I would not do this with floats and parsing. but .999 for this feels reasonable
  expect(probabilities.reduce((acc, curr) => acc + parseFloat(curr), 0)).toStrictEqual(0.999);
});
