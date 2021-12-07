import {HStack} from "@chakra-ui/layout"
import Image from "next/image"

function getCapturedPiecesImages(capturedPieces, color, theme) {
  const allImages = []
  let capturedPiecesImages = []
  capturedPieces.capturedQueens.forEach((piece, i) => {
    capturedPiecesImages.push(
      <Image
        key={`${piece}-${color}-${i}`}
        layout="fixed"
        src={`/pieces/${theme}-${piece}-${color}.png`}
        alt={`captured ${color} ${piece}`}
        width={20}
        height={20}
      />
    )
  })
  allImages.push(<HStack spacing="-2px">{capturedPiecesImages}</HStack>)
  capturedPiecesImages = []
  capturedPieces.capturedRooks.forEach((piece, i) => {
    capturedPiecesImages.push(
      <Image
        key={`${piece}-${color}-${i}`}
        layout="fixed"
        src={`/pieces/${theme}-${piece}-${color}.png`}
        alt={`captured ${color} ${piece}`}
        width={20}
        height={20}
      />
    )
  })
  allImages.push(<HStack spacing="-2px">{capturedPiecesImages}</HStack>)
  capturedPiecesImages = []
  capturedPieces.capturedBishops.forEach((piece, i) => {
    capturedPiecesImages.push(
      <Image
        key={`${piece}-${color}-${i}`}
        layout="fixed"
        src={`/pieces/${theme}-${piece}-${color}.png`}
        alt={`captured ${color} ${piece}`}
        width={20}
        height={20}
      />
    )
  })
  allImages.push(<HStack spacing="-2px">{capturedPiecesImages}</HStack>)
  capturedPiecesImages = []
  capturedPieces.capturedKnights.forEach((piece, i) => {
    capturedPiecesImages.push(
      <Image
        key={`${piece}-${color}-${i}`}
        layout="fixed"
        src={`/pieces/${theme}-${piece}-${color}.png`}
        alt={`captured ${color} ${piece}`}
        width={20}
        height={20}
      />
    )
  })
  allImages.push(<HStack spacing="-2px">{capturedPiecesImages}</HStack>)
  capturedPiecesImages = []
  capturedPieces.capturedPawns.forEach((piece, i) => {
    capturedPiecesImages.push(
      <Image
        key={`${piece}-${color}-${i}`}
        layout="fixed"
        src={`/pieces/${theme}-${piece}-${color}.png`}
        alt={`captured ${color} ${piece}`}
        width={20}
        height={20}
      />
    )
  })
  allImages.push(<HStack spacing="-2px">{capturedPiecesImages}</HStack>)
  capturedPiecesImages = []
  return allImages
}

export {getCapturedPiecesImages}
