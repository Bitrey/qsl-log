import { Router } from "express";
import { param } from "express-validator";
import { INTERNAL_SERVER_ERROR } from "http-status";
import Qrz from "..";
import { logger } from "../../../shared/logger";
import { Errors } from "../../errors";
import { createError } from "../../helpers";

const router = Router();

const qrz = new Qrz();

/**
 * @openapi
 * /qrz/{callsign}:
 *  get:
 *    summary: Fetch QRZ and QTH info for a callsign
 *    parameters:
 *      - in: path
 *        name: callsign
 *        schema:
 *          type: string
 *        required: true
 *        description: Callsign to fetch
 *    tags:
 *      - qrz
 *    responses:
 *      '200':
 *        description: Fetched QRZ and QTH info
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/QrzInfo'
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
router.get(
    "/:callsign",
    param("callsign").trim().toUpperCase(),
    async (req, res) => {
        try {
            const info = await qrz.getInfo(
                (req.params as { callsign: string }).callsign
            );
            res.json(info);
        } catch (err) {
            logger.error("Error while fetching qrz");
            logger.error(err);
            res.status(INTERNAL_SERVER_ERROR).json(
                createError(Errors.UNKNOWN_ERROR)
            );
        }
    }
);

export default router;
