import chalk from 'chalk';

enum Candidate {
  TRUMP,
  BIDEN
}
enum State {
  FLORIDA,
  GEORGIA,
  NORTH_CAROLINA
}
type CandidateProbabilities = {
  trumpWin: number;
  bidenWin: number;
};

type BaseProbability = {
  state: State;
  probabilities: CandidateProbabilities;
};

type Scenario = {
  floridaWinner: Candidate;
  georgiaWinner: Candidate;
  northCarolinaWinner: Candidate;
  nationalWinProbabilities: CandidateProbabilities;
};

export const baseProbabilities: BaseProbability[] = [
  { state: State.FLORIDA, probabilities: { bidenWin: 0.69, trumpWin: 0.31 } },
  { state: State.GEORGIA, probabilities: { bidenWin: 0.58, trumpWin: 0.42 } },
  { state: State.NORTH_CAROLINA, probabilities: { bidenWin: 0.64, trumpWin: 0.36 } }
];

export const scenarios: Scenario[] = [
  {
    floridaWinner: Candidate.BIDEN,
    georgiaWinner: Candidate.BIDEN,
    northCarolinaWinner: Candidate.BIDEN,
    nationalWinProbabilities: { bidenWin: 0.995, trumpWin: 0.005 }
  },
  {
    floridaWinner: Candidate.BIDEN,
    georgiaWinner: Candidate.TRUMP,
    northCarolinaWinner: Candidate.BIDEN,
    nationalWinProbabilities: { bidenWin: 0.995, trumpWin: 0.005 }
  },
  {
    floridaWinner: Candidate.BIDEN,
    georgiaWinner: Candidate.BIDEN,
    northCarolinaWinner: Candidate.TRUMP,
    nationalWinProbabilities: { bidenWin: 0.99, trumpWin: 0.01 }
  },
  {
    floridaWinner: Candidate.TRUMP,
    georgiaWinner: Candidate.BIDEN,
    northCarolinaWinner: Candidate.BIDEN,
    nationalWinProbabilities: { bidenWin: 0.97, trumpWin: 0.03 }
  },
  {
    floridaWinner: Candidate.BIDEN,
    georgiaWinner: Candidate.TRUMP,
    northCarolinaWinner: Candidate.TRUMP,
    nationalWinProbabilities: { bidenWin: 0.97, trumpWin: 0.03 }
  },
  {
    floridaWinner: Candidate.TRUMP,
    georgiaWinner: Candidate.TRUMP,
    northCarolinaWinner: Candidate.BIDEN,
    nationalWinProbabilities: { bidenWin: 0.93, trumpWin: 0.07 }
  },
  {
    floridaWinner: Candidate.TRUMP,
    georgiaWinner: Candidate.BIDEN,
    northCarolinaWinner: Candidate.TRUMP,
    nationalWinProbabilities: { bidenWin: 0.76, trumpWin: 0.24 }
  },
  {
    floridaWinner: Candidate.TRUMP,
    georgiaWinner: Candidate.TRUMP,
    northCarolinaWinner: Candidate.TRUMP,
    nationalWinProbabilities: { bidenWin: 0.5, trumpWin: 0.5 }
  }
];

function winnerToString(winner: Candidate): string {
  return winner === Candidate.BIDEN
    ? chalk.bold.black.bgBlue(' BIDEN ')
    : chalk.bold.black.bgRed(' TRUMP ');
}
function proabilityForCandidate(candidate: Candidate, bidenWinProbaility: number): number {
  return candidate === Candidate.BIDEN ? bidenWinProbaility : 1 - bidenWinProbaility;
}
function calculateProbabilityOfScenario(
  scenario: Scenario,
  floridaBidenProability: number,
  georgiaBidenProbability: number,
  northCarolinaBidenProbability: number
): number {
  return (
    proabilityForCandidate(scenario.floridaWinner, floridaBidenProability) *
    proabilityForCandidate(scenario.georgiaWinner, georgiaBidenProbability) *
    proabilityForCandidate(scenario.northCarolinaWinner, northCarolinaBidenProbability)
  );
}

function sortColumnsOnProbabilityOfScenario(
  scenarioProbabilities: string[],
  data: string[][]
): string[][] {
  const consumableScenarioProabilities = scenarioProbabilities.slice();

  const sortedProbabilitiesMapping = scenarioProbabilities
    .slice()
    .sort((a, b) => {
      return parseFloat(b) - parseFloat(a);
    })
    .map((x) => {
      const result = consumableScenarioProabilities.indexOf(x);
      consumableScenarioProabilities[result] = '';
      return result;
    });

  const sortedTableValues: string[][] = [];

  data.forEach((row) => {
    sortedTableValues.push(sortedProbabilitiesMapping.map((k) => row[k]));
  });
  return sortedTableValues;
}

export function probabilitiyOfScenarios(
  floridaBidenProability = baseProbabilities[State.FLORIDA].probabilities.bidenWin,
  georgiaBidenProbability = baseProbabilities[State.GEORGIA].probabilities.bidenWin,
  northCarolinaBidenProbability = baseProbabilities[State.NORTH_CAROLINA].probabilities.bidenWin
): string[][] {
  const data = [
    ['Florida'].concat(scenarios.map((s) => winnerToString(s.floridaWinner))),
    ['Georgia'].concat(scenarios.map((s) => winnerToString(s.georgiaWinner))),
    ['North Carolina'].concat(scenarios.map((s) => winnerToString(s.northCarolinaWinner))),
    ['Biden Win Probability'].concat(
      scenarios.map((s) => s.nationalWinProbabilities.bidenWin.toString())
    ),
    ['Trump Win Proability'].concat(
      scenarios.map((s) => s.nationalWinProbabilities.trumpWin.toString())
    )
  ];

  const scenarioProbabilities = ['Scenario Probability'].concat(
    scenarios.map((s) =>
      calculateProbabilityOfScenario(
        s,
        floridaBidenProability,
        georgiaBidenProbability,
        northCarolinaBidenProbability
      ).toFixed(3)
    )
  );

  data.push(scenarioProbabilities);

  return sortColumnsOnProbabilityOfScenario(scenarioProbabilities, data);
}
