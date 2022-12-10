import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { UserClass } from "../../auth/models/User";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Qsl:
 *        type: object
 *        required:
 *          - fromUser
 *          - ownCallsign
 *          - qslCallsign
 *          - frequencyKhz
 *          - modulation
 *        properties:
 *          fromUser:
 *            type: string
 *            description: ObjectId of User who created this QSL
 *          ownCallsign:
 *            type: string
 *            minLength: 1
 *            description: Callsign of the User (might have a specific prefix / suffix)
 *            example: IU4QSG/M
 *          qslCallsign:
 *            type: string
 *            minLength: 1
 *            description: Callsign of the connected ham
 *            example: IU4QSE/M
 *          frequencyKhz:
 *            type: number
 *            minimum: 3
 *            maximum: 3000000000
 *            description: Frequency in KHz
 *            example: 145275
 *          modulation:
 *            type: string
 *            minLength: 1
 *            maxLength: 10
 *            description: Modulation type
 *            example: FM
 *          fromTime:
 *            type: string
 *            format: date-time
 *            description: Start time of this QSO
 *            example: 2017-07-21T17:32:28Z
 *          toTime:
 *            type: string
 *            format: date-time
 *            description: End time of this QSO
 *            example: 2017-07-21T17:33:28Z
 *          ownLocator:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Grid position of the User who created this QSL
 *            example: JN54mn
 *          qslLocator:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Grid position of the connected ham
 *            example: JN54ls
 *          rst:
 *            type: integer
 *            minimum: 0
 *            maximum: 999
 *            description: RST
 *            example: 599
 *          comments:
 *            type: string
 *            minLength: 1
 *            maxLength: 1000
 *            description: Additional comments about this QSL
 *            example: My friend Mec
 */

@modelOptions({
    schemaOptions: { timestamps: true },
    options: { customName: "Qsl" }
})
export class QslClass {
    @prop({ ref: () => UserClass })
    public fromUser!: Ref<UserClass>;

    // remember to cache it
    @prop({ required: true, minlength: 1, uppercase: true })
    public ownCallsign!: string;

    @prop({ required: true, minlength: 1, uppercase: true })
    public qslCallsign!: string;

    // remember to cache it
    @prop({ required: true, min: 3, max: 3000000000 })
    public frequencyKhz!: number;

    // remember to cache it
    @prop({ required: true, minlength: 1, maxlength: 10 })
    public modulation!: string;

    // remember to get it automatically
    @prop({ required: true })
    public fromTime!: Date;

    @prop()
    public toTime?: Date;

    // remember to fetch it automatically
    @prop({ minlength: 1, maxlength: 100 })
    public ownLocator?: string;

    @prop({ minlength: 1, maxlength: 100 })
    public qslLocator?: string;

    // 3 1-digit number textboxes
    @prop({ min: 0, max: 999 })
    public rst?: number;

    // remember to fetch it automatically
    @prop({ minlength: 1, maxlength: 1000 })
    public comments?: string;
}
