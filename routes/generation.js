const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const cache = req.cache;
        const cacheKey = `generation-${id}`;

        if (cache.has(cacheKey)) {
            const cachedData = cache.get(cacheKey);
            // Return only pokemon_species from cache
            return res.json(cachedData.pokemon_species);
        }

        const response = await axios.get(`https://pokeapi.co/api/v2/generation/${id}`);
        cache.set(cacheKey, response.data);
        // Return only pokemon_species from API response
        res.json(response.data.pokemon_species);
    } catch (error) {
        console.error("Error fetching generation:", error.message);
        res.status(500).json({ error: "Pokemon generation not found or API error" });
    }
});

module.exports = router;
