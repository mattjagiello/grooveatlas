import { db, drummersTable, songsTable } from "@workspace/db";
import { eq, inArray, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/drummers", async (req, res) => {
  const { eraId, genreId } = req.query as {
    eraId?: string;
    genreId?: string;
  };

  let query = db.select().from(drummersTable);

  if (eraId) {
    query = query.where(
      sql`${eraId} = ANY(${drummersTable.eras})`
    ) as typeof query;
  }
  if (genreId) {
    query = query.where(
      sql`${genreId} = ANY(${drummersTable.genres})`
    ) as typeof query;
  }

  const drummers = await query;
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
