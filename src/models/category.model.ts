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
export class CategorySchema {
  @prop({ required: true, unique: true })
  title: string;

  @prop({ ref: () => UserSchema, required: true })
  user: Ref<UserSchema>;
}

export default getModelForClass(CategorySchema);
