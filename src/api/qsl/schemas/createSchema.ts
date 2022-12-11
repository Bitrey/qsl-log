import { Schema } from "express-validator";

const createSchema: Schema = {
    ownCallsign: {
        isString: { options: [] },
        trim: { options: [] },
        isLength: { options: { min: 1, max: 20 } },
        toUpperCase: { options: [] }
    },
    qslCallsign: {
        isString: { options: [] },
        trim: { options: [] },
        isLength: { options: { min: 1, max: 20 } },
        toUpperCase: { options: [] }
    },
    frequencyKhz: { isFloat: { options: { min: 3, max: 3000000000 } } },
    modulation: {
        isString: { options: [] },
        trim: { options: [] },
        isLength: { options: { min: 1, max: 10 } },
        toUpperCase: { options: [] }
    },
    fromTime: { isISO8601: { options: [] } },
    toTime: { optional: { options: {} }, isISO8601: { options: [] } },
    ownLocator: {
        optional: { options: {} },
        isString: { options: [] },
        trim: { options: [] },
        isLength: { options: { min: 1, max: 100 } }
    },
    qslLocator: {
        optional: { options: {} },
        isString: { options: [] },
        trim: { options: [] },
        isLength: { options: { min: 1, max: 100 } }
    },
    rst: {
        optional: { options: {} },
        isInt: { options: { min: 0, max: 999 } }
    },
    comments: {
        optional: { options: {} },
        isString: { options: [] },
        trim: { options: [] },
        isLength: { options: { min: 1, max: 1000 } }
    }
};
export default createSchema;
