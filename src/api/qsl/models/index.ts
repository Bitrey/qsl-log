import { DocumentType, getModelForClass } from "@typegoose/typegoose";
import { QslClass } from "./Qsl";

const Qsl = getModelForClass(QslClass);
export type QslDoc = DocumentType<QslClass>;
export default Qsl;
