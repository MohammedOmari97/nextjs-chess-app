import Image from "next/image"
import {Box, Heading, HStack} from "@chakra-ui/layout"
import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"

function SelectColor() {
  const {userColor} = useSelector((state) => state.sides)
  const dispatch = useDispatch()

  return (
    <Box marginTop={10}>
      <Heading mb={4} as="h2" size="lg" textAlign="center" opacity={0.85}>
        Pick a side
      </Heading>
      <HStack justifyContent="center" spacing={20}>
        <Box
          boxShadow={
            userColor === "black"
              ? "0px 1px 2px #037ef388"
              : "0px 1px 2px rgba(0, 0, 0, 0.2)"
          }
          bg={userColor === "black" ? "#037ef3dd" : "#eeeeee44"}
          borderRadius="25px"
          transition=".3s ease"
          cursor="pointer"
          padding="3"
        >
          <input
            type="radio"
            id="darkColor"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0,
              visibility: "hidden",
            }}
            onChange={(e) => {
              e.preventDefault()
              dispatch({type: "set-user-color", payload: {color: "black"}})
              // dispatch({type: "set-is-flipped", payload: {isFlipped: true}})
              dispatch({
                type: "set-is-board-flipped",
                payload: {isBoardFlipped: true},
              })
            }}
            name="user color"
          />
          <label htmlFor="darkColor">
            <Box>
              <Image
                src="/pieces/neo-queen-black.png"
                alt="user dark color"
                width={70}
                height={70}
              />
            </Box>
          </label>
        </Box>
        <Box
          boxShadow={
            userColor === "white"
              ? "0px 1px 2px #037ef388"
              : "0px 1px 2px rgba(0, 0, 0, 0.2)"
          }
          bg={userColor === "white" ? "#037ef3dd" : "#eeeeee44"}
          borderRadius="25px"
          transition=".3s ease"
          cursor="pointer"
          padding="3"
        >
          <input
            type="radio"
            id="lightColor"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0,
              visibility: "hidden",
            }}
            onChange={(e) => {
              e.preventDefault()
              dispatch({type: "set-user-color", payload: {color: "white"}})
              // dispatch({type: "set-is-flipped", payload: {isFlipped: false}})
              dispatch({
                type: "set-is-board-flipped",
                payload: {isBoardFlipped: false},
              })
            }}
            name="user color"
          />
          <label htmlFor="lightColor">
            <Box>
              <Image
                src="/pieces/neo-queen-white.png"
                alt="user light color"
                width={70}
                height={70}
              />
            </Box>
          </label>
        </Box>
      </HStack>
    </Box>
  )
}

export default SelectColor
