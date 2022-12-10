import { Router } from "express";
import { OK } from "http-status";
import passport from "passport";

const router = Router();

/**
 * @openapi
 * /auth/signup:
 *  post:
 *    summary: Creates a new account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              callsign:
 *                type: string
 *              password:
 *                type: string
 *                format: password
 *              email:
 *                type: string
 *                format: email
 *              required:
 *                - callsign
 *                - email
 *                - password
 *    tags:
 *      - auth
 *    responses:
 *      '200':
 *        description: Signed up successfully
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */
router.post(
    "/",
    passport.authenticate("signup", { session: false }),
    (req, res, next) => {
        res.sendStatus(OK);
    }
);

export default router;
