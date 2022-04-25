const initialState = {
  boardTheme: "bubblegum",
  piecesTheme: "neo",
  isBoardFlipped: false,
}

function appearanceReducer(state = initialState, action) {
  if (action.type === "set-board-theme") {
    return {...state, boardTheme: action.payload.boardTheme}
  } else if (action.type === "set-pieces-theme") {
    return {...state, piecesTheme: action.payload.piecesTheme}
  } else if (action.type === "set-is-board-flipped") {
    return {
      ...state,
      isBoardFlipped: action.payload.isFlipped,
      isFlipped: action.payload.isFlipped,
    }
  } else if (action.type === "flip-board") {
    return {...state, isBoardFlipped: !state.isBoardFlipped}
  } else {
    return state
  }
}

export {appearanceReducer}
