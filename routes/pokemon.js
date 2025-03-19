const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:name", async (req, res) => {
    try {
        const pokemonName = req.params.name.toLowerCase();
        const cache = req.cache;

        if (cache.has(pokemonName)) {
            return res.json(cache.get(pokemonName));
        }

        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        cache.set(pokemonName, response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Pokémon:", error.message);
        res.status(500).json({ error: "Pokemon not found or API error" });
    }
});

module.exports = router;
