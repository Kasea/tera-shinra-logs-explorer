import Koa from "koa";
import { getAllFilesInDirectory } from "../../utils";

export const getAll = (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
  next: Koa.Next
) => {
  const files = getAllFilesInDirectory("runs").map((data) =>
    data.replace(/(\/)/g, "__")
  );
  ctx.body = files;
};
