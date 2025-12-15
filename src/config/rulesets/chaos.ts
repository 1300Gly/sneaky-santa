import type { Ruleset } from './index';

export const chaosRuleset: Ruleset = {
  mode: 'chaos',
  description: 'setup.chaosDescription',
  rounds: {
    1: {
      1: 'rounds.chaos.round1.diceRules.1',
      2: 'rounds.chaos.round1.diceRules.2',
      3: 'rounds.chaos.round1.diceRules.3',
      4: 'rounds.chaos.round1.diceRules.4',
      5: 'rounds.chaos.round1.diceRules.5',
      6: 'rounds.chaos.round1.diceRules.6',
    },
    2: {
      1: 'rounds.chaos.round2.diceRules.1',
      2: 'rounds.chaos.round2.diceRules.2',
      3: 'rounds.chaos.round2.diceRules.3',
      4: 'rounds.chaos.round2.diceRules.4',
      5: 'rounds.chaos.round2.diceRules.5',
      6: 'rounds.chaos.round2.diceRules.6',
    },
    3: {
      1: 'rounds.chaos.round3.diceRules.1',
      2: 'rounds.chaos.round3.diceRules.2',
      3: 'rounds.chaos.round3.diceRules.3',
      4: 'rounds.chaos.round3.diceRules.4',
      5: 'rounds.chaos.round3.diceRules.5',
      6: 'rounds.chaos.round3.diceRules.6',
    },
  },
};

