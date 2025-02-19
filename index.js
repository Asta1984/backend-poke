const express = require("express");
const axios = require("axios");

const app = express();
const port = 8000;

app.get("/generation/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`Fetching data for Generation ${id}...`); // Debug log

        const response = await axios.get(`https://pokeapi.co/api/v2/generation/${id}`);
        
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching data:", error.message); // Log the actual error
        res.status(500).json({ error: "Pokemon generation not found or API error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
