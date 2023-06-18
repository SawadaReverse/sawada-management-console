import { GET_DOMAINS_LIST_URL, GROUPS_URL } from "@/constants/google_api_url";
import { InternalServerError } from "@/types/api/error";
import {
  getGroupListRequest,
  groupKeyRequest,
  insertGroupRequest,
} from "@/types/api/requests/directory";
import { SuccessResponse, FailedResponse } from "@/types/api/response";
import {
  domainList,
  group,
  groupList,
  member,
} from "@/types/google_api_client/directory";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "next/dist/server/api-utils";
import { GoogleApi } from "@/lib/google_api_client/client";
import { Session } from "next-auth";

export class DirectoryAPI extends GoogleApi {
  constructor(session: Session) {
    super(session);
  }
  /**
   * getDomains
   */
  public async getDomains(): Promise<
    SuccessResponse<domainList> | FailedResponse
  > {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.get<domainList>(
        GET_DOMAINS_LIST_URL
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const response: SuccessResponse<domainList> = {
      code: StatusCodes.OK,
      data: googleResponse.data,
    };
    return response;
  }
  /**
   * getGroup
   * @param req etag または グループID
   */
  public async getGroup(
    req: groupKeyRequest
  ): Promise<SuccessResponse<group> | FailedResponse> {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.get<group>(
        `${GROUPS_URL}/${req.groupKey}`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }
      throw new InternalServerError();
    }

    const response: SuccessResponse<group> = {
      code: StatusCodes.OK,
      data: googleResponse.data,
    };
    return response;
  }

  /**
   * getGroupsFromDomain
   */
  public async getGroupListFromDomain(
    req: getGroupListRequest
  ): Promise<SuccessResponse<groupList> | FailedResponse> {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.get<groupList>(GROUPS_URL, {
        params: { domain: req.domain },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const response: SuccessResponse<groupList> = {
      code: StatusCodes.OK,
      data: googleResponse.data,
    };
    return response;
  }

  /**
   * insertGroup
   * @param email メールアドレス
   * @param groupName グループ名
   */
  public async insertGroup(
    req: insertGroupRequest
  ): Promise<SuccessResponse<group> | FailedResponse> {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.post<group>(GROUPS_URL, req);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const response: SuccessResponse<group> = {
      code: StatusCodes.OK,
      data: googleResponse.data,
    };
    return response;
  }

  /**
   * insertMemberToGroup
   */
  public async insertUserToGroup(
    req: groupKeyRequest
  ): Promise<SuccessResponse<member> | FailedResponse> {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.post<member>(
        `${GROUPS_URL}/${req.groupKey}/members`,
        { email: this.userEmail }
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const response: SuccessResponse<member> = {
      code: StatusCodes.OK,
      data: googleResponse.data,
    };
    return response;
  }

  /**
   * deleteGroup
   */
  public async deleteGroup(
    req: groupKeyRequest
  ): Promise<SuccessResponse<Object> | FailedResponse> {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.delete(
        `${GROUPS_URL}/${req.groupKey}`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const response: SuccessResponse<Object> = {
      code: StatusCodes.OK,
      data: {},
    };

    return response;
  }
}
