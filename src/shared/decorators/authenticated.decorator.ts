import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticatedPayload } from '../guards/jwt.guard'

export const Authenticated = createParamDecorator(async (_, ctx: ExecutionContext): Promise<AuthenticatedPayload> => {
  return ctx.switchToHttp().getRequest().usuario as AuthenticatedPayload
})
