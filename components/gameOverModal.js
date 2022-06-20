import {Box, Center, Flex, Heading, HStack} from "@chakra-ui/layout"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal"
import {useDispatch, useSelector} from "react-redux"
import Button from "./button"
import Image from "next/image"
import styles from "./styles/gameOverModal.module.scss"
import {useState, useEffect, useRef} from "react"
import {VStack} from "@chakra-ui/react"
import {motion} from "framer-motion"

function GameOverModal() {
  const {isGameOver, winner} = useSelector((state) => state.game)
  const {difficulty} = useSelector((state) => state.difficulty)
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const MotionHStack = motion(HStack)
  const MotionBox = motion(Box)
  const {score, takebacks} = useSelector((state) => state.scores)
  const containerRef = useRef()
  console.log(winner)

  let gameOverMessage
  if (winner === "user") {
    gameOverMessage = "You Are Victorious!"
  } else if (winner === "computer") {
    gameOverMessage = "You Lost!"
  } else {
    gameOverMessage = "Draw"
  }

  useEffect(() => {
    if (isGameOver) {
      setShowModal(true)
    }
  }, [isGameOver])

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
        dispatch({type: "reset-score"})
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader textAlign="center">
          <Heading mb={4} as="h2" size="lg" textAlign="center" opacity={0.85}>
            {gameOverMessage}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <VStack spacing="40px">
            <Flex justifyContent="space-around" w="100%">
              <Box>
                <Box
                  boxShadow={
                    winner === "computer"
                      ? "0 0 0 5px white, 0 0 0 10px #0abf53"
                      : "none"
                  }
                  transition="box-shadow 0.3s ease 1s"
                  borderRadius="50%"
                  width="100px"
                  height="100px"
                >
                  <Image
                    src={`/bots/${difficulty}-1.png`}
                    alt={`${difficulty} bot image`}
                    width={100}
                    height={100}
                    className={styles.playerImage}
                    layout="fixed"
                    priority={true}
                  />
                </Box>
                <Heading
                  mb={4}
                  mt={3}
                  as="h2"
                  fontSize="25px"
                  textAlign="center"
                  opacity={0.85}
                >
                  Computer
                </Heading>
              </Box>
              <Box>
                <Box
                  boxShadow={
                    winner === "user"
                      ? "0 0 0 5px white, 0 0 0 10px #0abf53"
                      : "none"
                  }
                  transition="box-shadow 0.3s ease 1s"
                  borderRadius="50%"
                  width="100px"
                  height="100px"
                >
                  <Image
                    src={`/player.png`}
                    alt={`player's image`}
                    width={100}
                    height={100}
                    className={styles.playerImage}
                    layout="fixed"
                    priority={true}
                  />
                </Box>
                <Heading
                  mb={4}
                  mt={3}
                  as="h2"
                  fontSize="25px"
                  textAlign="center"
                  opacity={0.85}
                >
                  You
                </Heading>
              </Box>
            </Flex>
            <Box position="relative" w="100%" h="100%">
              <HStack
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                spacing="30px"
                justifyContent="center"
              >
                <Box
                  fontFamily="chess"
                  fontSize="80px"
                  lineHeight="10px"
                  w="50px"
                  h="50px"
                  textShadow="0 0.3rem 0 #666564"
                  color="hsla(0, 0%, 100%, 0.4)"
                  _before={{content: '"\\1F32"', width: "100%", height: "100%"}}
                ></Box>
                <Box
                  fontFamily="chess"
                  fontSize="80px"
                  lineHeight="10px"
                  w="50px"
                  h="50px"
                  textShadow="0 0.3rem 0 #666564"
                  color="hsla(0, 0%, 100%, 0.4)"
                  _before={{content: '"\\1F32"', width: "100%", height: "100%"}}
                ></Box>
                <Box
                  fontFamily="chess"
                  fontSize="80px"
                  lineHeight="10px"
                  w="50px"
                  h="50px"
                  textShadow="0 0.3rem 0 #666564"
                  color="hsla(0, 0%, 100%, 0.4)"
                  _before={{content: '"\\1F32"', width: "100%", height: "100%"}}
                ></Box>
              </HStack>
              <MotionHStack
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                justifyContent="center"
                spacing="30px"
                animate={showModal ? "visible" : "hidden"}
                variants={{
                  visible: {
                    transition: {staggerChildren: 0.4, delayChildren: 0.2},
                  },
                  hidden: {
                    transition: {staggerChildren: 0.4},
                  },
                }}
              >
                {Array(3)
                  .fill(null)
                  .map((_, i) => {
                    return (
                      <MotionBox
                        key={i}
                        fontFamily="chess"
                        fontSize="80px"
                        lineHeight="10px"
                        w="50px"
                        h="50px"
                        textShadow="0 0.3rem 0 #8e752a"
                        color="#f3c536"
                        _before={{
                          content: '"\\1F32"',
                          width: "100%",
                          height: "100%",
                        }}
                        opacity={0}
                        scale={0.3}
                        variants={{
                          visible: {scale: 1, opacity: score >= i + 1 ? 1 : 0},
                          hidden: {scale: 0.3, opacity: 0},
                        }}
                      ></MotionBox>
                    )
                  })}
              </MotionHStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center" mt="20px">
          <Button onClick={() => setShowModal(false)} width="200px">
            Play Again
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default GameOverModal
