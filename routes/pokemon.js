const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:name", async (req, res) => {
    try {
        const pokemonName = req.params.name.toLowerCase();
        const cache = req.cache;
        const pokemonCacheKey = pokemonName;
        const evolutionCacheKey = `evolutions-${pokemonName}`;

        let pokemonData = cache.get(pokemonCacheKey);
        
        if (!pokemonData) {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            pokemonData = response.data;
            cache.set(pokemonCacheKey, pokemonData);
        }

        let evolutionNames = cache.get(evolutionCacheKey);
        
        if (!evolutionNames) {
            const speciesResponse = await axios.get(pokemonData.species.url);
            const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
            const evolutionResponse = await axios.get(evolutionChainUrl);
            
            const getEvolutionNames = (chain) => {
                const names = [];
                if (chain.species) names.push(chain.species.name);
                chain.evolves_to.forEach(e => names.push(...getEvolutionNames(e)));
                return names;
            };

            evolutionNames = [...new Set(getEvolutionNames(evolutionResponse.data.chain))].sort();
            cache.set(evolutionCacheKey, evolutionNames);
        }

        // Modified sprite handling
        const sprites = pokemonData.sprites.other;
        const mainImage = sprites.dream_world.front_default 
            || sprites['official-artwork'].front_default 
            || pokemonData.sprites.front_default;

        const responseData = {
            name: pokemonData.name,
            height: pokemonData.height,
            weight: pokemonData.weight,
            abilities: pokemonData.abilities.map(a => a.ability.name),
            stats: pokemonData.stats,
            types: pokemonData.types.map(t => t.type.name),
            species: pokemonData.species.name,
            main_image: mainImage,
            evolutions: evolutionNames,
            // Additional sprites for reference
            sprites: {
                default: pokemonData.sprites.front_default,
                shiny: pokemonData.sprites.front_shiny,
                official_artwork: sprites['official-artwork'],
                dream_world: sprites.dream_world
            }
        };

        res.json(responseData);

    } catch (error) {
        console.error("Error fetching Pokémon:", error.message);
        res.status(500).json({ 
            error: "Pokemon data not found or API error",
            details: error.response?.data?.message || "Unknown error"
        });
    }
});


module.exports = router;
