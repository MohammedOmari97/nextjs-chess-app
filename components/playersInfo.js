import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  VStack,
  Wrap,
} from "@chakra-ui/layout"
import Image from "next/image"
import {useMemo} from "react"
import {useSelector} from "react-redux"
import {getCapturedPiecesImages} from "../utils/getCapturedPiecesImages"
import styles from "./styles/chessBoard.module.scss"
import {chess} from "../chessEngine/chess"
import {Oval} from "react-loader-spinner"

const bots = {
  beginner: "Ahmed",
  intermediate: "Fadi",
  advanced: "Salwa",
  expert: "Omar",
}

function PlayersInfo({children, isVisible, ...rest}) {
  const {piecesTheme, isBoardFlipped} = useSelector((state) => state.appearance)
  const {userColor, computerColor} = useSelector((state) => state.sides)
  const {difficulty} = useSelector((state) => state.difficulty)
  const {capturedPieces} = useSelector((state) => state.game.currentPosition)

  const isComputerTurn = chess.turn() === computerColor.charAt(0)

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

  if (!isVisible) {
    return children
  }

  return (
    <VStack mt="auto !important" mb="auto !important" {...rest}>
      <HStack justify="space-between" w="100%" spacing="10px">
        {!flipped ? (
          <HStack
            className={styles.playerSide}
            spacing="10px"
            paddingLeft="3px"
            w="100%"
          >
            <Box
              width={{base: "45px", sm: "60px"}}
              height={{base: "45px", sm: "60px"}}
              position="relative"
            >
              <Image
                src={`/bots/${difficulty}-1.png`}
                alt={`${difficulty} bot image`}
                className={styles.playerImage}
                layout="fill"
              />
              {isComputerTurn && (
                <Box
                  position="absolute"
                  top="50%"
                  transform="translate(-40%, -60%)"
                  left="-14px"
                >
                  <Oval
                    ariaLabel="loading-indicator"
                    height={11}
                    width={11}
                    strokeWidth={5}
                    strokeWidthSecondary={1}
                    color="#333"
                    secondaryColor="white"
                  />
                </Box>
              )}
            </Box>
            <VStack spacing="0px" marginLeft="10px">
              <Heading
                as="h2"
                fontSize={{base: "20px", sm: "26px"}}
                opacity={0.85}
              >
                {bots[difficulty]}
              </Heading>
              <Heading
                as="h5"
                fontSize={{base: "14px", sm: "18px"}}
                opacity={0.85}
              >
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
            <Box
              width={{base: "45px", sm: "60px"}}
              height={{base: "45px", sm: "60px"}}
              position="relative"
            >
              <Image
                src={`/player.png`}
                alt={`player's image`}
                className={styles.playerImage}
                layout="fill"
              />
            </Box>
            <VStack marginLeft="10px">
              <Heading
                as="h2"
                fontSize={{base: "20px", sm: "26px"}}
                opacity={0.85}
              >
                You
              </Heading>
            </VStack>
          </HStack>
        )}
        <Flex width="100%" flexWrap="wrap">
          {capturedWhitePieces}
        </Flex>
      </HStack>
      {children}
      <Flex justifyContent="space-between" w="100%">
        {!flipped ? (
          <HStack
            paddingLeft="3px"
            className={styles.playerSide}
            spacing="10px"
            w="100%"
          >
            <Box
              width={{base: "45px", sm: "60px"}}
              height={{base: "45px", sm: "60px"}}
              position="relative"
            >
              <Image
                src={`/player.png`}
                alt={`player's image`}
                className={styles.playerImage}
                layout="fill"
              />
            </Box>
            <VStack marginLeft="10px">
              <Heading
                as="h2"
                fontSize={{base: "20px", sm: "26px"}}
                opacity={0.85}
              >
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
          >
            <Box
              width={{base: "45px", sm: "60px"}}
              height={{base: "45px", sm: "60px"}}
              position="relative"
            >
              <Image
                src={`/bots/${difficulty}-1.png`}
                alt={`${difficulty} bot image`}
                className={styles.playerImage}
                layout="fill"
              />
            </Box>
            <VStack spacing="0px" marginLeft="10px">
              <Heading
                as="h2"
                fontSize={{base: "20px", sm: "26px"}}
                opacity={0.85}
              >
                {bots[difficulty]}
              </Heading>
              <Heading
                as="h5"
                fontSize={{base: "14px", sm: "18px"}}
                opacity={0.85}
              >
                ({difficulty})
              </Heading>
            </VStack>
          </HStack>
        )}
        <Flex width="100%" flexWrap="wrap">
          {capturedBlackPieces}
        </Flex>
      </Flex>
    </VStack>
  )
}

export default PlayersInfo
