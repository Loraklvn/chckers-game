export const player1PieceColor = "black";
export const player2PieceColor = "white";
const darker = "#BA7A3A";
const lighter = "#F0D2B4";

export type SquareType = {
  id: number;
  color: string;
  acceptPiece: boolean;
  hasAPiece: boolean;
  pieceColor: string;
  player: number;
  isAking: boolean;
};

const initialBoard: SquareType[] = [];

const returnSquareProperties = (num: number) => {
  const player2Properties = {
    color: darker,
    hasAPiece: true,
    pieceColor: player2PieceColor,
    player: 2,
    isAking: false,
  };
  const noPlayerProperties = {
    color: darker,
    hasAPiece: false,
    pieceColor: "",
    player: 0,
    isAking: false,
  };

  const player1Properties = {
    color: darker,
    hasAPiece: true,
    pieceColor: player1PieceColor,
    player: 1,
    isAking: false,
  };

  if (num < 8 && num % 2 !== 0) {
    return player2Properties;
  } else if (num > 7 && num < 16 && num % 2 === 0) {
    return player2Properties;
  } else if (num > 15 && num < 24 && num % 2 !== 0) {
    return player2Properties;
  } else if (num > 23 && num < 32 && num % 2 === 0) {
    return noPlayerProperties;
  } else if (num > 31 && num < 40 && num % 2 !== 0) {
    return noPlayerProperties;
  } else if (num > 39 && num < 48 && num % 2 === 0) {
    return player1Properties;
  } else if (num > 47 && num < 56 && num % 2 !== 0) {
    return player1Properties;
  } else if (num > 55 && num % 2 === 0) {
    return player1Properties;
  } else {
    return {
      color: lighter,
      hasAPiece: false,
      pieceColor: "",
      player: 0,
      isAking: false,
    };
  }
};

const createBoardSquares = (id: number) => {
  if (id > 63) return;

  const { hasAPiece, pieceColor, player, color, isAking } =
    returnSquareProperties(id);

  initialBoard.push({
    id,
    color,
    acceptPiece: color === darker,
    hasAPiece,
    pieceColor,
    player,
    isAking,
  });
  createBoardSquares(id + 1);
};

export const generatePieces = () => createBoardSquares(0);
