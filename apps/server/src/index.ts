import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import {
  type HonoBindings,
  type HonoVariables,
  MastraServer,
} from "@mastra/hono";

import { mastra, logger } from "@/mastra";

const app = new Hono<{ Bindings: HonoBindings; Variables: HonoVariables }>();

// CORS — 允许 web 开发服务器（localhost:3000）直接访问
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const server = new MastraServer({ app, mastra });
await server.init();

app.use("*", async (c, next) => {
  const start = Date.now();
  const { method, url } = c.req;

  // 记录请求开始（debug 级别，生产环境可调高）
  logger.debug(`Request started`, { method, url });

  await next();

  // 记录请求完成
  const duration = Date.now() - start;
  const status = c.res.status;
  const level = status >= 400 ? "error" : status >= 300 ? "warn" : "info";

  logger[level](`Request completed`, {
    method,
    url,
    status,
    duration: `${duration}ms`,
    // 可选：记录用户身份（如果从 header 中解析了）
    userId: c.req.header("x-user-id"),
    // 可选：记录请求 ID 用于链路追踪
    requestId: c.req.header("x-request-id"),
  });
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  (info) => {
    logger.info(`Server is running on http://localhost:${info.port}`);
  },
);
