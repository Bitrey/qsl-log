import mongoose from "mongoose";
import { envs } from "../../shared/envs";
import { logger } from "../../shared/logger";

mongoose.connect(envs.MONGODB_URI);
mongoose.connection.on("error", err => {
    logger.error("Error while connecting to MongoDB");
    logger.error(err);
});
