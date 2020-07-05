import dotenv from "dotenv";
dotenv.config();

import Koa from "koa";
import Router from "koa-router";
import cors from "koa-cors";
import bodyParser from "koa-bodyparser";
import serve from "koa-static";
import mount from "koa-mount";

import routes from "./routes";

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());
app.use(mount("/static", serve("static")));

routes(router);
app.use(router.routes());

app.listen(process.env.PORT || 3000);
console.log(`listening on port ${process.env.PORT || 3000}`);
