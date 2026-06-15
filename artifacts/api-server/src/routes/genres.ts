import { db, genresTable, drummersTable, songsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/genres", async (_req, res) => {
  const genres = await db.select().from(genresTable).orderBy(genresTable.name);
  res.json(
    genres.map((g) => ({ ...g, lat: Number(g.lat), lng: Number(g.lng) }))
  );
});

router.get("/genres/:id", async (req, res) => {
  const rows = await db
    .select()
    .from(genresTable)
    .where(eq(genresTable.id, req.params.id!))
    .limit(1);

  if (!rows[0]) {
    return res.status(404).json({ message: "Genre not found" });
  }

  const genre = { ...rows[0], lat: Number(rows[0].lat), lng: Number(rows[0].lng) };

  const [keyDrummers, iconicSongs] = await Promise.all([
    genre.keyDrummerIds.length > 0
      ? db
          .select()
          .from(drummersTable)
          .where(inArray(drummersTable.id, genre.keyDrummerIds))
      : Promise.resolve([]),
    genre.iconicSongIds.length > 0
      ? db
          .select()
          .from(songsTable)
          .where(inArray(songsTable.id, genre.iconicSongIds))
      : Promise.resolve([]),
  ]);

  return res.json({ ...genre, keyDrummers, iconicSongs });
});

export default router;
