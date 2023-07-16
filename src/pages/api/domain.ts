import { UnauthorizedError } from "@/types/api/error";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { apiHandler } from "@/libs/api_handlers";
import { DirectoryAPI } from "@/libs/google-api/directory";

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw new UnauthorizedError();
  }

  const api = new DirectoryAPI(session);
  const result = await api.getDomains();
  return res.status(result.code).json(result);
};

export default apiHandler({
  GET: getHandler,
});
