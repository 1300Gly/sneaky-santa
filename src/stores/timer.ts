import { writable } from 'svelte/store';
import type { TimerState } from '../types';

const defaultTimerState: TimerState = {
  isRunning: false,
  isPaused: false,
  timeRemaining: 0,
  round: 1,
  totalTime: 0,
  warningsShown: {
    halfTime: false,
    tenMinutes: false,
    fiveMinutes: false,
    oneMinute: false,
  },
};

function createTimerStore() {
  const { subscribe, set, update } = writable<TimerState>(defaultTimerState);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  return {
    subscribe,
    set,
    update,
    startTimer: (timeInSeconds: number, round: 1 | 2 | 3) => {
      const now = Date.now();
      set({
        isRunning: true,
        isPaused: false,
        timeRemaining: timeInSeconds,
        round,
        startTime: now,
        pauseTime: undefined,
        totalTime: timeInSeconds,
        warningsShown: {
          halfTime: false,
          tenMinutes: false,
          fiveMinutes: false,
          oneMinute: false,
        },
      });

      if (intervalId) clearInterval(intervalId);

      intervalId = setInterval(() => {
        update((state) => {
          if (!state.isRunning || state.isPaused) return state;
          
          const newTime = Math.max(0, state.timeRemaining - 1);
          
          if (newTime === 0) {
            if (intervalId) clearInterval(intervalId);
            return { ...state, isRunning: false, timeRemaining: 0 };
          }
          
          return { ...state, timeRemaining: newTime };
        });
      }, 1000);
    },
    restoreTimer: (state: TimerState) => {
      set(state);
      
      // If timer was running, calculate elapsed time and resume
      if (state.isRunning && !state.isPaused && state.startTime) {
        const now = Date.now();
        const elapsed = Math.floor((now - state.startTime) / 1000);
        const newTimeRemaining = Math.max(0, state.totalTime - elapsed);
        
        if (newTimeRemaining === 0) {
          // Timer expired while page was closed
          set({ ...state, isRunning: false, timeRemaining: 0 });
          return;
        }
        
        // Update with new time remaining
        update((current) => ({
          ...current,
          timeRemaining: newTimeRemaining,
          startTime: now - (state.totalTime - newTimeRemaining) * 1000, // Adjust start time
        }));
        
        // Resume timer
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
          update((current) => {
            if (!current.isRunning || current.isPaused) return current;
            
            const newTime = Math.max(0, current.timeRemaining - 1);
            
            if (newTime === 0) {
              if (intervalId) clearInterval(intervalId);
              return { ...current, isRunning: false, timeRemaining: 0 };
            }
            
            return { ...current, timeRemaining: newTime };
          });
        }, 1000);
      } else if (state.isPaused && state.pauseTime && state.startTime) {
        // Timer was paused, calculate time remaining
        const elapsed = Math.floor((state.pauseTime - state.startTime) / 1000);
        const newTimeRemaining = Math.max(0, state.totalTime - elapsed);
        update((current) => ({
          ...current,
          timeRemaining: newTimeRemaining,
        }));
      }
    },
    pauseTimer: () => {
      update((state) => ({ 
        ...state, 
        isPaused: true,
        pauseTime: Date.now(),
      }));
    },
    resumeTimer: () => {
      update((state) => {
        if (!state.startTime || !state.pauseTime) return state;
        
        // Calculate elapsed time during pause
        const pausedElapsed = Math.floor((state.pauseTime - state.startTime) / 1000);
        const now = Date.now();
        
        // Adjust start time to account for pause duration
        const newStartTime = now - pausedElapsed * 1000;
        
        return { 
          ...state, 
          isPaused: false,
          startTime: newStartTime,
          pauseTime: undefined,
        };
      });
      
      // Resume interval if not already running
      if (!intervalId) {
        intervalId = setInterval(() => {
          update((state) => {
            if (!state.isRunning || state.isPaused) return state;
            
            const newTime = Math.max(0, state.timeRemaining - 1);
            
            if (newTime === 0) {
              if (intervalId) clearInterval(intervalId);
              return { ...state, isRunning: false, timeRemaining: 0 };
            }
            
            return { ...state, timeRemaining: newTime };
          });
        }, 1000);
      }
    },
    resetTimer: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      set(defaultTimerState);
    },
    updateTimeRemaining: (time: number) => {
      update((state) => ({ ...state, timeRemaining: time }));
    },
    resetWarnings: () => {
      update((state) => ({
        ...state,
        warningsShown: {
          halfTime: false,
          tenMinutes: false,
          fiveMinutes: false,
          oneMinute: false,
        },
      }));
    },
    markWarningShown: (warning: keyof TimerState['warningsShown']) => {
      update((state) => ({
        ...state,
        warningsShown: { ...state.warningsShown, [warning]: true },
      }));
    },
  };
}

export const timer = createTimerStore();

