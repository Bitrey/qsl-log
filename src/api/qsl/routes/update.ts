import { Request, Response, Router } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status";
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
 *  put:
 *    summary: Updates an existing QSL (all body fields are optional)
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          format: ObjectId
 *        required: true
 *        description: ObjectId of the QSL to find
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Qsl'
 *    tags:
 *      - qsl
 *    responses:
 *      '200':
 *        description: Updated QSL
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Qsl'
 *      '400':
 *        description: Invalid input data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
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
router.put(
    "/:_id",
    checkSchema(updateSchema),
    isQslOwner,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(BAD_REQUEST)
                .json(
                    createError(
                        [
                            ...new Set(errors.array().map((e: any) => e.param))
                        ].join()
                    )
                );
        }

        if (!req.qsl) {
            logger.error("QSL update not this.qsl");
            process.exit(1);
        }

        const {
            ownCallsign,
            qslCallsign,
            frequencyKhz,
            modulation,
            fromTime,
            toTime,
            ownLocator,
            qslLocator,
            rst,
            comments
        } = req.body;

        try {
            const qsl = await Qsl.findOneAndUpdate(
                { _id: req.qsl._id },
                {
                    ownCallsign,
                    qslCallsign,
                    frequencyKhz,
                    modulation,
                    fromTime,
                    toTime,
                    ownLocator,
                    qslLocator,
                    rst,
                    comments
                },
                { new: true }
            );
            return res.json(qsl);
        } catch (err) {
            logger.error("Error in QSL update");
            logger.error(err);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json(createError(Errors.QSL_CREATE_ERROR));
        }
    }
);

export default router;
