const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const cache = req.cache;
        const cacheKey = `generation-${id}`;

        if (cache.has(cacheKey)) {
            return res.json(cache.get(cacheKey));
        }

        const response = await axios.get(`https://pokeapi.co/api/v2/generation/${id}`);
        cache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching generation:", error.message);
        res.status(500).json({ error: "Pokemon generation not found or API error" });
    }
});

module.exports = router;
