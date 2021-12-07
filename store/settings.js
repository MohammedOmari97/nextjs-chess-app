function settingsReducer(state = {showSettings: false}, action) {
  if (action.type === "show-settings") {
    return {...state, showSettings: true}
  } else if (action.type === "hide-settings") {
    return {...state, showSettings: false}
  } else {
    return state
  }
}

export {settingsReducer}
