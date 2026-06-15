import { db, songsTable, drummersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { fetchLyricsSnippet } from "../services/musixmatch.js";

const router: IRouter = Router();

router.get("/songs", async (req, res) => {
  const { eraId, genreId, drummerId } = req.query as {
    eraId?: string;
    genreId?: string;
    drummerId?: string;
  };

  let query = db.select().from(songsTable);

  if (eraId) {
    query = query.where(eq(songsTable.eraId, eraId)) as typeof query;
  }
  if (genreId) {
    query = query.where(
      sql`${genreId} = ANY(${songsTable.genreIds})`
    ) as typeof query;
  }
  if (drummerId) {
    query = query.where(eq(songsTable.drummerId, drummerId)) as typeof query;
  }

  const songs = await query;
  res.json(songs);
});

router.get("/songs/:id", async (req, res) => {
  const rows = await db
    .select()
    .from(songsTable)
    .where(eq(songsTable.id, req.params.id!))
    .limit(1);

  if (!rows[0]) {
    return res.status(404).json({ message: "Song not found" });
  }

  const song = rows[0];

  const [drummerRows, lyricsSnippet] = await Promise.all([
    db
      .select()
      .from(drummersTable)
      .where(eq(drummersTable.id, song.drummerId))
      .limit(1),
    song.lyricsSnippet
      ? Promise.resolve(song.lyricsSnippet)
      : fetchLyricsSnippet(song.title, song.artist),
  ]);

  const drummer = drummerRows[0] ?? null;

  return res.json({ ...song, lyricsSnippet: lyricsSnippet ?? null, drummer });
});

export default router;
