import {combineReducers, createStore} from "redux"
import {gameReducer} from "./gameReducer"
import {boardOrientationReducer} from "./boardOrientationReducer"
import {animationReducer} from "./doAnimationReducer"
import {difficultyReducer} from "./difficultyReducer"
import {hoveredSquareReducer} from "./hoveredSquareReducer"
import {selectedSquareReducer} from "./selectedSquareReducer"
import {sidesReducer} from "./sidesReducer"
import {appearanceReducer} from "./appearanceReducer"
import {scoresReducer} from "./scoresReducer"
import {arrowsReducer} from "./arrowsReducer"
import {settingsReducer} from "./settings"

import {persistStore, persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"

// const store = createStore(
//   combineReducers({
//     game: gameReducer,
//     hoveredSquare: hoveredSquareReducer,
//     selectedSquare: selectedSquareReducer,
//     difficulty: difficultyReducer,
//     doAnimation: animationReducer,
//     sides: sidesReducer,
//     boardOrientation: boardOrientationReducer,
//     appearance: appearanceReducer,
//   })
// )
const store = createStore(
  persistReducer(
    {key: "root", storage},
    combineReducers({
      game: persistReducer({key: "game", storage}, gameReducer),
      hoveredSquare: hoveredSquareReducer,
      selectedSquare: selectedSquareReducer,
      difficulty: persistReducer(
        {key: "difficulty", storage},
        difficultyReducer
      ),
      doAnimation: animationReducer,
      sides: persistReducer({key: "sides", storage}, sidesReducer),
      boardOrientation: persistReducer(
        {key: "boardOrientation", storage},
        boardOrientationReducer
      ),
      appearance: persistReducer(
        {key: "appearance", storage},
        appearanceReducer
      ),
      scores: persistReducer({key: "scores", storage}, scoresReducer),
      arrows: arrowsReducer,
      settings: settingsReducer,
    })
  )
)

const persistor = persistStore(store)

export {store, persistor}
