import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const BranchId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user?.branchId ?? req.headers['x-branch-id'];
});
