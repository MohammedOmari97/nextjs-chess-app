import * as Chess from "chess.js"

let chess
if (typeof window !== "undefined") {
  chess = new Chess()
}

function initializeChessJS(fen) {
  chess = new Chess(fen)
}

function resetBoard() {
  chess = new Chess()
}

export {chess, resetBoard, initializeChessJS}
