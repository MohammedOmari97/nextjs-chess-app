import produce from "immer"
import {pieces} from "./pieces"

function getPieceNameFromCode(code) {
  if (code === "q") {
    return "queen"
  } else if (code === "r") {
    return "rook"
  } else if (code === "b") {
    return "bishop"
  } else if (code === "k") {
    return "knight"
  }
}

const game = {
  position: {
    pieces,
    sourceSquare: null,
    destinationSquare: null,
    capturedPieces: {white: [], black: []},
    fen: null,
  },
  history: [
    {
      pieces,
      sourceSquare: null,
      destinationSquare: null,
      capturedPieces: {white: [], black: []},
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    },
  ],
  stepsInHistory: 0,
  currentPosition: {
    pieces,
    sourceSquare: null,
    destinationSquare: null,
    capturedPieces: {white: [], black: []},
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  },
  moves: [],
  promotionSquare: null,
  isGameOver: false,
  isPlaying: false,
  winner: null,
}

function gameReducer(state = game, action) {
  if (action.type === "move") {
    const {source, destination, piece, promotion, enpassent, moveCode, fen} =
      action.payload

    const sourceSquare = Object.values(state.currentPosition.pieces).filter(
      (piece) => piece.square === source
    )[0]

    if (!sourceSquare) {
      return state
    }

    if (piece.name === "king" && source === "e1" && destination === "g1") {
      return produce(state, (draftState) => {
        draftState.position.pieces.king1white.square = destination
        draftState.position.pieces.rook2white.square = "f1"
        draftState.position.sourceSquare = source
        draftState.position.destinationSquare = destination
        draftState.position.fen = fen

        draftState.history.push(draftState.position)
        draftState.currentPosition = draftState.position
        draftState.moves.push({
          move: "0-0",
          moveCode,
          historyStep: draftState.moves.length + 1,
        })
        draftState.stepsInHistory = draftState.history.length - 1
      })
    } else if (
      piece.name === "king" &&
      source === "e1" &&
      destination === "c1"
    ) {
      return produce(state, (draftState) => {
        draftState.position.pieces.king1white.square = destination
        draftState.position.pieces.rook1white.square = "d1"
        draftState.position.sourceSquare = source
        draftState.position.destinationSquare = destination
        draftState.position.fen = fen

        draftState.history.push(draftState.position)
        draftState.currentPosition = draftState.position
        draftState.moves.push({
          move: "0-0-0",
          moveCode,
          historyStep: draftState.moves.length + 1,
        })
        draftState.stepsInHistory = draftState.history.length - 1
      })
    } else if (
      piece.name === "king" &&
      source === "e8" &&
      destination === "g8"
    ) {
      return produce(state, (draftState) => {
        if (draftState.position.pieces.king1black.square !== destination) {
          draftState.position.pieces.king1black.square = destination
          draftState.position.pieces.rook2black.square = "f8"
          draftState.position.sourceSquare = source
          draftState.position.destinationSquare = destination
          draftState.position.fen = fen

          draftState.history.push(draftState.position)
          draftState.currentPosition = draftState.position
          draftState.moves.push({
            move: "0-0",
            moveCode,
            historyStep: draftState.moves.length + 1,
          })
          draftState.stepsInHistory = draftState.history.length - 1
        }
      })
    } else if (
      piece.name === "king" &&
      source === "e8" &&
      destination === "c8"
    ) {
      return produce(state, (draftState) => {
        if (draftState.position.pieces.king1black.square !== destination) {
          draftState.position.pieces.king1black.square = destination
          draftState.position.pieces.rook1black.square = "d8"
          draftState.position.sourceSquare = source
          draftState.position.destinationSquare = destination
          draftState.position.fen = fen

          draftState.history.push(draftState.position)
          draftState.currentPosition = draftState.position
          draftState.moves.push({
            move: "0-0-0",
            moveCode,
            historyStep: draftState.moves.length + 1,
          })
          draftState.stepsInHistory = draftState.history.length - 1
        }
      })
    }

    const destinationSquare = Object.values(
      state.currentPosition.pieces
    ).filter((piece) => piece.square === destination)[0]

    let pieceEntry = `${sourceSquare.name}${sourceSquare.number}${sourceSquare.color}`

    return produce(state, (draftState) => {
      if (promotion) {
        let id = Math.floor(Math.random() * 10000)
        let promotionEntry = `${getPieceNameFromCode(promotion)}${id}${
          sourceSquare.color
        }`
        draftState.position.pieces[promotionEntry] = {}
        draftState.position.pieces[promotionEntry].square = destination
        draftState.position.pieces[promotionEntry].name =
          getPieceNameFromCode(promotion)
        draftState.position.pieces[promotionEntry].color = sourceSquare.color
        draftState.position.pieces[promotionEntry].number = id
        draftState.position.sourceSquare = source
        draftState.position.destinationSquare = destination
        draftState.position.fen = fen

        if (destinationSquare) {
          draftState.position.capturedPieces[destinationSquare.color].push(
            destinationSquare.name
          )
        }

        draftState.history.push(draftState.position)
        draftState.currentPosition = draftState.position
        draftState.moves.push({
          move: `${source}${destination}`,
          moveCode,
          historyStep: draftState.moves.length + 1,
        })
        draftState.stepsInHistory = draftState.history.length - 1
        if (destinationSquare) {
          delete draftState.currentPosition.pieces[
            `${destinationSquare.name}${destinationSquare.number}${destinationSquare.color}`
          ]
        }

        delete draftState.currentPosition.pieces[pieceEntry]

        return
      }

      draftState.isPlaying = true
      draftState.position.pieces[pieceEntry].square = destination
      draftState.position.sourceSquare = source
      draftState.position.destinationSquare = destination
      draftState.position.fen = fen

      if (destinationSquare) {
        draftState.position.capturedPieces[destinationSquare.color].push(
          destinationSquare.name
        )
      }

      if (enpassent) {
        const piece = Object.values(state.currentPosition.pieces).filter(
          (piece) => piece.square === enpassent
        )[0]
        draftState.position.capturedPieces[piece.color].push(piece.name)
      }

      draftState.history.push(draftState.position)
      draftState.currentPosition = draftState.position
      draftState.moves.push({
        move: `${source}${destination}`,
        moveCode,
        historyStep: draftState.moves.length + 1,
      })
      draftState.stepsInHistory = draftState.history.length - 1
      if (destinationSquare) {
        delete draftState.currentPosition.pieces[
          `${destinationSquare.name}${destinationSquare.number}${destinationSquare.color}`
        ]
      }

      if (enpassent) {
        const piece = Object.values(state.currentPosition.pieces).filter(
          (piece) => piece.square === enpassent
        )[0]
        const pieceEntry = `${piece.name}${piece.number}${piece.color}`
        delete draftState.currentPosition.pieces[pieceEntry]
      }
    })
  } else if (action.type === "takeback") {
    const {userColor} = action.payload
    if (state.moves.length < 2) {
      return state
    } else {
      const isFullMove = state.moves.length % 2 === 0
      if (userColor === "white") {
        if (isFullMove) {
          return produce(state, (draftState) => {
            draftState.history.pop()
            draftState.history.pop()
            draftState.moves.pop()
            draftState.moves.pop()
            draftState.stepsInHistory = draftState.history.length - 1
            draftState.position = draftState.history[draftState.stepsInHistory]
            draftState.currentPosition = draftState.position
          })
        } else {
          return produce(state, (draftState) => {
            draftState.history.pop()
            draftState.moves.pop()
            draftState.stepsInHistory = draftState.history.length - 1
            draftState.position = draftState.history[draftState.stepsInHistory]
            draftState.currentPosition = draftState.position
          })
        }
      } else {
        if (isFullMove) {
          return produce(state, (draftState) => {
            draftState.history.pop()
            draftState.moves.pop()
            draftState.stepsInHistory = draftState.history.length - 1
            draftState.position = draftState.history[draftState.stepsInHistory]
            draftState.currentPosition = draftState.position
          })
        } else {
          return produce(state, (draftState) => {
            draftState.history.pop()
            draftState.history.pop()
            draftState.moves.pop()
            draftState.moves.pop()
            draftState.stepsInHistory = draftState.history.length - 1
            draftState.position = draftState.history[draftState.stepsInHistory]
            draftState.currentPosition = draftState.position
          })
        }
      }
    }
  } else if (action.type === "takeback-once") {
    return produce(state, (draftState) => {
      draftState.history.pop()
      draftState.moves.pop()
      draftState.stepsInHistory = draftState.history.length - 1
      draftState.position = draftState.history[draftState.stepsInHistory]
      draftState.currentPosition = draftState.position
    })
  } else if (action.type === "next-move") {
    const index =
      state.stepsInHistory + 1 >= state.history.length
        ? state.history.length - 1
        : state.stepsInHistory + 1

    return {
      ...state,
      stepsInHistory: index,
      currentPosition: {...state.history[index]},
    }
  } else if (action.type === "previous-move") {
    const index = state.stepsInHistory - 1 <= 0 ? 0 : state.stepsInHistory - 1

    return {
      ...state,
      stepsInHistory: index,
      currentPosition: {...state.history[index]},
    }
  } else if (action.type === "first-move") {
    return produce(state, (draftState) => {
      draftState.stepsInHistory = 0
      draftState.currentPosition = draftState.history[0]
    })
  } else if (action.type === "last-move") {
    return produce(state, (draftState) => {
      const lastIndex = draftState.history.length - 1
      draftState.stepsInHistory = lastIndex
      draftState.currentPosition = draftState.history[lastIndex]
    })
  } else if (action.type === "go-to-move") {
    return produce(state, (draftState) => {
      draftState.stepsInHistory = action.payload.move
      draftState.currentPosition = draftState.history[action.payload.move]
    })
  } else if (action.type === "set-promotion-square") {
    return produce(state, (draftState) => {
      draftState.promotionSquare = action.payload.square
    })
  } else if (action.type === "reset-board") {
    return game
  } else if (action.type === "set-game-over") {
    return produce(state, (draftState) => {
      draftState.isGameOver = action.payload.isGameOver
      console.log(action.payload.winner)

      if (
        action.payload.type === "checkmate" ||
        action.payload.type === "resignation"
      ) {
        draftState.winner = action.payload.winner
        draftState.isPlaying = false
      } else if (
        action.payload.type === "draw" ||
        action.payload.type === "stalemate" ||
        action.payload.type === "threefold repetition"
      ) {
        draftState.isPlaying = false
      }
    })
  } else {
    return state
  }
}

export {gameReducer}
