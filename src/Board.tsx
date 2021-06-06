/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
// import { LightenDarkenColor } from 'lighten-darken-color';
import Piece from "./Piece";

const darker = "#BA7A3A";
const lighter = "#F0D2B4";
export const player1PieceColor = "black";
export const player2PieceColor = "white";

type SquareType = {
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

createBoardSquares(0);

const initialSquare: SquareType = {
  id: 0,
  color: "",
  acceptPiece: false,
  hasAPiece: false,
  pieceColor: "",
  player: 0,
  isAking: false,
};
const initialCordinates = {
  currentPiecePosition: 0,
  nextPosition: 0,
  currentPieceSelected: initialSquare,
  nextSquare: initialSquare,
};

type PlayersScoreType = {
  player1: number;
  player2: number;
};

type PropsType = {
  passCurrentTurn: (turn: number) => void;
  passPlayersScore: (props: PlayersScoreType) => void;
};
const Board = ({
  passCurrentTurn,
  passPlayersScore,
}: PropsType): React.ReactElement => {
  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [coordinates, setCoordinates] = useState(initialCordinates);
  const { currentPiecePosition, currentPieceSelected } = coordinates;
  const [possibleMovesIndexes, setPossibleMovesIndexes] = useState<number[]>(
    []
  );
  const [piecesWithValidMovesIndexes, setPiecesWithValidMovesIndexes] =
    useState<number[]>([]);
  const [playersScore, setPlayersScore] = useState<PlayersScoreType>({
    player1: 0,
    player2: 0,
  });
  const [userMustKeepJumping, setUserMustKeepJumping] = useState(false);
  const [playerWinner, setPlayerWinner] = useState(0);

  console.log("playersScore: ", playersScore);

  useEffect(() => {
    if (playerWinner) {
      alert(`Black ${playerWinner} Won`);
    }
  }, [playerWinner]);

  useEffect(() => {
    //DETERMINE IF ONE PLAYER JUMPED ALL OPONENT'S PIECES
    playersScore.player1 === 12 && setPlayerWinner(1);
    playersScore.player2 === 12 && setPlayerWinner(2);
  }, [playersScore]);

  const checkForPlayerWithNoLegalMoves = (currentBoard: SquareType[]) => {
    const player1Pieces = currentBoard
      .map((piece, index) => ({ ...piece, index }))
      .filter((piece) => piece.player === 1);
    const player2Pieces = currentBoard
      .map((piece, index) => ({ ...piece, index }))
      .filter((piece) => piece.player === 2);

    const player1HasMoves = player1Pieces.some(
      (piece) => returnPiecePlays(piece, piece.index).length
    );
    const player2HasMoves = player2Pieces.some(
      (piece) => returnPiecePlays(piece, piece.index).length
    );

    console.log("player1HasMoves : ", player1HasMoves);
    console.log("player2HasMoves : ", player2HasMoves);

    !player1HasMoves && setPlayerWinner(2);
    !player2HasMoves && setPlayerWinner(1);
  };

  const handleSetCore = (currentBoard: SquareType[]) => {
    const player1 =
      12 - currentBoard.filter((piece) => piece.player === 2).length;
    const player2 =
      12 - currentBoard.filter((piece) => piece.player === 1).length;

    setPlayersScore({ player1, player2 });
  };

  const allowJumpCondition = (
    piece: SquareType,
    pieceIndex: number,
    squareIndex: number
  ) => {
    const squareInstance = board[squareIndex];
    if (piece.isAking) {
      const sign = Math.sign(squareIndex - pieceIndex);
      const indexNextPosition =
        sign > 0
          ? squareIndex + Math.abs(pieceIndex - squareIndex)
          : squareIndex - Math.abs(pieceIndex - squareIndex);
      const pieceToJumpIsValid =
        Math.abs(pieceIndex - squareIndex) === 9 ||
        Math.abs(pieceIndex - squareIndex) === 7;

      if (pieceToJumpIsValid) {
        return (
          !!squareInstance.player &&
          board[indexNextPosition]?.player === 0 &&
          board[indexNextPosition]?.acceptPiece &&
          squareInstance.player !== piece.player
        );
      }
    }

    if (piece.player === 1) {
      const indexNextPosition = squareIndex - (pieceIndex - squareIndex);
      const validPlayer1ChosenSquare =
        pieceIndex - squareIndex === 9 || pieceIndex - squareIndex === 7;

      if (validPlayer1ChosenSquare) {
        return (
          !!squareInstance.player &&
          board[indexNextPosition]?.player === 0 &&
          board[indexNextPosition]?.acceptPiece &&
          squareInstance.player === 2
        );
      }
    }

    if (piece.player === 2) {
      const indexNextPosition = squareIndex + (squareIndex - pieceIndex);
      const validPlayer2ChosenSquare =
        squareIndex - pieceIndex === 9 || squareIndex - pieceIndex === 7;

      if (validPlayer2ChosenSquare) {
        return (
          !!squareInstance.player &&
          board[indexNextPosition]?.player === 0 &&
          board[indexNextPosition]?.acceptPiece &&
          squareInstance.player === 1
        );
      }
    }
    return false;
  };

  const allowMoveCondition = (
    piece: SquareType,
    pieceIndex: number,
    squareIndex: number
  ) => {
    const squareInstance = board[squareIndex];
    if (piece.isAking && !squareInstance.player) {
      const validPlayerKingChosenSquare =
        Math.abs(pieceIndex - squareIndex) === 9 ||
        Math.abs(pieceIndex - squareIndex) === 7;

      return validPlayerKingChosenSquare && squareInstance.acceptPiece;
    }
    if (piece.player === 1 && !squareInstance.player) {
      const validPlayer1ChosenSquare =
        pieceIndex - squareIndex === 9 || pieceIndex - squareIndex === 7;
      return validPlayer1ChosenSquare && squareInstance.acceptPiece;
    }
    if (piece.player === 2 && !squareInstance.player) {
      const validPlayer2ChosenSquare =
        squareIndex - pieceIndex === 9 || squareIndex - pieceIndex === 7;

      return validPlayer2ChosenSquare && squareInstance.acceptPiece;
    }
    return false;
  };

  const returnPieceAllPossibleJumps = (
    piece: SquareType,
    pieceIndex: number
  ) => {
    const indexesPossibleMoves: number[] = [];
    board.forEach((square, squareIndex) => {
      if (allowJumpCondition(piece, pieceIndex, squareIndex)) {
        indexesPossibleMoves.push(squareIndex);
      }
    });

    return indexesPossibleMoves;
  };

  const returnPieceAllPossibleMoves = (
    piece: SquareType,
    pieceIndex: number
  ) => {
    const indexesPossibleMoves: number[] = [];
    board.forEach((square, squareIndex) => {
      if (allowMoveCondition(piece, pieceIndex, squareIndex)) {
        indexesPossibleMoves.push(squareIndex);
      }
    });
    return indexesPossibleMoves;
  };

  const canCurrentUserKeepJumping = (
    lastPieceMoved: SquareType,
    currentPieceIndex: number
  ) => {
    const indexesPossibleJumps = returnPieceAllPossibleJumps(
      lastPieceMoved,
      currentPieceIndex
    );
    if (indexesPossibleJumps.length) {
      setCoordinates({
        ...coordinates,
        currentPiecePosition: currentPieceIndex,
        currentPieceSelected: lastPieceMoved,
      });
      setUserMustKeepJumping(true);
      setPossibleMovesIndexes(indexesPossibleJumps);
      return true;
    }
    setUserMustKeepJumping(false);
    return false;
  };

  const validateNextMove = (nextPosition: number) => {
    if (!possibleMovesIndexes.includes(nextPosition)) {
      setCoordinates(initialCordinates);
      setPossibleMovesIndexes([]);
      console.log("not valid move");
      return false;
    }
    return true;
  };

  const executeNextJump = (pieceToBeJumpedIndex: number) => {
    if (!validateNextMove(pieceToBeJumpedIndex)) return;
    const pieceToBeJumped = board[pieceToBeJumpedIndex];

    if (pieceToBeJumped.player === 2) {
      const newBoardPositions = [...board];
      const indexNextPosition =
        pieceToBeJumpedIndex - (currentPiecePosition - pieceToBeJumpedIndex);
      newBoardPositions.splice(indexNextPosition, 1, {
        ...currentPieceSelected,
        isAking: indexNextPosition < 8 || currentPieceSelected.isAking,
      });
      newBoardPositions.splice(
        currentPiecePosition,
        1,
        board[
          currentPiecePosition -
            (currentPiecePosition - pieceToBeJumpedIndex) * 2
        ]
      );
      //JUMPED PIECE BECOME A NORMAL SQUARE
      newBoardPositions[pieceToBeJumpedIndex].player = 0;
      newBoardPositions[pieceToBeJumpedIndex].hasAPiece = false;
      newBoardPositions[pieceToBeJumpedIndex].pieceColor = "";

      setBoard(newBoardPositions);
      checkForPlayerWithNoLegalMoves(newBoardPositions);
      handleSetCore(newBoardPositions);
      setPossibleMovesIndexes([]);
      setCoordinates(initialCordinates);
      !canCurrentUserKeepJumping(
        newBoardPositions[indexNextPosition],
        indexNextPosition
      ) && setCurrentTurn((prevState) => (prevState === 1 ? 2 : 1));
    }
    if (pieceToBeJumped.player === 1) {
      const newBoardPositions = [...board];
      const indexNextPosition =
        pieceToBeJumpedIndex + (pieceToBeJumpedIndex - currentPiecePosition);
      newBoardPositions.splice(indexNextPosition, 1, {
        ...currentPieceSelected,
        isAking: indexNextPosition > 55 || currentPieceSelected.isAking,
      });
      newBoardPositions.splice(
        currentPiecePosition,
        1,
        board[
          currentPiecePosition +
            (pieceToBeJumpedIndex - currentPiecePosition) * 2
        ]
      );
      //JUMPED PIECE BECOME A NORMAL SQUARE
      newBoardPositions[pieceToBeJumpedIndex].player = 0;
      newBoardPositions[pieceToBeJumpedIndex].hasAPiece = false;
      newBoardPositions[pieceToBeJumpedIndex].pieceColor = "";

      setBoard(newBoardPositions);
      checkForPlayerWithNoLegalMoves(newBoardPositions);
      handleSetCore(newBoardPositions);
      setPossibleMovesIndexes([]);
      setCoordinates(initialCordinates);
      !canCurrentUserKeepJumping(
        newBoardPositions[indexNextPosition],
        indexNextPosition
      ) && setCurrentTurn((prevState) => (prevState === 1 ? 2 : 1));
    }
  };

  const executeNextMove = (nextPiecePosition: number) => {
    if (!validateNextMove(nextPiecePosition)) return;
    const pieceToBeJumped = board[nextPiecePosition];
    const newBoardPositions = [...board];
    //CONDITION TO DETERMINE IF PLAYER IS IN A KING POSITION
    const piecePlayer1isKing =
      currentPieceSelected.player === 1 && nextPiecePosition < 8;
    const piecePlayer2isKing =
      currentPieceSelected.player === 2 && nextPiecePosition > 55;

    newBoardPositions.splice(nextPiecePosition, 1, {
      ...currentPieceSelected,
      isAking:
        piecePlayer1isKing ||
        piecePlayer2isKing ||
        currentPieceSelected.isAking,
    });
    newBoardPositions.splice(currentPiecePosition, 1, pieceToBeJumped);

    setBoard(newBoardPositions);
    checkForPlayerWithNoLegalMoves(newBoardPositions);
    setPossibleMovesIndexes([]);
    setCoordinates(initialCordinates);
    setCurrentTurn((prevState) => (prevState === 1 ? 2 : 1));
  };

  const indicateMovementTry = (nextPiecePosition: number) => {
    const squareInstance = board[nextPiecePosition];
    //IF NEXT POSITION HAS A PIECE IT'S TRYING TO JUMP
    squareInstance.hasAPiece
      ? executeNextJump(nextPiecePosition)
      : executeNextMove(nextPiecePosition);
  };

  const returnPiecePlays = (piece: SquareType, pieceIndex: number) => {
    if (!piece.hasAPiece) {
      setPossibleMovesIndexes([]);
      setCoordinates(initialCordinates);
      return [];
    }
    const possibleMoves: number[] = [];
    possibleMoves.push(...returnPieceAllPossibleMoves(piece, pieceIndex));
    possibleMoves.push(...returnPieceAllPossibleJumps(piece, pieceIndex));

    console.log("indexesPossibleMoves: ", possibleMoves);
    setPossibleMovesIndexes(possibleMoves);
    return possibleMoves;
  };

  const returnPiecesHaveValidMoves = (pieceColor: string) => {
    const piecesWithTheColor = board
      .map((piece, index) => ({ ...piece, index }))
      .filter((piece) => piece.pieceColor === pieceColor);

    const piecesWithValidMove = piecesWithTheColor
      .filter((piece) => {
        return !!returnPiecePlays(piece, piece.index).length;
      })
      .map((piece) => piece.index);
    setPossibleMovesIndexes([]);

    console.log("piecesWithValidMove: ", piecesWithValidMove);
    setPiecesWithValidMovesIndexes(piecesWithValidMove);

    return piecesWithValidMove;
  };

  useEffect(() => {
    !currentPiecePosition &&
      returnPiecesHaveValidMoves(
        currentTurn === 1 ? player1PieceColor : player2PieceColor
      );
    currentPiecePosition && setPiecesWithValidMovesIndexes([]);
    passCurrentTurn(currentTurn);
  }, [currentTurn, currentPiecePosition]);

  useEffect(() => {
    passPlayersScore(playersScore);
  }, [playersScore]);

  const handleClickSquare = (square: SquareType, index: number) => {
    !currentPiecePosition &&
      setCoordinates((prevState) => ({
        ...prevState,
        currentPiecePosition: index,
        currentPieceSelected: square,
      }));
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setCoordinates(initialCordinates);
    setCurrentTurn(1);
    setPlayersScore({ player1: 0, player2: 0 });
    setPossibleMovesIndexes([]);
    setPiecesWithValidMovesIndexes([]);
    setUserMustKeepJumping(false);
  };

  return (
    <div
      style={{
        width: 650,
        display: "flex",
        flexWrap: "wrap",
        // border: "1px solid green",
        margin: 20,
      }}
    >
      {board.map((square, i) => {
        const { id, color, hasAPiece, pieceColor, isAking, player } = square;
        return (
          <div
            key={id}
            style={{
              width: 75,
              height: 75,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: possibleMovesIndexes.includes(i)
                ? "rgb(238, 238, 255)"
                : color,
            }}
            onClick={() => {
              // setPiecesWithValidMovesIndexes([]);
              const applyOnClick = () => {
                if (
                  //VALIDATE PLAYER TURN
                  currentTurn === player ||
                  currentTurn === currentPieceSelected.player
                ) {
                  handleClickSquare(square, i);
                  !currentPiecePosition
                    ? returnPiecePlays(square, i)
                    : //ONCE THE PIECE HAS BEEN SELECTED, TRY MOVE GET EXECUTED
                      indicateMovementTry(i);
                } else {
                  console.log("It's not your turn modofokrt");
                }
              };

              //FORCE PLAYER TO KEEP JUMPIMG
              if (userMustKeepJumping && possibleMovesIndexes.includes(i)) {
                applyOnClick();
              }
              if (!userMustKeepJumping) {
                applyOnClick();
              }
            }}
          >
            {hasAPiece ? (
              <Piece
                pieceColor={pieceColor}
                showHasValidMove={piecesWithValidMovesIndexes.includes(i)}
                selected={currentPiecePosition === i}
                isAking={isAking}
                id={id}
              />
            ) : (
              <span>{id}</span>
            )}
          </div>
        );
      })}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: 600,
          paddingTop: 20,
        }}
      >
        <button
          style={{
            fontSize: 14,
            padding: "6px 12px",
            display: "inline-block",
            textDecoration: "none",
            border: "1px solid transparent",
            color: "#333",
            backgroundColor: "#fff",
            borderColor: "#ccc",
            borderRadius: 4,
          }}
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};
export default Board;
