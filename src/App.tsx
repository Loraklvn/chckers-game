import { useState } from "react";
import Board, { player1PieceColor, player2PieceColor } from "./Board";
import StaticPiece from "./StaticPiece";

function App() {
  const [currentTurn, setCurrenturn] = useState(1);
  const [{ player1, player2 }, setPlayersScore] = useState({
    player1: 0,
    player2: 0,
  });
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",

          width: "100%",
          // border: "1px solid blue",
          padding: 25,
        }}
      >
        {/* <span>
           
        </span> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 5,
            borderRadius: 30,
            backgroundColor: "rgba(0,0,0,.4)",
          }}
        >
          <span style={{ margin: 10 }}>
            <StaticPiece
              colorTurn={currentTurn === 2}
              content={player2}
              pieceColor={player2PieceColor}
            />
          </span>
          <span style={{ margin: 10 }}>
            <StaticPiece
              colorTurn={currentTurn === 1}
              content={player1}
              pieceColor={player1PieceColor}
            />
          </span>
        </div>
      </div>
      <Board
        passPlayersScore={setPlayersScore}
        passCurrentTurn={setCurrenturn}
      />
      <div style={{ width: "100%" }}></div>
    </div>
  );
}

export default App;
