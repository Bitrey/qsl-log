import "./db";
import "./auth";
import express, { ErrorRequestHandler } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/routes";
import qslRoutes from "./qsl/routes";
import qrzRoutes from "./qrz/routes";
import passport from "passport";
import { INTERNAL_SERVER_ERROR } from "http-status";
import { createError } from "./helpers";
import { Errors } from "./errors";
import { logger, LoggerStream } from "../shared/logger";
import { envs } from "../shared/envs";

const app = express();

app.use(morgan("dev", { stream: new LoggerStream() }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser(envs.COOKIE_SECRET));

app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/qsl", passport.authenticate("jwt", { session: false }), qslRoutes);
app.use("/qrz", passport.authenticate("jwt", { session: false }), qrzRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error("Express request handler error");

    const isUserError =
        err instanceof (Error as any) &&
        err.message in Errors &&
        ![Errors.SERVER_ERROR, Errors.UNKNOWN_ERROR].includes(err.message);
    if (isUserError) {
        logger.debug(err);
    } else {
        logger.error(err);
    }

    res.status(INTERNAL_SERVER_ERROR).json(
        createError(isUserError ? err.message : Errors.UNKNOWN_ERROR)
    );
};

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
const IP = process.env.IP || "127.0.0.1";
app.listen(PORT, IP, () => {
    logger.info(`Server started on ${IP}:${PORT}`);
});
