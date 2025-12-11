import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { TavilyClient } from "tavily";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const tavily = new TavilyClient({ apiKey: process.env.TAVILY_API_KEY });

app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body;

    const result = await tavily.search({
      query: `${query} clothing`,
      max_results: 3
    });

    const links = result.results.map((r) => r.url);
    res.json({ links });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
