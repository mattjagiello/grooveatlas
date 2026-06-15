import { db, erasTable, drummersTable, songsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/eras", async (_req, res) => {
  const eras = await db.select().from(erasTable).orderBy(erasTable.name);
  res.json(eras);
});

router.get("/eras/:id", async (req, res) => {
  const rows = await db
    .select()
    .from(erasTable)
    .where(eq(erasTable.id, req.params.id!))
    .limit(1);

  if (!rows[0]) {
    return res.status(404).json({ message: "Era not found" });
  }

  const era = rows[0];

  const [keyDrummers, iconicSongs] = await Promise.all([
    era.keyDrummerIds.length > 0
      ? db
          .select()
          .from(drummersTable)
          .where(inArray(drummersTable.id, era.keyDrummerIds))
      : Promise.resolve([]),
    era.iconicSongIds.length > 0
      ? db
          .select()
          .from(songsTable)
          .where(inArray(songsTable.id, era.iconicSongIds))
      : Promise.resolve([]),
  ]);

  return res.json({ ...era, keyDrummers, iconicSongs });
});

export default router;
