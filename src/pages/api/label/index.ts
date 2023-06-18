import { NextApiRequest, NextApiResponse } from "next";
import { BadRequestError, UnauthorizedError } from "@/types/api/error";
import {
  isCreateLabelRequest,
  isDeleteLabelRequest,
  isGetLabelRequest,
} from "@/types/api/requests/gmail_label";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { GmailLabelAPI } from "@/lib/google_api_client/gmail_label";
import { apiHandler } from "@/lib/api_handlers";

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  if (!isGetLabelRequest(query)) {
    throw new BadRequestError();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new GmailLabelAPI(session);
  const result = await api.getLabel(query);
  return res.status(result.code).json(result);
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const parsed = JSON.parse(req.body);
  if (!isCreateLabelRequest(parsed)) {
    throw new BadRequestError();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new GmailLabelAPI(session);
  const result = await api.createLabel(parsed);
  return res.status(result.code).json(result);
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  if (!isDeleteLabelRequest(query)) {
    throw new BadRequestError();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new GmailLabelAPI(session);
  const result = await api.deleteLabel(query);
  return res.status(result.code).json(result);
};

export default apiHandler({
  GET: getHandler,
  POST: postHandler,
  DELETE: deleteHandler,
});
