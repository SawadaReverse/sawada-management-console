import { BadRequestError, UnauthorizedError } from "@/types/api/error";
import {
  isCreateFilterRequest,
  isDeleteFilterRequest,
  isGetFilterRequest,
} from "@/types/api/requests/gmail_filter";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { GmailFilterAPI } from "@/libs/google-api/gmail-filter";
import { apiHandler } from "@/libs/api_handlers";

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  if (!isGetFilterRequest(query)) {
    throw new BadRequestError();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new GmailFilterAPI(session);
  const result = await api.getFilter(query);
  return res.status(result.code).json(result);
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const parsed = JSON.parse(req.body);
  if (!isCreateFilterRequest(parsed)) {
    throw new BadRequestError();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new GmailFilterAPI(session);
  const createFilterResult = await api.createFilter(parsed);
  return res.status(createFilterResult.code).json(createFilterResult);
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  if (!isDeleteFilterRequest(query)) {
    throw new BadRequestError();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new GmailFilterAPI(session);
  const deleteFilterResult = await api.deleteFilter(query);
  return res.status(deleteFilterResult.code).json(deleteFilterResult);
};

export default apiHandler({
  GET: getHandler,
  POST: postHandler,
  DELETE: deleteHandler,
});
