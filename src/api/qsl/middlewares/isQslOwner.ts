import { NextFunction, Request, Response } from "express";
import {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    UNAUTHORIZED
} from "http-status";
import { isValidObjectId } from "mongoose";
import { logger } from "../../../shared/logger";
import { Errors } from "../../errors";
import { createError } from "../../helpers";
import Qsl from "../models";

async function isQslOwner(req: Request, res: Response, next: NextFunction) {
    const _id = req.params._id.trim();
    if (typeof _id !== "string") {
        logger.error("req.params._id not populated for isQslOwner");
        process.exit(1);
    } else if (!isValidObjectId(_id)) {
        logger.debug("Invalid ObjectId for isQslOwner");
        return res
            .status(BAD_REQUEST)
            .json(createError(Errors.INVALID_OBJECT_ID));
    } else if (!req.user) {
        logger.error("req.user not populated for isQslOwner");
        process.exit(1);
    }

    try {
        const qsl = await Qsl.findOne({ _id });
        if (!qsl) {
            return res
                .status(NOT_FOUND)
                .json(createError(Errors.QSL_NOT_FOUND));
        }
        if (qsl.fromUser?.toString() !== req.user._id.toString()) {
            return res
                .status(UNAUTHORIZED)
                .json(createError(Errors.QSL_NOT_OWNED));
        }
        req.qsl = qsl;
        next();
    } catch (err) {
        logger.error("DB search error in isQslOwner");
        logger.error(err);
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(createError(Errors.UNKNOWN_ERROR));
    }
}
export default isQslOwner;
