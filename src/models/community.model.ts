import {
  prop,
  modelOptions,
  getModelForClass,
  Ref,
} from "@typegoose/typegoose";
import { UserSchema } from "./user.model";
import { CategorySchema } from "./category.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class CommunitySchema {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  text: string;

  @prop({ ref: () => UserSchema, required: true })
  user: Ref<UserSchema>;

  @prop({ ref: () => CategorySchema, required: true })
  category: Ref<CategorySchema>[];

  @prop({ default: 0 })
  members: number;

  @prop({ default: false })
  edited: string;

  @prop()
  image: { public_id: string; secure_url: string };
}

export default getModelForClass(CommunitySchema);
