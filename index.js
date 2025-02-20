require("dotenv").config();
const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");
const cors = require('cors')

const app = express();
const port = process.env.PORT || 8000;
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL || 3600 });

app.use(compression());
app.use(morgan("combined"));
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 30,
    message: "Too many requests, please try again later.",
});
app.use(limiter);

app.get("/pokemon/:name", async (req, res) => {
    try {
        const pokemonName = req.params.name.toLowerCase();
        if (cache.has(pokemonName)) return res.json(cache.get(pokemonName));

        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        cache.set(pokemonName, response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Pokémon:", error.message);
        res.status(500).json({ error: "Pokemon not found or API error" });
    }
});

app.get("/generation/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (cache.has(`generation-${id}`)) return res.json(cache.get(`generation-${id}`));

        const response = await axios.get(`https://pokeapi.co/api/v2/generation/${id}`);
        cache.set(`generation-${id}`, response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching generation:", error.message);
        res.status(500).json({ error: "Pokemon generation not found or API error" });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
