/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - callsign
 *          - email
 *          - password
 *          - qsls
 *        properties:
 *          callsign:
 *            type: string
 *            minLength: 1
 *            description: Callsign without prefixes / suffixes
 *            example: IU4QSG
 *          password:
 *            type: string
 *            format: password
 *            minLength: 1
 *            description: Hashed password
 *          qsls:
 *            type: array
 *            items:
 *              type: string
 *              minLength: 1
 *            description: ObjectIds of the QSLs
 */

import {
    DocumentType,
    modelOptions,
    pre,
    prop,
    Ref
} from "@typegoose/typegoose";
import EmailValidator from "email-validator";
import bcrypt from "bcrypt";
import { QslClass } from "../../qsl/models/Qsl";

@pre<UserClass>("save", async function (next) {
    const plainPw = this.password;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(plainPw, salt);
    next();
})
@modelOptions({
    schemaOptions: { timestamps: true },
    options: { customName: "User" }
})
export class UserClass {
    @prop({ required: true, minlength: 1, uppercase: true })
    public callsign!: string;

    @prop({
        required: true,
        minlength: 1,
        validate: {
            validator: EmailValidator.validate,
            message: "Invalid email"
        },
        lowercase: true
    })
    public email!: string;

    @prop({ required: true, minlength: 1 })
    public password!: string;

    @prop({ ref: () => QslClass, default: [] })
    public qsls!: Ref<QslClass>[];

    public async isValidPw(this: DocumentType<UserClass>, plainPw: string) {
        return await bcrypt.compare(plainPw, this.password);
    }
}
