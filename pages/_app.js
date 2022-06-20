import {ChakraProvider, extendTheme} from "@chakra-ui/react"
import {createBreakpoints} from "@chakra-ui/theme-tools"
import {Provider} from "react-redux"
import {store, persistor} from "../store/store"
import "../styles/globals.css"
import {CSSReset} from "@chakra-ui/css-reset"
import {PersistGate} from "redux-persist/lib/integration/react"
import {Component, useState, useLayoutEffect} from "react"

const breakpoints = createBreakpoints({
  sm: "530px",
  md: "615px",
  lg: "980px",
  xl: "1280px",
})

const theme = extendTheme({
  fonts: {
    body: "whitney book regular",
    heading: "whitney bold",
  },
  breakpoints,
})

const config = (theme) => {
  return {
    light: {
      bg: "#e3e3e315",
    },
  }
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
  }

  componentDidCatch(error) {}

  render() {
    return this.props.children
  }
}

function MyApp({Component, pageProps}) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ChakraProvider theme={theme}>
            <CSSReset config={config} />
            <Component {...pageProps} />
          </ChakraProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  )
}

export default MyApp
