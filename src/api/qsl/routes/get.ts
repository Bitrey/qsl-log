import { Router } from "express";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status";
import { createError } from "../../helpers";
import { logger } from "@typegoose/typegoose/lib/logSettings";
import { Errors } from "../../errors";
import Qsl from "../models";

const router = Router();

router.get("/:_id", async (req, res) => {
    try {
        const log = await Qsl.findOne({ _id: req.params._id });
        if (!log) {
            return res
                .status(NOT_FOUND)
                .json(createError(Errors.DOC_NOT_FOUND));
        }

        return res.json(log);
    } catch (err) {
        logger.error("Error in QSL get");
        logger.error(err);
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(createError(Errors.SERVER_ERROR));
    }
});

export default router;
