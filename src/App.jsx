import "./App.css";
import GameBoard from "./components/GameBoard";

function App() {
  return (
    <div className="app-wrapper">
      <h1>Knight's Tour</h1>
      <section>
        <GameBoard />
      </section>
    </div>
  );
}

export default App;
