import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  memo,
  useMemo,
  useLayoutEffect,
  useCallback,
} from "react"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import {useDispatch, useSelector} from "react-redux"
import Piece from "./piece"
import Square from "./square"
import {getSquareNameFromIndex} from "../utils/utils"
import styles from "./styles/chessBoard.module.scss"
import {engine} from "../chessEngine/engine"
import {worker} from "../chessEngine/engineWorker"
import {chess, initializeChessJS, resetBoard} from "../chessEngine/chess"
import {Box, Center, Flex, Wrap} from "@chakra-ui/layout"
import {AnimateSharedLayout, motion, isValidMotionProp} from "framer-motion"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SettingsIcon,
} from "@chakra-ui/icons"
import {HStack, VStack, Heading, Tooltip, Button} from "@chakra-ui/react"
import Image from "next/image"
import GameMoves from "./gameMoves"
import {useForceUpdate} from "../utils/useForceUpdate"
import {useMove} from "../utils/useMove"
import Xarrow from "react-xarrows"
import {useWindowSize} from "../utils/useWindowSize"
import {getCapturedPiecesImages} from "../utils/getCapturedPiecesImages"
import PromotionPopup from "./promotionPopup"
import {useMediaQuery} from "@chakra-ui/media-query"

const headShape = {
  svgElem: (
    <path
      fill="black"
      d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"
    ></path>
  ),
}

function checkForGameOver(dispatch, userColor, difficulty) {
  if (chess.in_checkmate()) {
    const turn = chess.turn()
    let playerToMove
    if (turn === "b") {
      if (userColor === "black") {
        playerToMove = "user"
      } else {
        playerToMove = "computer"
      }
    } else if (turn === "w") {
      if (userColor === "white") {
        playerToMove = "user"
      } else {
        playerToMove = "computer"
      }
    }
    let winner = playerToMove === "user" ? "computer" : "user"
    setTimeout(() => {
      dispatch({type: "calc-score", payload: {winner, difficulty}})
      dispatch({
        type: "set-game-over",
        payload: {
          isGameOver: true,
          type: "checkmate",
          winner,
        },
      })
    }, 500)
  } else if (chess.in_draw()) {
    dispatch({type: "set-game-over", payload: {isGameOver: true, type: "draw"}})
  } else if (chess.in_stalemate()) {
    dispatch({
      type: "set-game-over",
      payload: {isGameOver: true, type: "stalemate"},
    })
  } else if (chess.in_threefold_repetition()) {
    dispatch({
      type: "set-game-over",
      payload: {isGameOver: true, type: "threefold repetition"},
    })
  }
}

function getSquares(pieces, flipped = false) {
  let squares = []
  if (flipped) {
    for (let i = 63; i >= 0; i--) {
      const squareName = getSquareNameFromIndex(i)
      const squareContent = pieces.filter(
        (piece) => piece.square === squareName
      )[0]
      const child = squareContent && (
        <Piece
          name={squareContent.name}
          color={squareContent.color}
          number={squareContent.number}
          square={squareContent.square}
        />
      )

      squares.push(
        <Square
          key={
            child
              ? `${squareName}-${squareContent.name}-${squareContent.number}-${squareContent.color}`
              : `${squareName}`
          }
          name={squareName}
        >
          <Box key={squareName} w="100%" h="100%">
            {child}
          </Box>
        </Square>
      )
    }
  } else {
    for (let i = 0; i < 64; i++) {
      const squareName = getSquareNameFromIndex(i)
      const squareContent = pieces.filter(
        (piece) => piece.square === squareName
      )[0]
      const child = squareContent && (
        <Piece
          name={squareContent.name}
          color={squareContent.color}
          number={squareContent.number}
          square={squareContent.square}
        />
      )

      squares.push(
        <Square
          key={
            child
              ? `${squareName}-${squareContent.name}-${squareContent.number}-${squareContent.color}`
              : `${squareName}`
          }
          name={squareName}
        >
          <Box key={squareName} w="100%" h="100%">
            {child}
          </Box>
        </Square>
      )
    }
  }

  return squares
}

