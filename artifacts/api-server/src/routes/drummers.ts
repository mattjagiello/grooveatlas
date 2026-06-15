import { db, drummersTable, songsTable } from "@workspace/db";
import { and, eq, inArray, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/drummers", async (req, res) => {
  const { eraId, genreId } = req.query as {
    eraId?: string;
    genreId?: string;
  };

  const conditions = [];
  if (eraId) conditions.push(sql`${eraId} = ANY(${drummersTable.eras})`);
  if (genreId) conditions.push(sql`${genreId} = ANY(${drummersTable.genres})`);

  const drummers =
    conditions.length > 0
      ? await db
          .select()
          .from(drummersTable)
          .where(and(...conditions))
      : await db.select().from(drummersTable);

  res.json(drummers);
});

router.get("/drummers/:id", async (req, res) => {
  const rows = await db
    .select()
    .from(drummersTable)
    .where(eq(drummersTable.id, req.params.id!))
    .limit(1);

  if (!rows[0]) {
    return res.status(404).json({ message: "Drummer not found" });
  }

  const drummer = rows[0];

  const iconicSongs =
    drummer.iconicSongIds.length > 0
      ? await db
          .select()
          .from(songsTable)
          .where(inArray(songsTable.id, drummer.iconicSongIds))
      : [];

  return res.json({ ...drummer, iconicSongs });
});

export default router;
