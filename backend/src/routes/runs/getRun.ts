import Koa from "koa";
import { getRunData } from "../../utils";

export const getRun = (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
  next: Koa.Next
) => {
  const path = ctx.params.path.replace(/(__)/g, "/") as string;
  const data = getRunData(path);
  ctx.body = data;
};
