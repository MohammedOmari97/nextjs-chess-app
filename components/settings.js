import {
  Portal,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ButtonGroup,
  Box,
  Grid,
  useDisclosure,
  Select,
  VStack,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react"
import {useEffect, useRef, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useWindowSize} from "../utils/useWindowSize"

function BoardPreview({boardTheme, piecesTheme}) {
  return (
    <Grid
      templateColumns="repeat(8, 1fr)"
      templateRows="repeat(3, 1fr)"
      backgroundImage={`url(/boardThemes/${boardTheme}.png)`}
      backgroundSize="cover"
      w={{base: "250px", sm: "300px", md: "100%", lg: "100%"}}
      h={{base: "93px", sm: "112px", md: "198px", lg: "198px"}}
      margin="auto"
      mb={3}
    >
      <Box w="100%" h="100%">
        <Box
          w="100%"
          h="100%"
          backgroundSize="cover"
          backgroundImage={`url(/pieces/${piecesTheme}-rook-black.png)`}
        />
      </Box>
      <Box w="100%" h="100%">
        <Box
          w="100%"
          h="100%"
          backgroundSize="cover"
          backgroundImage={`url(/pieces/${piecesTheme}-knight-black.png)`}
        />
      </Box>
      <Box w="100%" h="100%">
        <Box
          w="100%"
          h="100%"
          backgroundSize="cover"
          backgroundImage={`url(/pieces/${piecesTheme}-bishop-black.png)`}
        />
      </Box>
      <Box w="100%" h="100%">
        <Box
          w="100%"
          h="100%"
          backgroundSize="cover"
          backgroundImage={`url(/pieces/${piecesTheme}-queen-black.png)`}
        />
      </Box>
      <Box w="100%" h="100%">
        <Box
          w="100%"
          h="100%"
          backgroundSize="cover"
          backgroundImage={`url(/pieces/${piecesTheme}-king-black.png)`}
        />
      </Box>
      <Box w="100%" h="100%">
        <Box
          w="100%"
          h="100%"
          backgroundSize="cover"
          backgroundImage={`url(/pieces/${piecesTheme}-bishop-black.png)`}
        />
      </Box>
      <Box w="100%" h="100%">
        <Box
          w="100%"
          h="100%"
          backgroundSize="cover"
          backgroundImage={`url(/pieces/${piecesTheme}-knight-black.png)`}
        />
      </Box>
      <Box w="100%" h="100%">
        <Box
          w="100%"
          h="100%"
          backgroundSize="cover"
          backgroundImage={`url(/pieces/${piecesTheme}-rook-black.png)`}
        />
      </Box>
      {Array(8)
        .fill(null)
        .map((piece, i) => {
          return (
            <Box key={i} w="100%" h="100%">
              <Box
                w="100%"
                h="100%"
                backgroundSize="cover"
                backgroundImage={`url(/pieces/${piecesTheme}-pawn-black.png)`}
              />
            </Box>
          )
        })}
      {Array(8)
        .fill(null)
        .map((piece, i) => {
          return <Box key={i} w="100%" h="100%" />
        })}
    </Grid>
  )
}

function Settings() {
  const {isOpen, onClose, onOpen} = useDisclosure()
  const {
    boardTheme: _boardTheme,
    piecesTheme: _piecesTheme,
    isBoardFlipped: _isBoardFlipped,
  } = useSelector((state) => state.appearance)
  const boardThemeRef = useRef(_boardTheme)
  const piecesThemeRef = useRef(_piecesTheme)
  const [boardTheme, setBoardTheme] = useState(_boardTheme)
  const [piecesTheme, setPiecesTheme] = useState(_piecesTheme)
  const [isBoardFlipped, setIsBoardFlipped] = useState(false)
  let isBoardFlippedRef = useRef(isBoardFlipped)
  const dispatch = useDispatch()
  const {showSettings} = useSelector((state) => state.settings)
  const {width, height} = useWindowSize()
  let hideSettingsIcon
  if ((width > height && width <= 850) || width <= 600) {
    hideSettingsIcon = true
  } else {
    hideSettingsIcon = false
  }

  return (
    <Portal>
      <Button
        fontFamily="chess"
        style={{position: "absolute", top: "10px", right: "10px"}}
        variant="ghost"
        fontSize="30px"
        onClick={() => {
          onOpen()
          dispatch({type: "show-settings"})
        }}
        display={hideSettingsIcon ? "none" : "flex"}
      >
        <span style={{marginBottom: "5px"}}>·</span>
      </Button>
      <Modal
        onClose={() => {
          onClose()
          setBoardTheme(boardThemeRef)
          setPiecesTheme(piecesThemeRef)
          dispatch({type: "hide-settings"})
        }}
        size="xl"
        isOpen={showSettings}
        isCentered
        scrollBehavior="outside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <BoardPreview boardTheme={boardTheme} piecesTheme={piecesTheme} />
              <VStack>
                <Box w="100%">
                  <label htmlFor="board-theme">Select a board theme:</label>
                  <Select
                    value={boardTheme}
                    placeholder="Select board theme"
                    onChange={(e) => setBoardTheme(e.target.value)}
                    id="board-theme"
                    isRequired
                  >
                    <option value="bases">Bases</option>
                    <option value="blue">Blue</option>
                    <option value="bubblegum">Bubblegum</option>
                    <option value="dark-wood">Dark Wood</option>
                    <option value="green">Green</option>
                    <option value="icy-sea">Icy Sea</option>
                    <option value="light">Light</option>
                    <option value="marble">Marble</option>
                    <option value="orange">Orange</option>
                    <option value="parchment">Parchment</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                    <option value="sky">Sky</option>
                    <option value="walnut">Walnut</option>
                  </Select>
                </Box>
                <Box w="100%">
                  <label htmlFor="pieces-theme">Select pieces theme:</label>
                  <Select
                    value={piecesTheme}
                    placeholder="Select pieces theme"
                    onChange={(e) => setPiecesTheme(e.target.value)}
                    id="pieces-theme"
                    isRequired
                  >
                    <option value="neo">Neo</option>
                    <option value="neo-wood">Neo Wood</option>
                    <option value="wood">Wood</option>
                    <option value="glass">Glass</option>
                    <option value="cases">Cases</option>
                    <option value="icy-sea">Icy Sea</option>
                  </Select>
                </Box>
                <FormControl
                  display="flex"
                  alignItems="center"
                  onChange={(e) => {
                    setIsBoardFlipped(!isBoardFlipped)
                  }}
                >
                  <FormLabel htmlFor="flip-board" mb="0">
                    Flip board
                  </FormLabel>
                  <Switch isChecked={isBoardFlipped} id="flip-board" />
                </FormControl>
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button
                onClick={() => {
                  onClose()
                  setIsBoardFlipped(isBoardFlippedRef.current)
                  setBoardTheme(boardThemeRef.current)
                  setPiecesTheme(piecesThemeRef.current)
                  dispatch({type: "hide-settings"})
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  if (isBoardFlipped !== isBoardFlippedRef.current) {
                    dispatch({type: "flip-board"})
                  }
                  isBoardFlippedRef.current = isBoardFlipped
                  boardThemeRef.current = boardTheme
                  piecesThemeRef.current = piecesTheme
                  dispatch({type: "set-board-theme", payload: {boardTheme}})
                  dispatch({type: "set-pieces-theme", payload: {piecesTheme}})
                  onClose()
                  dispatch({type: "hide-settings"})
                }}
              >
                Save
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Portal>
  )
}

export default Settings
