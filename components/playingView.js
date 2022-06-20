import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  VStack,
  Wrap,
} from "@chakra-ui/layout"
import {useMemo} from "react"
import {DndProvider} from "react-dnd"
import {useSelector} from "react-redux"
import {getCapturedPiecesImages} from "../utils/getCapturedPiecesImages"
import {useWindowSize} from "../utils/useWindowSize"
import GameMoves from "./gameMoves"
import Image from "next/image"
import {ChessBoard} from "./chessBoard"
import {HTML5Backend} from "react-dnd-html5-backend"
import styles from "./styles/chessBoard.module.scss"
import {Oval} from "react-loader-spinner"
import {chess} from "../chessEngine/chess"

function PlayingView() {
  const {difficulty} = useSelector((state) => state.difficulty)
  const {capturedPieces} = useSelector((state) => state.game.currentPosition)
  const {isGameOver} = useSelector((state) => state.game)
  const {userColor, computerColor} = useSelector((state) => state.sides)
  const {piecesTheme, isBoardFlipped} = useSelector((state) => state.appearance)
  const {width, height} = useWindowSize()

  const bots = {
    beginner: "Ahmed",
    intermediate: "Fadi",
    advanced: "Salwa",
    expert: "Omar",
  }

  let flipped
  if (isBoardFlipped) {
    if (userColor === "white") {
      flipped = true
    } else {
      flipped = false
    }
  } else {
    if (userColor === "white") {
      flipped = false
    } else {
      flipped = true
    }
  }

  const capturedWhitePieces = useMemo(() => {
    const capturedQueens = capturedPieces.white.filter(
      (piece) => piece === "queen"
    )
    const capturedRooks = capturedPieces.white.filter(
      (piece) => piece === "rook"
    )
    const capturedBishops = capturedPieces.white.filter(
      (piece) => piece === "bishop"
    )
    const capturedKnights = capturedPieces.white.filter(
      (piece) => piece === "knight"
    )
    const capturedPawns = capturedPieces.white.filter(
      (piece) => piece === "pawn"
    )
    return getCapturedPiecesImages(
      {
        capturedQueens,
        capturedRooks,
        capturedBishops,
        capturedKnights,
        capturedPawns,
      },
      "white",
      piecesTheme
    )
  }, [capturedPieces.white, piecesTheme])

  const capturedBlackPieces = useMemo(() => {
    const capturedQueens = capturedPieces.black.filter(
      (piece) => piece === "queen"
    )
    const capturedRooks = capturedPieces.black.filter(
      (piece) => piece === "rook"
    )
    const capturedBishops = capturedPieces.black.filter(
      (piece) => piece === "bishop"
    )
    const capturedKnights = capturedPieces.black.filter(
      (piece) => piece === "knight"
    )
    const capturedPawns = capturedPieces.black.filter(
      (piece) => piece === "pawn"
    )
    return getCapturedPiecesImages(
      {
        capturedQueens,
        capturedRooks,
        capturedBishops,
        capturedKnights,
        capturedPawns,
      },
      "black",
      piecesTheme
    )
  }, [capturedPieces.black, piecesTheme])

  const isComputerTurn = chess.turn() === computerColor.charAt(0)

  return (
    <DndProvider backend={HTML5Backend}>
      <Box height="100%" padding="10px">
        <Center>
          <VStack align="start">
            <Wrap
              spacing="50px"
              align="center"
              justify="center"
              direction={{
                base: "column",
                sm: "column",
                md: "column",
                lg: "row",
              }}
            >
              <VStack>
                <Flex justifyContent="space-between" width="500px">
                  {!flipped ? (
                    <HStack
                      className={styles.playerSide}
                      spacing="10px"
                      paddingLeft="3px"
                      w="100%"
                      position="relative"
                    >
                      <Image
                        src={`/bots/${difficulty}-1.png`}
                        alt={`${difficulty} bot image`}
                        width={60}
                        height={60}
                        className={styles.playerImage}
                        layout="fixed"
                      />
                      {isComputerTurn && !isGameOver && (
                        <Box
                          position="absolute"
                          top="50%"
                          transform="translate(-50%, -50%)"
                          left="-30px"
                        >
                          <Oval
                            ariaLabel="loading-indicator"
                            height={18}
                            width={18}
                            strokeWidth={5}
                            strokeWidthSecondary={1}
                            color="#333"
                            secondaryColor="white"
                          />
                        </Box>
                      )}
                      <VStack spacing="0px" marginLeft="10px">
                        <Heading as="h2" fontSize="26px" opacity={0.85}>
                          {bots[difficulty]}
                        </Heading>
                        <Heading as="h5" size="sm" opacity={0.85}>
                          ({difficulty})
                        </Heading>
                      </VStack>
                    </HStack>
                  ) : (
                    <HStack
                      paddingLeft="3px"
                      className={styles.playerSide}
                      spacing="10px"
                      w="100%"
                    >
                      <Image
                        src={`/player.png`}
                        alt={`player's image`}
                        width={60}
                        height={60}
                        className={styles.playerImage}
                        layout="fixed"
                      />
                      <VStack marginLeft="10px">
                        <Heading as="h2" fontSize="26px" opacity={0.85}>
                          You
                        </Heading>
                      </VStack>
                    </HStack>
                  )}
                  <Flex width="100%" wrap>
                    <Center>{capturedWhitePieces}</Center>
                  </Flex>
                </Flex>
                <ChessBoard />
                <Flex justifyContent="space-between" width="500px">
                  {!flipped ? (
                    <HStack
                      paddingLeft="3px"
                      className={styles.playerSide}
                      spacing="10px"
                      w="100%"
                    >
                      <Image
                        src={`/player.png`}
                        alt={`player's image`}
                        width={60}
                        height={60}
                        className={styles.playerImage}
                        layout="fixed"
                      />
                      <VStack marginLeft="10px">
                        <Heading as="h2" fontSize="26px" opacity={0.85}>
                          You
                        </Heading>
                      </VStack>
                    </HStack>
                  ) : (
                    <HStack
                      className={styles.playerSide}
                      spacing="10px"
                      paddingLeft="3px"
                      w="100%"
                      position="relative"
                    >
                      <Image
                        src={`/bots/${difficulty}-1.png`}
                        alt={`${difficulty} bot image`}
                        width={60}
                        height={60}
                        className={styles.playerImage}
                        layout="fixed"
                      />
                      {isComputerTurn && !isGameOver && (
                        <Box
                          position="absolute"
                          top="50%"
                          transform="translate(-50%, -50%)"
                          left="-30px"
                        >
                          <Oval
                            ariaLabel="loading-indicator"
                            height={18}
                            width={18}
                            strokeWidth={5}
                            strokeWidthSecondary={1}
                            color="#333"
                            secondaryColor="white"
                          />
                        </Box>
                      )}
                      <VStack spacing="0px" marginLeft="10px">
                        <Heading as="h2" fontSize="26px" opacity={0.85}>
                          {bots[difficulty]}
                        </Heading>
                        <Heading as="h5" size="sm" opacity={0.85}>
                          ({difficulty})
                        </Heading>
                      </VStack>
                    </HStack>
                  )}
                  <Flex width="100%" wrap>
                    <Center>{capturedBlackPieces}</Center>
                  </Flex>
                </Flex>
              </VStack>
              <GameMoves />
            </Wrap>
          </VStack>
        </Center>
      </Box>
    </DndProvider>
  )
}

export default PlayingView
