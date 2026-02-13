import { Field, ObjectType } from "type-graphql";
import { UserModel } from "../../models/user.model";

@ObjectType()
export class UserOutput {
  @Field(() => UserModel)
  user!: UserModel;
}
