import React from "react";

type PropsType = {
  content: string | number;
  pieceColor: string;
  colorTurn: boolean;
};
const StaticPiece = ({
  content,
  pieceColor,
  colorTurn,
}: // selected,
PropsType): React.ReactElement => {
  return (
    <div
      style={{
        width: 65,
        height: 65,
        borderRadius: "50%",
        border: colorTurn ? "3px solid blue" : "",
        backgroundColor: pieceColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
      }}
    >
      <span style={{ color: pieceColor === "white" ? "black" : "white" }}>
        {content}
      </span>
    </div>
  );
};
export default StaticPiece;
