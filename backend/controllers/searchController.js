import { searchFirestore } from '../services/searchService.js';

export async function searchController(req, res) {
  const q = req.query.q || "";
  try {
    const results = await searchFirestore(q);
    res.json(results);
  } catch (error) {
    console.error("Search error: ", error);
    res.status(500).json({ error: "Search failed" });
  }
}