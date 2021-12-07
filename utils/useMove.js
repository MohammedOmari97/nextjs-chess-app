import {chess} from "../chessEngine/chess"
import {worker} from "../chessEngine/engineWorker"
import {useDispatch} from "react-redux"
import useSound from "use-sound"

function useMove() {
  const dispatch = useDispatch()

  const [playMoveSound] = useSound("./sounds/move.mp3")
  const [playCaptureSound] = useSound("./sounds/take.mp3")
  const [playCheckSound] = useSound("./sounds/check.mp3")
  const [playCastleSound] = useSound("./sounds/castle.mp3")
  const [playPromotionSound] = useSound("./sounds/promotion.mp3")

  function move(move, piece, options, computer = false) {
    const sideToMove = chess.turn()
    if (options && options.promotion) {
      const moveCode = chess
        .moves({verbose: true})
        .find((_move) => _move.from === move.from && _move.to === move.to)?.san
      if (!moveCode) return
      dispatch({type: "set-hovered-square", payload: {square: null}})
      chess.move({
        from: move.from,
        to: move.to,
        promotion: options.promotion,
      })
      const fen = chess.fen()
      dispatch({
        type: "move",
        payload: {
          source: move.from,
          destination: move.to,
          piece,
          promotion: options.promotion,
          moveCode,
          fen,
        },
      })
      if (!computer) {
        worker.postMessage({
          message: "calc-move",
          payload: {
            move: `${move.from}${move.to}`,
            promotion:
              sideToMove === "w"
                ? options.promotion.toUpperCase()
                : options.promotion.toLowerCase(),
          },
        })
      }
      dispatch({
        type: "set-promotion-square",
        payload: {square: null},
      })
      dispatch({
        type: "set-selected-square",
        payload: {selectedSquare: null},
      })

      return
    }

    const moveInfo = chess.moves({verbose: true}).find((_move) => {
      return _move.from === move.from && _move.to === move.to
    })
    if (!moveInfo) return
    const moveCode = moveInfo.san
    const moveFlags = moveInfo.flags
    if (moveFlags === "p" || moveFlags === "cp" || moveFlags === "np") {
      if (!computer) {
        dispatch({type: "set-promotion-square", payload: {square: move.to}})
        return
      }
    } else if (moveFlags === "e") {
      const file = move.to[0]
      const posInFile = move.to[1]
      const enpassentTakenSquare = `${file}${
        sideToMove === "w" ? Number(posInFile) - 1 : Number(posInFile) + 1
      }`
      chess.move({from: move.from, to: move.to})
      const fen = chess.fen()
      dispatch({
        type: "move",
        payload: {
          source: move.from,
          destination: move.to,
          piece,
          enpassent: enpassentTakenSquare,
          moveCode,
          fen,
        },
      })
      dispatch({type: "set-hovered-square", payload: {square: null}})
      dispatch({
        type: "set-selected-square",
        payload: {selectedSquare: null},
      })
      if (!computer) {
        worker.postMessage({
          message: "calc-move",
          payload: {move: `${move.from}${move.to}`},
        })
      }
      return
    }

    dispatch({type: "set-hovered-square", payload: {square: null}})
    chess.move({from: move.from, to: move.to})
    const fen = chess.fen()
    dispatch({
      type: "move",
      payload: {source: move.from, destination: move.to, piece, moveCode, fen},
    })

    dispatch({
      type: "set-selected-square",
      payload: {selectedSquare: null},
    })
    if (!computer) {
      worker.postMessage({
        message: "calc-move",
        payload: {move: `${move.from}${move.to}`},
      })
    }
  }

  return {move}
}

export {useMove}
