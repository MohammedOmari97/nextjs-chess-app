function animationReducer(state = {doAnimation: true}, action) {
  if (action.type === "set-do-animation") {
    return {doAnimation: action.payload.doAnimation}
  } else {
    return state
  }
}

export {animationReducer}
