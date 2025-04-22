"use client";
import { useState } from "react";
import Image from "next/image";

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

export default function Home() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pokemonName.trim()) {
      setError("Please enter a Pokémon name");
      return;
    }

    setLoading(true);
    setError("");
    setPokemon(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Pokémon not found");
      }

      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError("Pokémon not found or network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Pokémon Finder</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
            placeholder="Enter Pokémon name (e.g. pikachu)"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {loading && <p className="text-center">Loading...</p>}

      {pokemon && (
        <div className="border rounded-lg p-6 shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 flex justify-center">
              <img
                src={
                  pokemon.sprites.other["official-artwork"].front_default ||
                  pokemon.sprites.front_default
                }
                alt={pokemon.name}
                width={250}
                height={250}
                className="object-contain"
              />
            </div>

            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold capitalize mb-4">
                {pokemon.name}{" "}
                <span className="text-gray-500">#{pokemon.id}</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Height</p>
                  <p>{pokemon.height / 10} m</p>
                </div>
                <div>
                  <p className="font-semibold">Weight</p>
                  <p>{pokemon.weight / 10} kg</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Types</p>
                <div className="flex gap-2 mt-1">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className="px-3 py-1 bg-gray-200 rounded-full text-sm capitalize"
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Base Stats</p>
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="mb-2">
                    <div className="flex justify-between text-sm capitalize">
                      <span>{stat.stat.name}</span>
                      <span>{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (stat.base_stat / 255) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
