function sidesReducer(state = {userColor: null, computerColor: null}, action) {
  if (action.type === "set-user-color") {
    const userColor = action.payload.color
    const computerColor = userColor === "white" ? "black" : "white"
    return {userColor, computerColor}
  } else {
    return state
  }
}

export {sidesReducer}
