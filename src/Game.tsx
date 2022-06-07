import { useState, useEffect } from 'react';
import { Box, Flex, Center, Heading, Button, Stack,Text } from "@chakra-ui/react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useMachine } from '@xstate/react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import SlotMachine from 'jquery-slotmachine/lib/slot-machine.js';
import machine from './machine';

const Game = () => {
  const gameEnginer = new machine()
  const [gameStates, sendGameStates] = useMachine(gameEnginer.gameMachine);
  const [leftNum, setLeftNum] = useState(0);
  const [rightNum, setRightNum] = useState(0);
  const [guess, setGuess] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const { width, height } = useWindowSize();
  async function randomNumber(machine, setNum) {
    let rdNum = Math.floor(Math.random() * 10) + 1
    setNum(rdNum) //set number
    const el = document.querySelector(machine);
    const randomMachine = new SlotMachine(el, {
      delay: 1500,
      spins: 10,
      randomize() {
        return rdNum - 1;
      }
    });
    randomMachine.shuffle()
    await gameEnginer.sleep(200);
    sendGameStates('TOGGLE');
  };
  async function handleGuess(guess: any) {
    setGuess(guess) //1 is higher, 2 lower, 0 default
    sendGameStates('TOGGLE');
  };
  async function handleResetGame() {
    setGuess(0);
    setLeftNum(0);
    setRightNum(0);
    setIsCorrect(false);
    await gameEnginer.sleep(500);
    sendGameStates('TOGGLE');
  };
  const handleIsCorrect = (guess: any, previousNumber: any, answer: any) => {
    if (guess === 0) return false;
    return guess === 1 ? answer > previousNumber : guess === 2 ? answer < previousNumber : false;
  }
  useEffect(() => {
    switch (gameStates.value) {
      case 'rdLeftNum':
        randomNumber('#machineLeft', setLeftNum);
        break;
      case 'rdRightNum':
        randomNumber('#machineRight', setRightNum);
        break;
      case 'result':
        setIsCorrect(handleIsCorrect(guess, rightNum, leftNum));
        break;

      default:
        break;
    }
  }, [gameStates.value]);

  return (
    <Box bgColor="#f3f3f3" h="100vh">
      <Center pt="120px">
        <Flex w="400px" px="64px" direction="column" align="center">
          <Flex mb="64px">
            <Heading mr="16px" fontSize="36px" color="twitter.500">
              High
            </Heading>
            <Heading fontSize="36px" color="facebook.500">
              Low
            </Heading>
          </Flex>
          <Flex w="full" justify="space-between">
            <Flex maxW="120px" flex={1} position="relative">
              <Center
                w="full"
                h="150px"
                px="24px"
                py="16px"
                bgColor="white"
                borderRadius="md"
                boxShadow="lg"
                flex={1}
              >
                <Heading fontSize="54px" color="gray.500" className="left-number">
                  {
                    gameStates.value == 'rdLeftNum' ? (
                      <div id="machineLeft" className='random-machine'>
                        {gameEnginer.randomGenerate.map((num, index) => (
                          <div key={index}>{num}</div>
                        ))}
                      </div>
                    ) : (
                      leftNum == 0 ? (
                        <span className="mark-lbl">?</span>
                      ) : (leftNum)
                    )
                  }
                </Heading>
              </Center>
            </Flex>
            <Flex maxW="120px" flex={1} direction="column" position="relative">
              <Center
                w="full"
                h="150px"
                px="24px"
                py="16px"
                bgColor="white"
                borderRadius="md"
                boxShadow="lg"
              >
                <Heading fontSize="54px" color="blue.500" className="right-number">
                  {
                    gameStates.value == 'rdRightNum' ? (
                      <div id="machineRight" className='random-machine'>
                        {gameEnginer.randomGenerate.map((num, index) => (
                          <div key={index}>{num}</div>
                        ))}
                      </div>
                    ) : (
                      rightNum == 0 ? (
                        <span className="mark-lbl">?</span>
                      ) : (rightNum)
                    )
                  }
                </Heading>
              </Center>

              {/* `Higher` and `Lower` buttons UI */}
              {
                gameStates.value == 'guess' &&
                <>
                  <Button
                    mt="32px"
                    colorScheme="twitter"
                    leftIcon={<RiArrowUpSLine />}
                    isFullWidth
                    onClick={() => {
                      // TODO: Start a new game
                      handleGuess(1)
                    }}
                  >
                    Higher
                  </Button>
                  <Button
                    mt="8px"
                    colorScheme="facebook"
                    leftIcon={<RiArrowDownSLine />}
                    isFullWidth
                    onClick={() => {
                      // TODO: Start a new game
                      handleGuess(2)
                    }}
                  >
                    Lower
                  </Button>
                </>
              }
            </Flex>
          </Flex>
          {
            gameStates.value == 'ready' &&
            <Box mt="64px">
              <Button
                colorScheme="blue"
                onClick={() => {
                  // TODO: Start a new game
                  sendGameStates('TOGGLE')
                }}
              >
                Start Game
              </Button>
            </Box>
          }
          {/* User guess */}
          {
            guess !== 0 &&
            <Stack mt="24px" spacing="16px">
              <Text color="black.500" align="center">
                Your choice : {guess==1?'Higher':'Lower'}
              </Text>
            </Stack>
          }
          {/* Game result UI */}
          {
            gameStates.value == 'result' &&
            <Stack mt="24px" spacing="16px">
              {
                isCorrect ? (
                  <Heading color="twitter.300" align="center">
                    WIN!
                  </Heading>
                ) : (
                  <Heading color="red.300" align="center">
                    LOSE!
                  </Heading>
                )
              }
              <Button
                colorScheme="blue"
                onClick={() => {
                  // TODO: Clear game result and start a new game
                  handleResetGame()
                  sendGameStates('TOGGLE')
                }}
              >
                Play Again
              </Button>
            </Stack>
          }
        </Flex>
      </Center>
      {
        gameStates.value == 'result' && isCorrect &&
        <Confetti
          width={width}
          height={height}
        />
      }
    </Box>
  );
};

export default Game;
