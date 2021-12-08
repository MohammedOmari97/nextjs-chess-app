function sidesReducer(
  state = {userColor: "white", computerColor: "black"},
  action
) {
  if (action.type === "set-user-color") {
    const userColor = action.payload.color
    const computerColor = userColor === "white" ? "black" : "white"
    return {userColor, computerColor}
  } else {
    return state
  }
}

export {sidesReducer}
