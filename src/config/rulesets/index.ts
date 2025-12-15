import type { RuleMode } from '../../types';
import { peacefulRuleset } from './peaceful';
import { traditionalRuleset } from './traditional';
import { chaosRuleset } from './chaos';

export type DiceRule = {
  [key in 1 | 2 | 3 | 4 | 5 | 6]: string;
};

export type Ruleset = {
  mode: RuleMode;
  description: string;
  rounds: {
    1: DiceRule;
    2: DiceRule;
    3: DiceRule;
  };
};

export const rulesets: Record<RuleMode, Ruleset> = {
  peaceful: peacefulRuleset,
  traditional: traditionalRuleset,
  chaos: chaosRuleset,
};

export function getRuleset(mode: RuleMode): Ruleset {
  return rulesets[mode];
}

export function getDiceRules(round: 1 | 2 | 3, mode: RuleMode = 'traditional'): DiceRule {
  return rulesets[mode].rounds[round];
}

export function getDiceRule(
  round: 1 | 2 | 3,
  value: 1 | 2 | 3 | 4 | 5 | 6,
  mode: RuleMode = 'traditional'
): string {
  return rulesets[mode].rounds[round][value];
}

