import Router from "koa-router";
import runs from "./runs";

const routes = (router: Router<any, {}>) => {
  runs(router);
};

export default routes;
