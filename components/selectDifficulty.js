import Image from "next/image"
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Heading,
  Wrap,
} from "@chakra-ui/react"
import {useSelector, useDispatch} from "react-redux"
import styles from "./styles/selectDifficulty.module.scss"
import {worker} from "../chessEngine/engineWorker"

const botNames = {
  beginner: "Ahmed",
  intermediate: "Fadi",
  advanced: "Salwa",
  expert: "Omar",
}

function DifficultyItem({difficulty, active}) {
  const dispatch = useDispatch()
  const {highScore} = useSelector((state) => state.scores)
  const score = highScore[difficulty]

  return (
    <Box
      // style={{position: "relative"}}
      p={7}
      className={styles.difficultyItem}
      _hover={{bg: !active ? "#edf2f7" : undefined}}
      boxShadow={
        active ? "0px 1px 2px #037ef388" : "0px 1px 2px rgba(0, 0, 0, 0.2)"
      }
      bg={active ? "#037ef3dd" : "#eeeeee44"}
      color={active ? "white" : "black"}
      borderRadius="25px"
      transition=".3s ease"
      cursor="pointer"
      position="relative"
    >
      <input
        type="radio"
        id={difficulty}
        name="difficulties"
        onChange={() => {
          dispatch({type: "set-difficulty", payload: {difficulty}})
          worker.postMessage({message: "set-difficulty", difficulty})
        }}
        style={{position: "absolute", top: 0, left: 0, opacity: 0}}
      />
      <label htmlFor={difficulty} cursor="pointer">
        <Box>
          <VStack>
            <Image
              src={`/bots/${difficulty}-1.png`}
              alt={`${difficulty} bot image`}
              width={100}
              height={100}
              className={styles.botImage}
              layout="fixed"
            />
            <Text fontSize="xl">{botNames[difficulty]}</Text>
            <Text>({difficulty})</Text>
          </VStack>
        </Box>
        <Box position="relative" w="100%" mt="12px" mb="19px">
          <HStack
            position="absolute"
            top="0"
            // left="0"
            left="44%"
            transform="translateX(-50%)"
            w="100%"
            h="100%"
            spacing="30px"
            justifyContent="center"
          >
            <Box
              fontFamily="chess"
              fontSize="50px"
              lineHeight="10px"
              w="10px"
              h="10px"
              textShadow="0 0.2rem 0 #666564"
              color="hsla(0, 0%, 100%, 0.4)"
              _before={{content: '"\\1F32"', width: "100%", height: "100%"}}
            ></Box>
            <Box
              fontFamily="chess"
              fontSize="50px"
              lineHeight="10px"
              w="10px"
              h="10px"
              textShadow="0 0.2rem 0 #666564"
              color="hsla(0, 0%, 100%, 0.4)"
              _before={{content: '"\\1F32"', width: "100%", height: "100%"}}
            ></Box>
            <Box
              fontFamily="chess"
              fontSize="50px"
              lineHeight="10px"
              w="10px"
              h="10px"
              textShadow="0 0.2rem 0 #666564"
              color="hsla(0, 0%, 100%, 0.4)"
              _before={{content: '"\\1F32"', width: "100%", height: "100%"}}
            ></Box>
          </HStack>
          <HStack
            position="absolute"
            top="0"
            left="44%"
            transform="translateX(-50%)"
            w="100%"
            h="100%"
            justifyContent="center"
            spacing="30px"
          >
            {Array(3)
              .fill(null)
              .map((_, i) => {
                return (
                  <Box
                    key={i}
                    fontFamily="chess"
                    fontSize="50px"
                    lineHeight="10px"
                    w="10px"
                    h="10px"
                    textShadow="0 0.2rem 0 #8e752a"
                    color="#f3c536"
                    _before={{
                      content: '"\\1F32"',
                      width: "100%",
                      height: "100%",
                    }}
                    opacity={score >= i + 1 ? 1 : 0}
                  ></Box>
                )
              })}
          </HStack>
        </Box>
      </label>
    </Box>
  )
}

function SelectDifficulty({difficulties}) {
  const {difficulty} = useSelector((state) => state.difficulty)
  const dispatch = useDispatch()

  return (
    <Box>
      <Heading mb={4} as="h2" size="lg" textAlign="center" opacity={0.85}>
        Select a difficulty
      </Heading>
      <Wrap spacing={8} justify="center" padding="10px" wrap>
        {difficulties.map((level) => {
          return (
            <DifficultyItem
              key={level}
              difficulty={level}
              active={difficulty === level}
            />
          )
        })}
      </Wrap>
    </Box>
  )
}

export default SelectDifficulty
