import { Request, Response, Router } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status";
import { createError } from "../../helpers";
import { Errors } from "../../errors";
import { checkSchema, validationResult } from "express-validator";
import Qsl from "../models";
import { UserDoc } from "../../auth/models";
import createSchema from "../schemas/createSchema";
import { logger } from "../../../shared/logger";

const router = Router();

/**
 * @openapi
 * /qsl:
 *  post:
 *    summary: Creates a new QSL
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
 *        description: New QSL
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
router.post(
    "/",
    checkSchema(createSchema),
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
            const qsl = await Qsl.create({
                fromUser: (req.user as UserDoc)._id,
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
            });
            logger.debug("Created QSL " + qsl._id);
            return res.json(qsl);
        } catch (err) {
            logger.error("Error in QSL create");
            logger.error(err);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json(createError(Errors.QSL_CREATE_ERROR));
        }
    }
);

export default router;
