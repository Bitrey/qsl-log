import { Errors } from "../errors";

export function createError(err: Errors, additionalParams = {}) {
    return { err, ...additionalParams };
}
