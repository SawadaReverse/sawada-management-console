import { MethodNotAllowedError, isApiError } from "@/types/api/error";
import { Handlers, isHttpMethod } from "./types/apiHandler";
import { FailedResponse } from "@/types/api/response";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

export const apiHandler = (handlers: Handlers) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method } = req;
      if (!method || !isHttpMethod(method)) {
        throw new MethodNotAllowedError();
      }

      const handler = handlers[method];
      if (!handler) {
        throw new MethodNotAllowedError();
      }

      await handler(req, res);
    } catch (error) {
      errorHandler(error, res);
    }
  };
};

export const errorHandler = (error: unknown, res: NextApiResponse) => {
  console.error(error);
  const response: FailedResponse = {
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Fatal error. this is other error.",
  };
  if (isApiError(error)) {
    response.code = error.code;
    response.message = error.message;
  }

  return res.status(response.code).json(response);
};
