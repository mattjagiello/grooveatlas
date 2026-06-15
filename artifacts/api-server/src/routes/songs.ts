import { db, songsTable, drummersTable } from "@workspace/db";
import { and, eq, inArray, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { fetchLyricsSnippet } from "../services/musixmatch.js";

const router: IRouter = Router();

router.get("/songs", async (req, res) => {
  const { eraId, genreId, drummerId } = req.query as {
    eraId?: string;
    genreId?: string;
    drummerId?: string;
  };

  const conditions = [];
  if (eraId) conditions.push(eq(songsTable.eraId, eraId));
  if (genreId) conditions.push(sql`${genreId} = ANY(${songsTable.genreIds})`);
  if (drummerId) conditions.push(eq(songsTable.drummerId, drummerId));

  const songs =
    conditions.length > 0
      ? await db
          .select()
          .from(songsTable)
          .where(and(...conditions))
      : await db.select().from(songsTable);

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
