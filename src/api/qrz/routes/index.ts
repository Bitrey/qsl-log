import { logger } from "@typegoose/typegoose/lib/logSettings";
import { Router } from "express";
import { INTERNAL_SERVER_ERROR } from "http-status";
import Qrz from "..";
import { Errors } from "../../errors";
import { createError } from "../../helpers";

const router = Router();

const qrz = new Qrz();

/**
 * @openapi
 * /qrz/{callsign}:
 *  post:
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
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */
router.get("/:callsign", async (req, res) => {
    try {
        const info = await qrz.getInfo(req.params.callsign);
        res.json(info);
    } catch (err) {
        logger.error("Error while fetching qrz");
        logger.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(
            createError(Errors.UNKNOWN_ERROR)
        );
    }
});

export default router;