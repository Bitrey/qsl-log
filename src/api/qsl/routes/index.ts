import { Router } from "express";
import searchRoute from "./search";
import getRoute from "./get";
import createRoute from "./create";
import updateRoute from "./update";
import deleteRoute from "./delete";

const router = Router();

router.use("/", searchRoute);
router.use("/", getRoute);
router.use("/", createRoute);
router.use("/", updateRoute);
router.use("/", deleteRoute);

export default router;
