import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class RoleSchema {
  @prop()
  title: string;
}

export default getModelForClass(RoleSchema);
