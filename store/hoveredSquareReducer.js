function hoveredSquareReducer(state = null, action) {
  if (action.type === "set-hovered-square") {
    return action.payload.square
  } else {
    return state
  }
}

export {hoveredSquareReducer}
