import { useState, useEffect } from "react";
import "./App.css";
import MemoryCard from "./components/MemoryCard.tsx";
import GithubSVG from "./components/GithubSVG.tsx";
import TextSection from "./components/TextSection.tsx";

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
      const resp = await fetch("https://api.sampleapis.com/movies/animation");
      const json = await resp.json();

      if (Array.isArray(json)) {
        const shuffledMovies = shuffleArray(json);

        // check all images
        const validMovies = (
          await Promise.all(
            shuffledMovies.map(async (movie) => {
              const isValid = await checkImage(movie.posterURL);
              return isValid ? movie : null;
            })
          )
        ).filter(Boolean);

        setAllMovies(validMovies);

        if (validMovies.length > 0) {
          const initialMovies = shuffleArray(validMovies).slice(
            0,
            numberOfMovies
          );
          setFixedMovieSet(initialMovies);
          setDisplayedMovies(initialMovies.slice(0, numberOfCards));
        }
      }
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

    if (numberOfCards >= numberOfMovies) setNumberOfMovies(numberOfCards);

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
      <TextSection
        numberOfCards={numberOfCards}
        setNumberOfCards={setNumberOfCards}
        numberOfMovies={numberOfMovies}
        setNumberOfMovies={setNumberOfMovies}
        currentScore={currentScore}
        numberOfMoviesMax={allMovies.length}
        highScore={highScore}
      />

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

      <footer
        className="github-links"
        style={
          numberOfCards <= 4 && screen.width > 1200
            ? { position: "fixed" }
            : { position: "relative" }
        }
      >
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
