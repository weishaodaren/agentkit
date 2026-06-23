import pino from "pino";
import { useRuntimeConfig } from "nitro/runtime-config";

const config = useRuntimeConfig();

export const logger = pino({
  level: (config.logLevel as string) || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
