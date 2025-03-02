import {
  Box,
  VStack,
  Button,
  HStack,
  Center,
  Flex,
  Text,
  Wrap,
  Tooltip,
} from "@chakra-ui/react"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import {useDispatch, useSelector} from "react-redux"
import {useWindowSize} from "../utils/useWindowSize"
import {ChessBoard} from "./chessBoard"
import PlayersInfo from "./playersInfo"
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons"
import {worker} from "../chessEngine/engineWorker"
import {chess, resetBoard} from "../chessEngine/chess"
import {useEffect, useRef} from "react"

function MoveHistoryButton({move, orientation, ...props}) {
  const dispatch = useDispatch()
  const buttonPortraitRef = useRef()
  const buttonLandscapeRef = useRef()
  const {stepsInHistory} = useSelector((state) => state.game)

  useEffect(() => {
    if (buttonPortraitRef.current && stepsInHistory === move.historyStep) {
      buttonPortraitRef.current.scrollIntoView({inline: "nearest"})
    }

    if (buttonLandscapeRef.current && stepsInHistory === move.historyStep) {
      buttonLandscapeRef.current.scrollIntoView({block: "nearest"})
    }
  }, [stepsInHistory])

  if (orientation === "landscape") {
    return (
      <Button
        ref={buttonLandscapeRef}
        w="46%"
        variant={stepsInHistory === move.historyStep ? "solid" : "ghost"}
        onClick={() => {
          dispatch({
            type: "go-to-move",
            payload: {move: move.historyStep},
          })
        }}
        {...props}
      >
        {move.moveCode}
      </Button>
    )
  }

  return (
    <Button
      ref={buttonPortraitRef}
      onClick={() => {
        dispatch({
          type: "go-to-move",
          payload: {move: move.historyStep},
        })
      }}
      variant={stepsInHistory === move.historyStep ? "solid" : "ghost"}
      height="25px"
      minWidth="auto"
      {...props}
    >
      {move.moveCode}
    </Button>
  )
}

function GameMovesPortrait({isVisible}) {
  const {moves, stepsInHistory, isGameOver, winner} = useSelector(
    (state) => state.game
  )
  const {computerColor, userColor} = useSelector((state) => state.sides)
  const dispatch = useDispatch()
  const movesListRef = useRef()

  let result
  if (winner === "computer") {
    if (computerColor === "white") {
      result = "1 - 0"
    } else {
      result = "0 - 1"
    }
  } else if (winner === "user") {
    if (userColor === "white") {
      result = "1 - 0"
    } else {
      result = "0 - 1"
    }
  } else if (isGameOver && !winner) {
    result = "1/2 - 1/2"
  }

  return (
    <Flex
      w="100%"
      h="31px"
      overflowX="auto"
      overflowY="hidden"
      display={isVisible ? "flex" : "none"}
      padding="3px"
      ref={movesListRef}
    >
      {moves.map((move, i) => {
        return <MoveHistoryButton key={i} move={move} mr="3px" />
      })}
      {result && (
        <Box
          w="20px"
          borderRadius="md"
          p="10px"
          textAlign="center"
          shadow="base"
          border="1px solid #e3e3e355"
          display="flex"
          alignItems="center"
          minWidth="fit-content"
        >
          {result}
        </Box>
      )}
    </Flex>
  )
}

function GameMovesLandscape() {
  const {moves, isGameOver, winner} = useSelector((state) => state.game)
  const {computerColor, userColor} = useSelector((state) => state.sides)

  let result
  if (winner === "computer") {
    if (computerColor === "white") {
      result = "1 - 0"
    } else {
      result = "0 - 1"
    }
  } else if (winner === "user") {
    if (userColor === "white") {
      result = "1 - 0"
    } else {
      result = "0 - 1"
    }
  } else if (isGameOver && !winner) {
    result = "1/2 - 1/2"
  }

  return (
    <Wrap
      h="100%"
      overflow="hidden auto"
      w="200px"
      shadow="sm"
      border="1px solid #e3e3e355"
      borderRadius="md"
      padding="3px"
    >
      {moves.map((move, i) => {
        return <MoveHistoryButton key={i} move={move} orientation="landscape" />
      })}
      {result && (
        <Box
          w="100%"
          borderRadius="md"
          p="10px"
          textAlign="center"
          shadow="base"
          border="1px solid #e3e3e355"
        >
          {result}
        </Box>
      )}
    </Wrap>
  )
}

