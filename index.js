const express = require("express")
const axios = require('axios');


const app = express()
const port = 8000

app.get("/pokemon/:name", async (req, res) => {
    try{
        const pokemonName = req.params.name.toLowerCase();
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        res.json(response.data)
    }
    catch (error) {
        res.status(500).json({error: "Pokemon not found or API error"})
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})