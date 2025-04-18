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
  const handleInputChange =
    (setter: (value: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // allow empty string for smoother user input
      if (value === "") {
        setter(0); //
        return;
      }

      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        setter(numericValue);
      }
    };

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
            value={numberOfCards || ""}
            onChange={handleInputChange(setNumberOfCards)}
          />
        </p>
        <p>
          Amount of total movies:{" "}
          <input
            type="number"
            min={numberOfCards}
            max={numberOfMoviesMax}
            value={numberOfMovies || ""}
            onChange={handleInputChange(setNumberOfMovies)}
          />
        </p>
      </div>
      <div className="scores">
        <div>
          Score:{" "}
          <div className="current-score">
            {currentScore} / {numberOfMovies}
          </div>
        </div>
        <div>
          High Score: <div className="highscore">{highScore}</div>
        </div>
      </div>
    </div>
  );
};

export default TextSection;
