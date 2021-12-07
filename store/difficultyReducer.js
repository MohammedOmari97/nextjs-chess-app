const searchDepth = {
  beginner: 5,
  intermediate: 10,
  advanced: 20,
  expert: 25,
}

function difficultyReducer(
  state = {difficulty: "beginner", searchDepth: 5},
  action
) {
  if (action.type === "set-difficulty") {
    return {
      difficulty: action.payload.difficulty,
      searchDepth: searchDepth[action.payload.difficulty] ?? null,
    }
  } else {
    return state
  }
}

export {difficultyReducer}
