import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface QueryBoolParams {
  field: string;
  defaultValue: boolean;
}

export default createParamDecorator(
  (data: string | QueryBoolParams, ctx: ExecutionContext) => {
    const query = ctx.switchToHttp().getRequest().query;

    if (data instanceof String) {
      return query[data as string] === 'true';
    }
    data = data as QueryBoolParams;
    return query[data.field] ? query[data.field] === 'true' : data.defaultValue;
  },
);
