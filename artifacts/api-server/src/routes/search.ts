import { db, drummersTable, songsTable, genresTable, erasTable } from "@workspace/db";
import { ilike, or } from "drizzle-orm";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/search", async (req, res) => {
  const q = ((req.query.q as string) || "").trim();

  if (!q) {
    return res.json({ drummers: [], songs: [], genres: [], eras: [] });
  }

  const pattern = `%${q}%`;

  const [drummers, songs, genres, eras] = await Promise.all([
    db
      .select()
      .from(drummersTable)
      .where(
        or(
          ilike(drummersTable.name, pattern),
          ilike(drummersTable.bio, pattern),
          ilike(drummersTable.signatureStyle, pattern)
        )
      ),
    db
      .select()
      .from(songsTable)
      .where(
        or(
          ilike(songsTable.title, pattern),
          ilike(songsTable.artist, pattern),
          ilike(songsTable.feel, pattern)
        )
      ),
    db
      .select()
      .from(genresTable)
      .where(
        or(
          ilike(genresTable.name, pattern),
          ilike(genresTable.origin, pattern),
          ilike(genresTable.description, pattern)
        )
      ),
    db
      .select()
      .from(erasTable)
      .where(
        or(
          ilike(erasTable.name, pattern),
          ilike(erasTable.subtitle, pattern)
        )
      ),
  ]);

  return res.json({ drummers, songs, genres, eras });
});

export default router;
