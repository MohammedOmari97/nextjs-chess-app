function selectedSquareReducer(state = {square: null, piece: null}, action) {
  if (action.type === "set-selected-square") {
    return {
      square: action.payload.selectedSquare,
      piece: action.payload.piece && action.payload.piece,
    }
  } else {
    return state
  }
}

export {selectedSquareReducer}
