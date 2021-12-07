import {useDrag} from "react-dnd"
import {useDispatch, useSelector} from "react-redux"
import {chess} from "../chessEngine/chess"
import {motion} from "framer-motion"
import {useRef, useState, useLayoutEffect, useEffect, memo} from "react"
import {useForceUpdate} from "../utils/useForceUpdate"

function getRandomNumber(n) {
  return Math.floor(Math.random() * n)
}

function Piece({name, color, number, square}) {
  const dispatch = useDispatch()
  const {isGameOver} = useSelector((state) => state.game)
  const selectedSquare = useSelector((state) => state.selectedSquare)
  const {userColor} = useSelector((state) => state.sides)
  const {piecesTheme} = useSelector((state) => state.appearance)
  const {doAnimation} = useSelector((state) => state.doAnimation)
  const forceUpdate = useForceUpdate()
  const [collected, drag, _dragPreview] = useDrag({
    type: "piece",
    item: {name, square, color, number},
    collect: (monitor) => {
      return {isDragging: monitor.isDragging()}
    },
    end: () => {
      dispatch({type: "set-hovered-square", payload: {square: null}})
    },
  })

  const canTakePiece =
    selectedSquare.square &&
    chess
      .moves({square: selectedSquare.square, verbose: true})
      .some((move) => move.to === square)

  useLayoutEffect(() => {
    if (collected.isDragging) {
      dispatch({type: "set-selected-square", payload: {square: null}})
      dispatch({type: "set-do-animation", payload: {doAnimation: false}})
    } else {
      dispatch({type: "set-do-animation", payload: {doAnimation: true}})
    }
  }, [collected, dispatch])

  return (
    <motion.div
      layoutId={`${name}-${number}-${color}`}
      ref={drag}
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(/pieces/${piecesTheme}-${name}-${color}.png)`,
        backgroundSize: "contain",
        opacity: collected.isDragging ? 0 : 1,
        cursor: collected.isDragging ? "grabbing" : "grab",
      }}
      onClick={() => {
        if (isGameOver) return
        if (selectedSquare.square === square) {
          dispatch({
            type: "set-selected-square",
            payload: {selectedSquare: null},
          })
        } else if (canTakePiece) {
          return
        } else {
          dispatch({type: "set-do-animation", payload: {doAnimation: true}})
          dispatch({
            type: "set-selected-square",
            payload: {
              selectedSquare: square,
              piece: {name, color, number, square},
            },
          })
        }
      }}
    />
  )
}

export default Piece
