import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import erasRouter from "./eras.js";
import genresRouter from "./genres.js";
import drummersRouter from "./drummers.js";
import songsRouter from "./songs.js";
import searchRouter from "./search.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(erasRouter);
router.use(genresRouter);
router.use(drummersRouter);
router.use(songsRouter);
router.use(searchRouter);

export default router;
