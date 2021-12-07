function boardOrientationReducer(state = {isFlipped: false}, action) {
  if (action.type === "flip-board$$") {
    return {isFlipped: !state.isFlipped}
  } else if (action.type === "set-is-flipped") {
    return {isFlipped: action.payload.isFlipped}
  } else {
    return state
  }
}

export {boardOrientationReducer}
