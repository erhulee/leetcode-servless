const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");
const cors = require('@koa/cors');
const { init: initDB, Counter } = require("./db");
const { default: axios } = require("axios");

const router = new Router();
router.get("/calendar",async (ctx)=>{
  const {request} = ctx;
  const query = request.query;
  const userName = query.name;
  const a = {"query":"\n    query userProfileCalendar($userSlug: String!, $year: Int) {\n  userCalendar(userSlug: $userSlug, year: $year) {\n    streak\n    totalActiveDays\n    submissionCalendar\n  }\n}\n    ","variables":{"userSlug":userName}};
  const data = await axios.post("https://leetcode.cn/graphql/noj-go/",a);
  ctx.body = {
    data:data.data
  }

})


// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (ctx) => {
  if (ctx.request.headers["x-wx-source"]) {
    ctx.body = ctx.request.headers["x-wx-openid"];
  }
});

const app = new Koa();
app
  .use(cors())
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())


const port = process.env.PORT || 80;
async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();
