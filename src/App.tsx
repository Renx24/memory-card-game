import { useState, useEffect } from "react";
import "./App.css";
import MemoryCard from "./components/MemoryCard.tsx";

function App() {
  const [selectedMovies, setSelectedMovies] = useState<any[]>([]);
  const [clickedMovies, setClickedMovies] = useState<any[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const checkImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true); // ✅ Image is valid
      img.onerror = () => resolve(false); // ❌ Image is broken (404)
    });
  };

  const getData = async () => {
    try {
      let validMovies: any[] = [];

      while (validMovies.length < 4) {
        const resp = await fetch("https://api.sampleapis.com/movies/animation");
        const json = await resp.json();

        if (Array.isArray(json)) {
          // Shuffle movies
          const shuffledMovies = json.sort(() => 0.5 - Math.random());

          // Check each movie image
          const checkedMovies = await Promise.all(
            shuffledMovies.map(async (movie) => {
              const isValid = await checkImage(movie.posterURL);
              return isValid ? movie : null;
            })
          );

          // Filter out null values (invalid images)
          validMovies = checkedMovies.filter(Boolean);
        }
      }

      // Select only the first 4 valid movies
      setSelectedMovies(validMovies.slice(0, 4));
    } catch (err: any) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const resetGame = () => {
    setClickedMovies([]);
    setCurrentScore(0);
  };

  const continueGame = (title: string) => {
    setClickedMovies([...clickedMovies, title]);
    setCurrentScore(currentScore + 1);
  };

  const handleCardClick = (title: string) => {
    if (clickedMovies.includes(title)) {
      alert("Game over! You clicked the same card twice.");
      if (currentScore > highScore) setHighScore(currentScore);
      resetGame();
    } else {
      continueGame(title);
    }
    getData();
  };

  return (
    <>
      <div className="text-section">
        <div className="instructions">
          <h1>Memory Card Game</h1>
          <p>Don't click on a card that you have already clicked on!</p>
        </div>
        <div className="scores">
          <p>
            High Score: <span className="highscore">{highScore}</span>
          </p>
          <p>
            Score: <span className="current-score">{currentScore}</span>
          </p>
        </div>
      </div>

      <div className="memory-grid">
        {selectedMovies.length > 0 ? (
          selectedMovies.map((movie, index) => (
            <MemoryCard
              key={index}
              title={movie?.title}
              image={movie?.posterURL}
              onClick={() => handleCardClick(movie.title)}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default App;
