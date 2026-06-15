import { db, genresTable, songsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { fetchGenreCharts } from "../services/musixmatch.js";

const router: IRouter = Router();

router.get("/genres/:id/charts", async (req, res) => {
  const genreId = req.params.id!;
  const limit = Math.min(Number(req.query["limit"] ?? 10) || 10, 20);

  const genreRows = await db
    .select()
    .from(genresTable)
    .where(eq(genresTable.id, genreId))
    .limit(1);

  if (!genreRows[0]) {
    return res.status(404).json({ message: "Genre not found" });
  }

  const genre = genreRows[0];

  const liveCharts = await fetchGenreCharts(genre.name, limit);
  if (liveCharts && liveCharts.length > 0) {
    return res.json(
      liveCharts.map((t) => ({ ...t, source: "musixmatch" }))
    );
  }

  const curatedSongs = await db
    .select()
    .from(songsTable)
    .where(sql`${genreId} = ANY(${songsTable.genreIds})`)
    .limit(limit);

  const fallback = curatedSongs.map((s, idx) => ({
    trackId: s.id,
    title: s.title,
    artist: s.artist,
    albumTitle: null,
    rank: idx + 1,
    source: "curated",
  }));

  return res.json(fallback);
});

export default router;
