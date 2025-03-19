const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");

const pokemonRoutes = require("./routes/pokemon");
const generationRoutes = require("./routes/generation");
const logger = require("./logger");

const app = express();

// Setup cache
const cache = new NodeCache({
    stdTTL: process.env.CACHE_TTL || 600,
    checkperiod: process.env.CHK_Period || 300,
    useClones: false
});

// Middleware
app.use(compression());
app.use(morgan("combined", { stream: logger.stream }));
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many requests, please try again later.",
});
app.use(limiter);

// Pass cache to routes via request object
app.use((req, res, next) => {
    req.cache = cache;
    next();
});

// Register routes
app.use("/pokemon", pokemonRoutes);
app.use("/generation", generationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
