import { getModelForClass } from "@typegoose/typegoose";
import { UserClass } from "./User";

const User = getModelForClass(UserClass);
export default User;
