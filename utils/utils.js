const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

function getSquareNameFromIndex(index) {
  const file = files[index % 8];

  return `${file}${8 - Math.floor(index / 8)}`;
}

function getSquareColorFromName(name) {
  const fileIndex = files.indexOf(name[0]) + 1;

  if (fileIndex % 2 === 0) {
    if (name[1] % 2 === 0) {
      return "dark";
    } else {
      return "light";
    }
  } else {
    if (name[1] % 2 !== 0) {
      return "dark";
    } else {
      return "light";
    }
  }
}

export { getSquareColorFromName, getSquareNameFromIndex };
