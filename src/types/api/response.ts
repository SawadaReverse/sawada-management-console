import { StatusCodes } from "http-status-codes";

export type SuccessResponse<T> = {
  code: number;
  data: T;
};

export const isSuccessResponse = (
  res: any
): res is SuccessResponse<unknown> => {
  return typeof res === "object" && res.code && res.code === StatusCodes.OK;
};

export type FailedResponse = {
  code: number;
  message: string;
};

export const isFailedResponse = (res: any): res is FailedResponse => {
  return (
    typeof res === "object" &&
    res.code &&
    res.code !== StatusCodes.OK &&
    res.message &&
    typeof res.message === "string"
  );
};
