import { prismaClient } from "../../prisma/prisma";
import { UpdateUserInput } from "../dtos/input/user.input";
import { User } from "@prisma/client";

export class UserService {
  async findById(id: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });

    return updatedUser;
  }
}
