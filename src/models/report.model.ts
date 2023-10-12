import {
  prop,
  modelOptions,
  getModelForClass,
  Ref,
} from "@typegoose/typegoose";
import { UserSchema } from "./user.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
class ReportSchema {
  @prop({ required: true, trim: true })
  context: string;

  @prop({ ref: () => UserSchema, required: true })
  reportedBy: Ref<UserSchema>;

  @prop({ ref: () => UserSchema, required: true })
  userReported: Ref<UserSchema>;

  @prop()
  elementReported: { id: string; text: string; title: string };
}

export default getModelForClass(ReportSchema);
