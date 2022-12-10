import { Router } from "express";
import passport from "passport";
import { Errors } from "../../errors";
import jwt from "jsonwebtoken";
import { envs } from "../../../shared/envs";
import { AuthOptions } from "../shared";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *  post:
 *    summary: Logs in with given callsign and password
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
 *              required:
 *                - callsign
 *                - password
 *    tags:
 *      - auth
 *    responses:
 *      '200':
 *        description: Logged in
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */
router.post("/", async (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
        try {
            if (err || !user) {
                const err = new Error(Errors.UNKNOWN_ERROR);
                return next(err);
            }

            req.login(user, { session: false }, async err => {
                if (err) return next(err);

                const body = { _id: user._id, callsign: user.callsign };
                const token = jwt.sign(
                    {
                        callsign: user.callsign,
                        expiration:
                            Date.now() + AuthOptions.AUTH_COOKIE_DURATION_MS
                    },
                    envs.JWT_SECRET
                );

                res.cookie(AuthOptions.AUTH_COOKIE_NAME, token, {
                    httpOnly: true,
                    signed: true
                });

                return res.json({ token });
            });
        } catch (err) {
            return next(err);
        }
    })(req, res, next);
});

export default router;
