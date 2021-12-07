import {Box, VStack} from "@chakra-ui/layout"
import Image from "next/image"
import {useMove} from "../utils/useMove"
import styles from "./styles/promotionPopup.module.scss"
import {useSelector} from "react-redux"
import {useMediaQuery} from "@chakra-ui/media-query"

function PromotionPopup({squareName, sourceSquare}) {
  const selectedSquare = useSelector((state) => state.selectedSquare)
  const {promotionSquare} = useSelector((state) => state.game)
  const {move} = useMove()
  // const isLandscape = window.innerHeight < window.innerWidth
  const {piecesTheme} = useSelector((state) => state.appearance)
  const {userColor} = useSelector((state) => state.sides)
  const [isLandscape] = useMediaQuery("(orientation: landscape)")
  const [isMobile] = useMediaQuery("(max-width: 850px")

  return (
    <>
      {promotionSquare ? (
        <Box
          position="absolute"
          zIndex={500}
          top={isLandscape && isMobile ? "50%" : 0}
          left={isLandscape && isMobile ? "calc(100% + 30px)" : 0}
          w={isLandscape && isMobile ? "auto" : "100%"}
          transform={
            isLandscape && isMobile ? "translate(-50%, -50%)" : undefined
          }
          background="white"
          p="5px"
          borderRadius="5px"
          shadow="md"
        >
          <VStack>
            <button
              // w="100%"
              className={styles.promotionButton}
              onClick={() => {
                const sourceSquare = selectedSquare
                  ? selectedSquare.square
                  : sourceSquare.current.square
                const piece = selectedSquare
                  ? selectedSquare.piece
                  : sourceSquare.current
                move({from: sourceSquare, to: squareName}, piece, {
                  promotion: "q",
                })
              }}
            >
              <Image
                src={`/pieces/${piecesTheme}-queen-${userColor}.png`}
                alt="queen piece"
                layout="fill"
              />
            </button>
            <button
              className={styles.promotionButton}
              onClick={() => {
                const sourceSquare = selectedSquare
                  ? selectedSquare.square
                  : sourceSquare.current.square
                const piece = selectedSquare
                  ? selectedSquare.piece
                  : sourceSquare.current
                move({from: sourceSquare, to: squareName}, piece, {
                  promotion: "r",
                })
              }}
              w="100%"
            >
              <Image
                src={`/pieces/${piecesTheme}-rook-${userColor}.png`}
                alt="queen piece"
                layout="fill"
              />
            </button>
            <button
              className={styles.promotionButton}
              onClick={() => {
                const sourceSquare = selectedSquare
                  ? selectedSquare.square
                  : sourceSquare.current.square
                const piece = selectedSquare
                  ? selectedSquare.piece
                  : sourceSquare.current
                move({from: sourceSquare, to: squareName}, piece, {
                  promotion: "b",
                })
              }}
              w="100%"
            >
              <Image
                src={`/pieces/${piecesTheme}-bishop-${userColor}.png`}
                alt="queen piece"
                layout="fill"
              />
            </button>
            <button
              className={styles.promotionButton}
              onClick={() => {
                const sourceSquare = selectedSquare
                  ? selectedSquare.square
                  : sourceSquare.current.square
                const piece = selectedSquare
                  ? selectedSquare.piece
                  : sourceSquare.current
                move({from: sourceSquare, to: squareName}, piece, {
                  promotion: "k",
                })
              }}
              w="100%"
            >
              <Image
                src={`/pieces/${piecesTheme}-knight-${userColor}.png`}
                alt="queen piece"
                layout="fill"
              />
            </button>
          </VStack>
        </Box>
      ) : null}
    </>
  )
}

export default PromotionPopup
