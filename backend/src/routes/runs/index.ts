import Router from "koa-router";
import { getAll } from "./getAll";
import { getRun } from "./getRun";

const runs = (router: Router<any, {}>) => {
  router.get("Get all runs", "/runs", getAll);
  router.get("Get a specific run", "/runs/:path", getRun);
};

export default runs;