export function ChessBoard({style}) {
  const piecesObj = useSelector((state) => state.game.currentPosition.pieces)
  const pieces = Object.values(piecesObj)
  const dispatch = useDispatch()
  const {userColor, computerColor} = useSelector((state) => state.sides)
  const {boardTheme} = useSelector((state) => state.appearance)
  const {isBoardFlipped} = useSelector((state) => state.appearance)
  const {doAnimation} = useSelector((state) => state.doAnimation)
  const forceUpdate = useForceUpdate()
  const {moves, currentPosition, promotionSquare} = useSelector(
    (state) => state.game
  )
  const {fen} = useSelector((state) => state.game.currentPosition)
  const {move} = useMove()
  const {difficulty} = useSelector((state) => state.difficulty)
  const scores = useSelector((state) => state.scores)
  const {arrows} = useSelector((state) => state.arrows)
  const isLandscape = window.innerHeight < window.innerWidth
  const [isMobile] = useMediaQuery("(max-width: 850px")

  useEffect(() => {
    initializeChessJS(fen)
    const playerToMove = chess.turn() === computerColor[0] ? "computer" : "user"
    dispatch({
      type: "set-is-board-flipped",
      // payload: {isBoardFlipped: playerToMove === "computer"},
      payload: {isFlipped: playerToMove === "computer"},
    })

    const listener = window.addEventListener("keydown", (e) => {
      if (e.keyCode === 39) {
        dispatch({type: "next-move"})
      } else if (e.keyCode === 37) {
        dispatch({type: "previous-move"})
      }
    })

    worker.postMessage({
      message: "init",
      color: computerColor,
      fen,
      playerToMove,
      difficulty,
    })

    return () => window.removeEventListener("keydown", listener)
  }, [])

  const workerEventHandler = useCallback(
    (e) => {
      const promotion = e.data.promotion?.promotedToString
      const engineMove = engine.moveToString(e.data.move)
      const source = engineMove.substr(0, 2)
      const destination = engineMove.substr(2, 2)
      const piece = pieces.find((piece) => piece.square === source)
      if (!piece) {
        return
      }
      if (engineMove !== "a8a8") {
        if (promotion) {
          setTimeout(() => {
            move({from: source, to: destination}, piece, {promotion}, true)
            checkForGameOver(dispatch, userColor, difficulty)
          }, 500)
        } else {
          setTimeout(() => {
            move({from: source, to: destination}, piece, null, true)
            checkForGameOver(dispatch, userColor, difficulty)
          }, 500)
        }
      }
      if (chess.in_checkmate()) {
        const turn = chess.turn()
        let playerToMove
        if (turn === "b") {
          if (userColor === "black") {
            playerToMove = "user"
          } else {
            playerToMove = "computer"
          }
        } else if (turn === "w") {
          if (userColor === "white") {
            playerToMove = "user"
          } else {
            playerToMove = "computer"
          }
        }
        let winner = playerToMove === "user" ? "computer" : "user"
        setTimeout(() => {
          dispatch({type: "calc-score", payload: {winner, difficulty}})
          dispatch({
            type: "set-game-over",
            payload: {
              isGameOver: true,
              winner,
              type: "checkmate",
            },
          })
        }, 500)
      } else if (chess.in_draw()) {
        dispatch({type: "calc-score", payload: {winner: null, difficulty}})
        dispatch({
          type: "set-game-over",
          payload: {isGameOver: true, type: "draw"},
        })
      } else if (chess.in_stalemate()) {
        dispatch({type: "calc-score", payload: {winner: null, difficulty}})
        dispatch({
          type: "set-game-over",
          payload: {isGameOver: true, type: "stalemate"},
        })
      } else if (chess.in_threefold_repetition()) {
        dispatch({type: "calc-score", payload: {winner: null, difficulty}})
        dispatch({
          type: "set-game-over",
          payload: {isGameOver: true, type: "threefold repetition"},
        })
      }
    },
    [pieces, dispatch, move, difficulty, userColor]
  )

  useEffect(() => {
    const listener = worker.addEventListener("message", workerEventHandler)
    return () => worker.removeEventListener("message", listener)
  }, [workerEventHandler])

  const squares = useMemo(() => {
    return getSquares(pieces, isBoardFlipped)
  }, [pieces, isBoardFlipped])

  const boardKeyRef = useRef(Math.floor(Math.random() * 10000))

  useLayoutEffect(() => {
    if (!doAnimation) {
      boardKeyRef.current = Math.floor(Math.random() * 10000)
    }
  }, [doAnimation])

  useLayoutEffect(() => {
    boardKeyRef.current = Math.floor(Math.random() * 10000)
    forceUpdate()
  }, [isBoardFlipped])

  return (
    <Box
      className={styles.container}
      backgroundImage={`url(/boardThemes/${boardTheme}.png)`}
      backgroundSize="contain"
      shadow="lg"
      onContextMenu={(e) => e.preventDefault()}
      {...style}
    >
      <AnimateSharedLayout key={boardKeyRef.current}>
        {squares}
      </AnimateSharedLayout>
      {arrows.map((arrow) => {
        return (
          <Xarrow
            start={arrow[0]}
            end={arrow[1]}
            key={`${arrow[0]}-${arrow[1]}`}
            path="straight"
            startAnchor="middle"
            // startAnchor={{position: "middle", offset: {x: -20, y: -20}}}
            endAnchor="middle"
            zIndex={999}
            color="rgba(255, 170, 0, 0.8)"
            headSize={3}
            strokeWidth={8}
            style={{userSelect: "none"}}
          />
        )
      })}
      {currentPosition.sourceSquare ? (
        <Xarrow
          start={currentPosition.sourceSquare}
          end={currentPosition.destinationSquare}
          key={`${currentPosition.sourceSquare}-${currentPosition.destinationSquare}`}
          path="straight"
          startAnchor="middle"
          endAnchor="middle"
          zIndex={999}
          color="#FF454288"
          headSize={3}
          strokeWidth={8}
          style={{userSelect: "none"}}
        />
      ) : null}
      {isLandscape && isMobile && promotionSquare ? (
        <PromotionPopup squareName={promotionSquare} />
      ) : null}
    </Box>
  )
}

function ChessBoardComponent() {
  const {difficulty} = useSelector((state) => state.difficulty)
  const {capturedPieces} = useSelector((state) => state.game.currentPosition)
  const {userColor, computerColor} = useSelector((state) => state.sides)
  const {piecesTheme, isBoardFlipped} = useSelector((state) => state.appearance)

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
                    >
                      <Image
                        src={`/bots/${difficulty}-1.png`}
                        alt={`${difficulty} bot image`}
                        width={60}
                        height={60}
                        className={styles.playerImage}
                        layout="fixed"
                      />
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
                    >
                      <Image
                        src={`/bots/${difficulty}-1.png`}
                        alt={`${difficulty} bot image`}
                        width={60}
                        height={60}
                        className={styles.playerImage}
                        layout="fixed"
                      />
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

export default ChessBoardComponent
