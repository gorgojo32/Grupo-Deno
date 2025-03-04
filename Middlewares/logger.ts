// En Middlewares/logger.ts
import { Context } from "../Dependencies/dependencias.ts";

export const logger = async (ctx: Context, next: () => Promise<unknown>) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
};