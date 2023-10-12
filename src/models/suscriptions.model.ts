import {
  prop,
  modelOptions,
  getModelForClass,
  Ref,
} from "@typegoose/typegoose";
import { UserSchema } from "./user.model";
import { CommunitySchema } from "./community.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class SuscriptionSchema {
  @prop({ ref: () => UserSchema, required: true })
  user: Ref<UserSchema>;

  @prop({ ref: () => CommunitySchema, required: true })
  community: Ref<CommunitySchema>;
}

export default getModelForClass(SuscriptionSchema);
