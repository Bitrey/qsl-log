import { getModelForClass } from "@typegoose/typegoose";
import { QslClass } from "./Qsl";

const Qsl = getModelForClass(QslClass);
export default Qsl;
