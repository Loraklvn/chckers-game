import React from "react";

type PropsType = {
  id: number;
  pieceColor: string;
  isAking: boolean;
  selected: boolean;
  showHasValidMove: boolean;
};
const Piece = ({
  pieceColor,
  isAking,
  selected,
  showHasValidMove,
}: PropsType): React.ReactElement => {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        border:
          selected || showHasValidMove
            ? `3px solid ${!showHasValidMove ? "blue" : "#257AFD"}`
            : "",
        backgroundColor: pieceColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
      }}
    >
      <span style={{ color: pieceColor === "white" ? "black" : "white" }}>
        {isAking ? "KING" : ""}
      </span>
    </div>
  );
};
export default Piece;
