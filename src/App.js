import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then(response => response.json())
      .then(data => {
        setPokemon(data.results);
      });
  }, []);

  useEffect(() => {
    setDetails(null);
    if (selectedPokemon != null) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`)
        .then(response => response.json())
        .then(data => {
          setDetails(data);
        });
    }
  }, [selectedPokemon]);

  return (
    <div className="pokedex">
      <PokedexList
        pokemon={pokemon}
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
      />
      <PokedexDescription selectedPokemon={selectedPokemon} />
      <PokedexImage details={details} />
      <PokedexSummary details={details} />
    </div>
  );
}

function PokedexList(props) {
  const { pokemon, selectedPokemon, setSelectedPokemon } = props;
  return (
    <ul className="pokedex-list">
      {pokemon.map((p, index) => {
        const number = (index + 1).toString().padStart(3, "0");
        const isSelected = p.name === selectedPokemon;
        const buttonClass = isSelected ? "active" : null;
        return (
          <li key={p.name}>
            <button
              className={buttonClass}
              onClick={() => {
                setSelectedPokemon(p.name);
              }}
            >
              <strong>{number}</strong> {p.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function PokedexDescription(props) {
  const [species, setSpecies] = useState(null);
  const { selectedPokemon } = props;

  useEffect(() => {
    if (selectedPokemon != null) {
      setSpecies(null);
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${selectedPokemon}`)
        .then(response => response.json())
        .then(data => {
          setSpecies(data);
        });
    }
  }, [selectedPokemon]);

  let description = null;
  if (species != null) {
    description = species.flavor_text_entries.find(
      entry => entry.language.name === "en"
    ).flavor_text;
  }

  return (
    <div className="pokedex-description">
      <p>{description}</p>
    </div>
  );
}

function PokedexImage(props) {
  const { details } = props;

  return (
    <div className="pokedex-image">
      {details != null && (
        <img
          src={details.sprites.front_default}
          alt={details.name}
          width="288"
          height="288"
        />
      )}
    </div>
  );
}

function PokedexSummary(props) {
  const { details } = props;
  let content = null;

  if (details != null) {
    const name = details.name.toUpperCase();
    const number = details.id.toString().padStart(3, "0");
    content = (
      <>
        <h1>{name}</h1>
        <p>NUMBER: {number}</p>
      </>
    );
  }

  return <div className="pokedex-summary">{content}</div>;
}

export default App;
