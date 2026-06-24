import { ofetch } from "ofetch";

// Base instance that automatically prefixes /api and handles CORS
export const api = ofetch.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export { ofetch };
