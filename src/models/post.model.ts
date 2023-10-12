import {
  prop,
  modelOptions,
  getModelForClass,
  Ref,
} from "@typegoose/typegoose";
import { UserSchema } from "./user.model";
import { CategorySchema } from "./category.model";
import { CommunitySchema } from "./community.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class PostSchema {
  @prop({ required: true, trim: true })
  title: string;
  @prop({ required: false, trim: true })
  text: string;
  @prop({ ref: () => UserSchema, required: true })
  user: Ref<UserSchema>;
  @prop({ ref: () => CategorySchema, required: true })
  category: Ref<CategorySchema>[];
  @prop({ ref: () => CommunitySchema, required: true })
  community: Ref<CommunitySchema>;
  @prop()
  image: { public_id: string; secure_url: string };
  @prop({ default: false })
  edited: boolean;
}

export default getModelForClass(PostSchema);
