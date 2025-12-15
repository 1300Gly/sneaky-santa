export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export function rollDice(): DiceValue {
  return (Math.floor(Math.random() * 6) + 1) as DiceValue;
}

export function rollDiceWithAnimation(callback: (value: DiceValue) => void, duration: number = 1000): void {
  const startTime = Date.now();
  const interval = setInterval(() => {
    const randomValue = rollDice();
    callback(randomValue);
    
    if (Date.now() - startTime >= duration) {
      clearInterval(interval);
      const finalValue = rollDice();
      callback(finalValue);
    }
  }, 50);
}

