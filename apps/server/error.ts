import { defineErrorHandler } from "nitro";

export default defineErrorHandler((error, _event) => {
  return new Response(`System Error: ${error.message}`, {
    status: 500,
    headers: { "Content-Type": "text/plain" },
  });
});
