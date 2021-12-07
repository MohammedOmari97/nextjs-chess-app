import {engine} from "./engine"

const difficulties = {
  beginner: 1,
  intermediate: 5,
  advanced: 10,
  expert: 12,
}

let difficulty = difficulties.beginner

addEventListener("message", (event) => {
  if (event.data.message === "init") {
    difficulty = difficulties[event.data.difficulty]
    // engine.setBoard(engine.START_FEN)
    engine.setBoard(event.data.fen)
    // if (event.data.color === "white") {
    if (event.data.playerToMove === "computer") {
      let bestMove = engine.search(difficulty)
      engine.makeMove(bestMove)
      postMessage({move: bestMove})
    }
    postMessage("board set up")
  } else if (event.data.message === "calc-move") {
    let promotionPiece = event.data.payload.promotion
    let userMove = engine.moveFromString(
      promotionPiece
        ? `${event.data.payload.move}${promotionPiece}`
        : event.data.payload.move
    )
    engine.makeMove(userMove)
    // let bestMove = engine.searchTime(100)
    // let bestMove = engine.search(1)
    let bestMove = engine.search(difficulty)
    engine.makeMove(bestMove)
    postMessage({
      message: "done calculating!",
      move: bestMove,
      promotion: {
        getMovePromoted: engine.getMovePromoted(bestMove),
        promotedToString: engine.promotedToString(
          engine.getMovePromoted(bestMove)
        ),
      },
      difficulty,
    })
  } else if (event.data.message === "set-difficulty") {
    difficulty = difficulties[event.data.difficulty]
  } else if (event.data.message === "takeback") {
    const {userColor, movesLength} = event.data.payload
    const isFullMove = movesLength > 1 && movesLength % 2 === 0
    if (userColor === "white") {
      if (isFullMove) {
        engine.takeBack()
        engine.takeBack()
      } else {
        engine.takeBack() //
        engine.takeBack()
      }
    } else {
      if (isFullMove) {
        engine.takeBack()
      } else {
        engine.takeBack()
        engine.takeBack()
      }
    }
  }
})
