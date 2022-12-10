// import { Router } from "express";
// import Log from "../models/Log";
// import { INTERNAL_SERVER_ERROR } from "http-status";
// import { createError } from "../../helpers";
// import { logger } from "@typegoose/typegoose/lib/logSettings";
// import { Errors } from "../../errors";

// router = Router();

// router.put("/:_id", async (req, res) => {
//     try {
//         // DEBUG: add filters
//         const log = await Log.find({});
//         return res.json(log);
//     } catch (err) {
//         logger.error("Error in QSL search");
//         logger.error(err);
//         return res
//             .status(INTERNAL_SERVER_ERROR)
//             .json(createError(Errors.SERVER_ERROR));
//     }
// });

// export default router;
