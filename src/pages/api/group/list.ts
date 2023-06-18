import { BadRequestError, UnauthorizedError } from "@/types/api/error";
import { isGetGroupListRequest } from "@/types/api/requests/directory";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { apiHandler } from "@/lib/api_handlers";
import { DirectoryAPI } from "@/lib/google_api_client/directory";

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  if (!isGetGroupListRequest(query)) {
    throw new BadRequestError();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new DirectoryAPI(session);
  const result = await api.getGroupListFromDomain(query);
  return res.status(result.code).json(result);
};

export default apiHandler({
  GET: getHandler,
});
