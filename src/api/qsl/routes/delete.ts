import { Request, Response, Router } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "http-status";
import { createError } from "../../helpers";
import { Errors } from "../../errors";
import { checkSchema, validationResult } from "express-validator";
import Qsl from "../models";
import updateSchema from "../schemas/updateSchema";
import { logger } from "../../../shared/logger";
import isQslOwner from "../middlewares/isQslOwner";

const router = Router();

/**
 * @openapi
 * /qsl/{id}:
 *  delete:
 *    summary: Deletes an existing QSL
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          format: ObjectId
 *        required: true
 *        description: ObjectId of the QSL to delete
 *    tags:
 *      - qsl
 *    responses:
 *      '200':
 *        description: QSL successfully deleted
 *      '401':
 *        description: Not logged in or QSL not owned
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
router.put("/:_id", isQslOwner, async (req, res) => {
    if (!req.qsl) {
        logger.error("QSL delete not this.qsl");
        process.exit(1);
    }

    try {
        req.qsl.deleteOne();
        return res.sendStatus(OK);
    } catch (err) {
        logger.error("Error in QSL delete");
        logger.error(err);
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(createError(Errors.QSL_CREATE_ERROR));
    }
});

export default router;
