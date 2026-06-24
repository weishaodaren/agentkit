import { definePlugin } from "nitro";
import { logger } from "~/utils/logger.ts";

const timings = new WeakMap<Request, number>();

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook("request", (event) => {
    timings.set(event.req, performance.now());
  });

  nitroApp.hooks.hook("response", (res, event) => {
    const start = timings.get(event.req);
    const duration = start ? (performance.now() - start).toFixed(2) : "?";
    const { method, url } = event.req;
    const path = new URL(url, "http://localhost").pathname;

    logger.info(
      { method, path, status: res.status, duration: `${duration}ms` },
      `${method} ${path} ${res.status} ${duration}ms`,
    );
  });
});
