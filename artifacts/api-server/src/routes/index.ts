import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import erasRouter from "./eras.js";
import genresRouter from "./genres.js";
import drummersRouter from "./drummers.js";
import songsRouter from "./songs.js";
import searchRouter from "./search.js";
import chartsRouter from "./charts.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(erasRouter);
router.use(genresRouter);
router.use(drummersRouter);
router.use(songsRouter);
router.use(searchRouter);
router.use(chartsRouter);

export default router;
