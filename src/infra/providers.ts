import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "src/shared/guards/jwt.guard";
import { JwtStrategy } from "src/shared/strategies/jwt.strategy";


export const providers = [
  JwtStrategy,
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  // {
  //   provide: APP_GUARD,
  //   useClass: RoleGuard,
  // },
]