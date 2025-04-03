interface TextSectionProps {
  numberOfCards: number;
  setNumberOfCards: (value: number) => void;
  numberOfMovies: number;
  setNumberOfMovies: (value: number) => void;
  currentScore: number;
  numberOfMoviesMax: number;
  highScore: number;
}

const TextSection = ({
  numberOfCards,
  setNumberOfCards,
  numberOfMovies,
  setNumberOfMovies,
  currentScore,
  numberOfMoviesMax,
  highScore,
}: TextSectionProps) => {
  return (
    <div className="text-section">
      <div className="instructions">
        <h1>Memory Card Game</h1>
        <p>Don't click on a card that you have already clicked on!</p>
        <p>
          Number of cards on the screen:{" "}
          <input
            type="number"
            min="2"
            max={numberOfMoviesMax}
            value={numberOfCards}
            onChange={(e) => setNumberOfCards(Number(e.target.value))}
          />
        </p>
        <p>
          Amount of total movies:{" "}
          <input
            type="number"
            min={numberOfCards}
            max={numberOfMoviesMax}
            value={numberOfMovies}
            onChange={(e) => setNumberOfMovies(Number(e.target.value))}
          />
        </p>
      </div>
      <div className="scores">
        <p>
          Score:{" "}
          <span className="current-score">
            {currentScore} / {numberOfMovies}
          </span>
        </p>
        <p>
          High Score: <span className="highscore">{highScore}</span>
        </p>
      </div>
    </div>
  );
};

export default TextSection;
