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
class BanSchema {
  @prop({ ref: () => UserSchema, required: true })
  user: Ref<UserSchema>;
  @prop({ required: true })
  reason: string;
}

export default getModelForClass(BanSchema);
