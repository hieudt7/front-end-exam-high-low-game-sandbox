import { createMachine } from 'xstate';
class machine{
  randomGenerate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  gameMachine = createMachine({
    id: 'gameMachine',
    initial: 'ready',
    states: {
      ready: {
        on: { TOGGLE: 'rdLeftNum' } //test
      },
      rdLeftNum: {
        on: { TOGGLE: 'guess' }
      },
      guess: {
        on: { TOGGLE: 'rdRightNum' }
      },
      rdRightNum: {
        on: { TOGGLE: 'result' }
      },
      result: {
        on: { TOGGLE: 'playAgain' }
      },
      playAgain: {
        on: { TOGGLE: 'rdLeftNum' }
      },
    }
  });
  sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default machine;
