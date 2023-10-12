import {
  prop,
  pre,
  modelOptions,
  getModelForClass,
  Ref,
  ReturnModelType,
} from "@typegoose/typegoose";
import { RoleSchema } from "./role.models";

@pre<UserSchema>("save", function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
})
export class UserSchema {
  @prop({ required: true, unique: true, trim: true })
  username: string;

  @prop({ required: true, unique: true, trim: true })
  email: string;

  @prop({ trim: true })
  password: string;

  @prop({ required: false, default: "" })
  description: string;

  @prop({ ref: () => RoleSchema, required: true })
  role: Ref<RoleSchema>;

  @prop({ default: false })
  verified: boolean;

  @prop()
  googleId: string;

  @prop()
  image: { public_id: string; secure_url: string };

  @prop({ default: false })
  banned: boolean;
  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;

  static async findByUsername(
    this: ReturnModelType<typeof UserSchema>,
    username: string
  ) {
    return this.find({ username });
  }
}

export default getModelForClass(UserSchema);
