const initialState = {
  startSquare: null,
  endSquare: null,
  arrows: [],
  highlightedSquares: [],
}

function arrowsReducer(state = initialState, action) {
  if (action.type === "set-start-square") {
    return {...state, startSquare: action.payload.startSquare}
  } else if (action.type === "set-end-square") {
    if (!state.startSquare) {
      return state
    } else if (state.startSquare === action.payload.endSquare) {
      if (state.highlightedSquares.includes(state.startSquare)) {
        const highlightedSquares = state.highlightedSquares.filter(
          (square) => square !== state.startSquare
        )
        return {...state, highlightedSquares}
      } else {
        return {
          ...state,
          highlightedSquares: [...state.highlightedSquares, state.startSquare],
        }
      }
    } else {
      const {endSquare} = action.payload
      const removeArrow = state.arrows.some(
        (arrow) => arrow[0] === state.startSquare && arrow[1] === endSquare
      )
      if (removeArrow) {
        let arrows = state.arrows.filter((arrow) => {
          if (arrow[0] === state.startSquare && arrow[1] === endSquare) {
            return false
          } else {
            return true
          }
        })
        return {...state, arrows}
      } else {
        return {
          ...state,
          startSquare: null,
          endSquare: null,
          arrows: [...state.arrows, [state.startSquare, endSquare]],
        }
      }
    }
  } else if (action.type === "reset-arrows") {
    return {...state, arrows: [], highlightedSquares: []}
  } else {
    return state
  }
}

export {arrowsReducer}
