import { Arg, Int, Query, Resolver, UseMiddleware } from "type-graphql";
import { DashboardOutput } from "../dtos/output/dashboard.output";
import { DashboardService } from "../services/dashboard.service";
import { IsAuth } from "../middlewares/auth.middleware";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User } from "@prisma/client";
import { DashboardData } from "../types/dashboard.types";

@Resolver()
export class DashboardResolver {
  private dashboardService = new DashboardService();

  @Query(() => DashboardOutput)
  @UseMiddleware(IsAuth)
  async dashboard(
    @GqlUser() user: User,
    @Arg("month", () => Int, { nullable: true }) month?: number,
    @Arg("year", () => Int, { nullable: true }) year?: number,
  ): Promise<DashboardData> {
    return this.dashboardService.getDashboardData(user.id, month, year);
  }
}
