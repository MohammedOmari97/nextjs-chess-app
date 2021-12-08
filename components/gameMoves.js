import {useEffect, useRef} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Button, Tooltip, VStack, Wrap, Box, HStack} from "@chakra-ui/react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons"
import {worker} from "../chessEngine/engineWorker"
import {chess, initializeChessJS, resetBoard} from "../chessEngine/chess"
import {useWindowSize} from "../utils/useWindowSize"
import useSound from "use-sound"

function MoveHistoryButton({move, ...props}) {
  const {stepsInHistory} = useSelector((state) => state.game)
  const dispatch = useDispatch()
  const buttonRef = useRef()

  useEffect(() => {
    if (stepsInHistory === move.historyStep) {
      buttonRef.current.scrollIntoView({block: "nearest"})
    }
  }, [stepsInHistory])

  return (
    <Box ref={buttonRef} w={{base: "70px", sm: "70px", md: "70px", lg: "47%"}}>
      <Button
        onClick={() => {
          dispatch({
            type: "go-to-move",
            payload: {move: move.historyStep},
          })
        }}
        w="100%"
        variant={stepsInHistory === move.historyStep ? "solid" : "ghost"}
        boxShadow={undefined}
      >
        {move.moveCode}
      </Button>
    </Box>
  )
}

function GameMoves() {
  const dispatch = useDispatch()
  const {moves, stepsInHistory, isGameOver, winner} = useSelector(
    (state) => state.game
  )
  const movesContainer = useRef()
  const {computerColor, userColor} = useSelector((state) => state.sides)
  const {difficulty} = useSelector((state) => state.difficulty)
  const {width} = useWindowSize()

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
    <VStack
      justify="space-between"
      shadow="lg"
      w={{base: "full", sm: "95%", md: "90%", lg: "300px"}}
      h={{md: "100%", lg: "500px"}}
      borderRadius="md"
      border="1px solid #e3e3e399"
    >
      <Wrap
        w="100%"
        h="100%"
        maxH={{base: "300px", sm: "300px", md: "300px", lg: "100%"}}
        overflowY="auto"
        p="10px"
        overflow="auto"
        ref={movesContainer}
      >
        {moves?.map((move, index) => {
          return <MoveHistoryButton key={`${move.move}-${index}`} move={move} />
        })}
        {result && (
          <Box
            w="100%"
            borderRadius="md"
            p="10px"
            textAlign="center"
            shadow="md"
            border="1px solid #e3e3e355"
          >
            {result}
          </Box>
        )}
      </Wrap>
      <HStack spacing="20px" p="10px">
        <Button
          onClick={() => {
            dispatch({type: "first-move"})
            movesContainer.current.scrollTo(0, 0)
          }}
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          onClick={() => {
            dispatch({type: "previous-move"})
          }}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          onClick={() => {
            dispatch({type: "next-move"})
          }}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          onClick={() => {
            dispatch({type: "last-move"})
            movesContainer.current.scrollTo(
              0,
              movesContainer.current.scrollHeight
            )
          }}
        >
          <ArrowRightIcon />
        </Button>
      </HStack>
      <HStack p="0 10px 10px 10px" width="100%" justify="center">
        <Tooltip label="Takeback">
          <Button
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
            width={{base: "25%", sm: "25%", md: "25%", lg: "100%"}}
          >
            <span style={{marginBottom: "5px"}}>C</span>
          </Button>
        </Tooltip>
        {isGameOver ? (
          <Tooltip label="New Game">
            <Button
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
              width={{base: "25%", sm: "25%", md: "25%", lg: "100%"}}
            >
              <span style={{marginBottom: "5px"}}>V</span>
            </Button>
          </Tooltip>
        ) : (
          <Tooltip label="Resign">
            <Button
              onClick={() => {
                dispatch({
                  type: "set-game-over",
                  payload: {
                    isGameOver: true,
                    winner: "computer",
                    type: "resignation",
                  },
                })
              }}
              fontFamily="chess"
              fontSize="30px"
              width={{base: "25%", sm: "25%", md: "25%", lg: "100%"}}
            >
              <span style={{marginBottom: "5px"}}>Y</span>
            </Button>
          </Tooltip>
        )}
      </HStack>
    </VStack>
  )
}

export default GameMoves
