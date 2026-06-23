import { defineHandler } from "nitro";

export default defineHandler((event) => {
  return { message: "OK" };
});
