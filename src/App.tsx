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
    <>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 800,
          fontFamily: "sans-serif",
          textAlign: "center",
          margin: 0,
        }}
      >
        Checkers Game
      </h1>
      <article style={{ display: "flex", justifyContent: "center" }}>
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "100%",
            padding: 25,
          }}
        >
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
        </section>
        <section>
          <Board
            passPlayersScore={setPlayersScore}
            passCurrentTurn={setCurrenturn}
          />
        </section>
        <section style={{ width: "100%" }} />
      </article>
    </>
  );
}

export default App;
