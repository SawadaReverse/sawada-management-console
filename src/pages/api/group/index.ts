import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { apiHandler } from "@/lib/api_handlers";
import { BadRequestError, UnauthorizedError } from "@/types/api/error";
import {
  groupKeyRequest,
  isGroupKeyRequest,
  isInsertGroupRequest,
} from "@/types/api/requests/directory";
import { isFailedResponse } from "@/types/api/response";
import { StatusCodes } from "http-status-codes";
import { DirectoryAPI } from "@/lib/google_api_client/directory";

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  if (!isGroupKeyRequest(query)) {
    throw new BadRequestError();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new DirectoryAPI(session);
  const result = await api.getGroup(query);
  return res.status(result.code).json(result);
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const parsed = JSON.parse(req.body);
  if (!isInsertGroupRequest(parsed)) {
    throw new BadRequestError();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new DirectoryAPI(session);
  const insertGroupResult = await api.insertGroup(parsed);
  if (isFailedResponse(insertGroupResult)) {
    return res.status(insertGroupResult.code).json(insertGroupResult);
  }

  const insertMemberRequest: groupKeyRequest = {
    groupKey: insertGroupResult.data.id,
  };

  // TODO: メンバー挿入処理はエンドポイント分ける
  const insertMemberResult = await api.insertUserToGroup(insertMemberRequest);

  const response = res.status(insertMemberResult.code);

  if (insertMemberResult.code !== StatusCodes.OK) {
    return response.json(insertMemberResult);
  }
  return response.json(insertGroupResult);
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  if (!isGroupKeyRequest(query)) {
    throw new BadRequestError();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new DirectoryAPI(session);
  const result = await api.deleteGroup(query);
  return res.status(result.code).json(result);
};

export default apiHandler({
  GET: getHandler,
  POST: postHandler,
  DELETE: deleteHandler,
});
