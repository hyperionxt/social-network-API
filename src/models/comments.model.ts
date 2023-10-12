import {
  prop,
  modelOptions,
  getModelForClass,
  Ref,
} from "@typegoose/typegoose";
import { UserSchema } from "./user.model";
import { PostSchema } from "./post.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class CommentSchema {
  @prop({ required: true })
  text: string;
  @prop({ ref: () => UserSchema, required: true })
  user: Ref<UserSchema>;
  @prop({ ref: () => PostSchema, required: true })
  post: Ref<PostSchema>;
  @prop({ ref: () => CommentSchema })
  parentComment: Ref<CommentSchema>;
  @prop({ ref: () => CommentSchema })
  replies: Ref<CommentSchema>[];
}

export default getModelForClass(CommentSchema);