function MobileView() {
  const {width} = useWindowSize()
  const isLandscape = window.innerHeight < window.innerWidth
  const {isGameOver, moves} = useSelector((state) => state.game)
  const dispatch = useDispatch()
  const {computerColor, userColor} = useSelector((state) => state.sides)
  const {difficulty} = useSelector((state) => state.difficulty)

  return (
    <DndProvider backend={HTML5Backend}>
      <VStack h="100vh" justify="space-between">
        <HStack w="100%" h="100%" justify="center">
          <VStack w="100%" h="100%" justify="space-between">
            <GameMovesPortrait isVisible={!isLandscape} />
            <PlayersInfo isVisible={!isLandscape}>
              <ChessBoard
                style={{
                  w: {
                    base: isLandscape
                      ? "calc(100vh - 80px)"
                      : "calc(100vw - 50px)",
                  },
                  h: {
                    base: isLandscape
                      ? "calc(100vh - 80px)"
                      : "calc(100vw - 50px)",
                  },
                }}
              />
            </PlayersInfo>
          </VStack>
          {isLandscape ? (
            <VStack h="calc(100vh - 80px)" w="100%">
              <PlayersInfo
                isVisible={isLandscape}
                h="100%"
                w="100%"
                mt="none"
                mb="none"
                justify="space-between"
              >
                <GameMovesLandscape />
              </PlayersInfo>
            </VStack>
          ) : null}
        </HStack>
        <Box w="100%" p="10px">
          <HStack spacing="10px">
            <Button
              w="100%"
              fontFamily="chess"
              fontSize="30px"
              onClick={() => {
                dispatch({type: "show-settings"})
              }}
            >
              <span style={{marginBottom: "5px"}}>·</span>
            </Button>
            {isGameOver ? (
              <Tooltip label="New Game">
                <Button
                  w="100%"
                  onClick={() => {
                    resetBoard()
                    const playerToMove =
                      chess.turn() === computerColor[0] ? "computer" : "user"
                    worker.postMessage({
                      message: "init",
                      color: computerColor,
                      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                      playerToMove,
                      difficulty,
                    })
                    dispatch({type: "reset-board"})
                    dispatch({type: "reset-score"})
                  }}
                  fontFamily="chess"
                  fontSize="30px"
                >
                  <span style={{marginBottom: "5px"}}>V</span>
                </Button>
              </Tooltip>
            ) : (
              <Tooltip label="Resign">
                <Button
                  w="100%"
                  onClick={() => {
                    dispatch({
                      type: "set-game-over",
                      payload: {isGameOver: true, winner: "computer"},
                    })
                  }}
                  fontFamily="chess"
                  fontSize="30px"
                >
                  <span style={{marginBottom: "5px"}}>Y</span>
                </Button>
              </Tooltip>
            )}
            <Tooltip label="Takeback">
              <Button
                w="100%"
                onClick={() => {
                  dispatch({type: "takeback", payload: {userColor}})
                  dispatch({type: "register-takeback"})
                  if (moves.length < 2) {
                    return
                  } else {
                    const isFullMove = moves.length % 2 === 0
                    if (userColor === "white") {
                      if (isFullMove) {
                        chess.undo()
                        chess.undo()
                      } else {
                        chess.undo()
                      }
                    } else {
                      if (isFullMove) {
                        chess.undo()
                      } else {
                        chess.undo()
                        chess.undo()
                      }
                    }
                    worker.postMessage({
                      message: "takeback",
                      payload: {movesLength: moves.length, userColor},
                    })
                  }
                }}
                fontSize="30px"
                fontFamily="chess"
              >
                <span style={{marginBottom: "5px"}}>C</span>
              </Button>
            </Tooltip>
            <Button w="100%" onClick={() => dispatch({type: "previous-move"})}>
              <ChevronLeftIcon />
            </Button>
            <Button w="100%" onClick={() => dispatch({type: "next-move"})}>
              <ChevronRightIcon />
            </Button>
          </HStack>
        </Box>
      </VStack>
    </DndProvider>
  )
}

export default MobileView
