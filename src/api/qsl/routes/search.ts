import { Router } from "express";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status";
import { createError } from "../../helpers";
import { Errors } from "../../errors";
import Qsl from "../models";
import isQslOwner from "../middlewares/isQslOwner";
import { logger } from "../../../shared/logger";

const router = Router();

/**
 * @openapi
 * /qsl:
 *  get:
 *    summary: Finds all QSLs
 *    tags:
 *      - qsl
 *    responses:
 *      '200':
 *        description: Found QSLs
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Qsl'
 *      '401':
 *        description: Not logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */
router.get("/", async (req, res) => {
    if (!req.user) {
        logger.error("req.user not populated for QSL search");
        process.exit(1);
    }

    try {
        const qsl = await Qsl.find({ fromUser: req.user._id });
        return res.json(qsl);
    } catch (err) {
        logger.error("Error in QSL search");
        logger.error(err);
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(createError(Errors.SERVER_ERROR));
    }
});

export default router;
