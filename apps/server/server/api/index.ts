import { defineHandler, HTTPError } from "nitro";

export default defineHandler((event) => {
  throw new HTTPError("Example Error!", { status: 500 });
  // return { message: "Hello from API!" };
});
