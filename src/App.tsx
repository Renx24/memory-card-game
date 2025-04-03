import { useState, useEffect } from "react";
import "./App.css";
import MemoryCard from "./components/MemoryCard.tsx";
import GithubSVG from "./components/GithubSVG.tsx";

function App() {
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<any[]>([]);
  const [clickedMovies, setClickedMovies] = useState<string[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [numberOfCards, setNumberOfCards] = useState(4);
  const [numberOfMovies, setNumberOfMovies] = useState(20);
  const [fixedMovieSet, setFixedMovieSet] = useState<any[]>([]);

  // make sure image is valid (as opposed to image location being 404 error)
  const checkImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  // randomly shuffles array
  const shuffleArray = (array: any[]) => {
    return array.slice().sort(() => Math.random() - 0.5);
  };

  // gets data once
  const getData = async () => {
    try {
      let validMovies: any[] = [];
      const resp = await fetch("https://api.sampleapis.com/movies/animation");
      const json = await resp.json();

      if (Array.isArray(json)) {
        const shuffledMovies = shuffleArray(json);

        for (const movie of shuffledMovies) {
          if (validMovies.length >= shuffledMovies.length) break;
          const isValid = await checkImage(movie.posterURL);
          if (isValid) validMovies.push(movie);
        }
      }

      setAllMovies(validMovies);
      setDisplayedMovies(shuffleArray(validMovies).slice(0, 4)); // pick 4 random valid movies to be displayed
    } catch (err: any) {
      console.error("Error fetching data:", err);
    }
  };

  // get data upon page load
  useEffect(() => {
    getData();
  }, []);

  const shuffleNumberOfMovies = () => {
    const sourceMovies = fixedMovieSet.length > 0 ? fixedMovieSet : allMovies;
    return shuffleArray(sourceMovies).slice(0, numberOfCards);
  };

  const resetGame = () => {
    setClickedMovies([]);
    setHighScore((prev) => Math.max(prev, currentScore));
    setCurrentScore(0);
    setDisplayedMovies(shuffleNumberOfMovies()); // reshuffle new set upon game end
  };

  // check win condition whenever currentScore changes
  useEffect(() => {
    if (currentScore > 0 && currentScore === numberOfMovies) {
      alert("You win! Impressive!");
      resetGame();
    }
  }, [currentScore, numberOfMovies]);

  useEffect(() => {
    if (allMovies.length === 0) return; // prevent running when allMovies is empty

    const newFixedMovies = shuffleArray(allMovies).slice(0, numberOfMovies);
    setFixedMovieSet(newFixedMovies);

    // ensure displayedMovies is never empty
    setDisplayedMovies(newFixedMovies.slice(0, numberOfCards));

    setCurrentScore(0);
  }, [numberOfCards, numberOfMovies, allMovies]);

  const handleCardClick = (title: string) => {
    if (clickedMovies.includes(title)) {
      alert("Game over! You clicked the same card twice.");
      resetGame();
      return;
    }

    // make sure at least one movie is "new", so there could not be 4 clicked movies promped to the user (unwinnable situation)
    const newClickedMovies = [...clickedMovies, title];
    setClickedMovies(newClickedMovies);
    setCurrentScore((prev) => prev + 1);

    let unclickedMovies = shuffleNumberOfMovies().filter(
      (movie) => !newClickedMovies.includes(movie.title)
    );

    if (unclickedMovies.length === 0) {
      setDisplayedMovies(shuffleNumberOfMovies()); // fallback: reshuffle all
      return;
    }

    let newMovies = shuffleArray(unclickedMovies).slice(0, 1);
    let remainingMovies = shuffleNumberOfMovies()
      .filter((m) => !newMovies.includes(m))
      .slice(0, numberOfCards - 1);

    setDisplayedMovies(shuffleArray([...newMovies, ...remainingMovies]));
  };

  return (
    <div className="app-container">
      <div className="text-section">
        <div className="instructions">
          <h1>Memory Card Game</h1>
          <p>Don't click on a card that you have already clicked on!</p>
          <p>
            Number of cards on the screen:{" "}
            <input
              type="number"
              min="2"
              max={allMovies.length}
              value={numberOfCards}
              onChange={(e) => setNumberOfCards(Number(e.target.value))}
            />
          </p>
          <p>
            Amount of total movies:{" "}
            <input
              type="number"
              min={numberOfCards}
              max={allMovies.length}
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

      <div className="memory-grid">
        {displayedMovies.length > 0 ? (
          displayedMovies.map((movie, index) => (
            <MemoryCard
              key={index}
              title={movie?.title}
              image={movie?.posterURL}
              onClick={() => handleCardClick(movie.title)}
            />
          ))
        ) : (
          <p className="loading">Loading...</p>
        )}
      </div>

      <footer className="github-links">
        <a href="https://github.com/Renx24/memory-card-game" target="_blank">
          Project repo
        </a>
        <a href="https://github.com/Renx24" target="_blank">
          <GithubSVG />
          Renx24
        </a>
      </footer>
    </div>
  );
}

export default App;
