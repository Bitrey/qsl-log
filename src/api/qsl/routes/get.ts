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
 * /qsl/{id}:
 *  get:
 *    summary: Finds a new QSL
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          format: ObjectId
 *        required: true
 *        description: ObjectId of the QSL to find
 *    tags:
 *      - qsl
 *    responses:
 *      '200':
 *        description: Found QSL
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Qsl'
 *      '401':
 *        description: Not logged in or QSL not owned
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '404':
 *        description: QSL not found
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
router.get("/:_id", isQslOwner, async (req, res) => {
    res.json(req.qsl);
});

export default router;
