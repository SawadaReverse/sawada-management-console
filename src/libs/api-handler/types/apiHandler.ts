import { NextApiHandler } from "next/types";

const httpMethods = ["GET", "POST", "DELETE"] as const;
type HttpMethod = (typeof httpMethods)[number];
export const isHttpMethod = (method: string): method is HttpMethod => {
  return httpMethods.some((m) => m === method);
};

export type Handlers = {
  [key in HttpMethod]?: NextApiHandler;
};
