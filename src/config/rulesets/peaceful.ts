import type { Ruleset } from './index';

export const peacefulRuleset: Ruleset = {
  mode: 'peaceful',
  description: 'setup.peacefulDescription',
  rounds: {
    1: {
      1: 'rounds.peaceful.round1.diceRules.1',
      2: 'rounds.peaceful.round1.diceRules.2',
      3: 'rounds.peaceful.round1.diceRules.3',
      4: 'rounds.peaceful.round1.diceRules.4',
      5: 'rounds.peaceful.round1.diceRules.5',
      6: 'rounds.peaceful.round1.diceRules.6',
    },
    2: {
      1: 'rounds.peaceful.round2.diceRules.1',
      2: 'rounds.peaceful.round2.diceRules.2',
      3: 'rounds.peaceful.round2.diceRules.3',
      4: 'rounds.peaceful.round2.diceRules.4',
      5: 'rounds.peaceful.round2.diceRules.5',
      6: 'rounds.peaceful.round2.diceRules.6',
    },
    3: {
      1: 'rounds.peaceful.round3.diceRules.1',
      2: 'rounds.peaceful.round3.diceRules.2',
      3: 'rounds.peaceful.round3.diceRules.3',
      4: 'rounds.peaceful.round3.diceRules.4',
      5: 'rounds.peaceful.round3.diceRules.5',
      6: 'rounds.peaceful.round3.diceRules.6',
    },
  },
};

