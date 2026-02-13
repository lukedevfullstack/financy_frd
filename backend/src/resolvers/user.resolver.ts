import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { UpdateUserInput } from "../dtos/input/user.input";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { IsAuth } from "../middlewares/auth.middleware";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User } from "@prisma/client";

@Resolver()
export class UserResolver {
  private userService = new UserService();

  @Query(() => UserModel, { nullable: true })
  @UseMiddleware(IsAuth)
  async me(@GqlUser() user: User): Promise<User | null> {
    const userData = await this.userService.findById(user.id);

    if (!userData) {
      throw new Error("User not found");
    }

    return userData;
  }

  @Mutation(() => UserModel)
  @UseMiddleware(IsAuth)
  async updateUser(
    @Arg("data", () => UpdateUserInput) data: UpdateUserInput,
    @GqlUser() user: User,
  ): Promise<User> {
    const updatedUser = await this.userService.update(user.id, data);
    return updatedUser;
  }
}
