const initialState = {
  highScore: {beginner: 0, intermediate: 0, advanced: 0, expert: 0},
  score: 0,
  takebacks: 0,
}

function scoresReducer(state = initialState, action) {
  if (action.type === "set-high-score") {
    return {
      ...state,
      highScore: {
        ...state.highScore,
        [action.payload.difficulty]: action.payload.score,
      },
    }
  } else if (action.type === "reset-score") {
    return {...state, score: 0, takebacks: 0}
  } else if (action.type === "register-takeback") {
    return {...state, takebacks: state.takebacks + 1}
  } else if (action.type === "calc-score") {
    if (!action.payload.winner) return 0
    let takebacks = state.takebacks
    let score = 0
    if (action.payload.winner === "computer") {
      return {...state, score: 0}
    } else {
      if (takebacks < 3) {
        score = 3
      } else if (takebacks >= 3 && takebacks < 7) {
        score = 2
      } else {
        score = 1
      }
    }
    if (score > state.highScore[action.payload.difficulty]) {
      return {
        ...state,
        score,
        highScore: {...state.highScore, [action.payload.difficulty]: score},
      }
    } else {
      return {...state, score}
    }
  } else if (action.type === "reset-scores") {
    return initialState
  } else {
    return state
  }
}

export {scoresReducer}
