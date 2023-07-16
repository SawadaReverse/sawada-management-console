import { GMAIL_FILTER_URL } from "@/constants/google_api_url";
import { InternalServerError, NotFoundError } from "@/types/api/error";
import { SuccessResponse, FailedResponse } from "@/types/api/response";
import { filter, filterList } from "@/libs/google-api/types/gmail-filter";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "next/dist/server/api-utils";
import { GoogleApi } from "./client";
import { Session } from "next-auth";
import {
  createFilterRequest,
  deleteFilterRequest,
  getFilterRequest,
} from "@/types/api/requests/gmail_filter";

export class GmailFilterAPI extends GoogleApi {
  constructor(session: Session) {
    super(session);
  }

  /**
   * getFilter
   */
  public async getFilter(
    req: getFilterRequest
  ): Promise<SuccessResponse<filter> | FailedResponse> {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.get<filterList>(GMAIL_FILTER_URL);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const filter = googleResponse.data.filter.find(
      (v) => v.criteria.to === req.toMailAddress
    );
    if (!filter) {
      throw new NotFoundError(`filter.to === ${req.toMailAddress}`);
    }

    const response: SuccessResponse<filter> = {
      code: StatusCodes.OK,
      data: filter,
    };
    return response;
  }

  /**
   * createFilter
   */
  public async createFilter(req: createFilterRequest) {
    let googleResponse;
    const reqBody = {
      criteria: {
        to: req.toMailAddress,
      },
      action: {
        addLabelIds: req.addLabelIds,
      },
    };
    try {
      googleResponse = await this.httpClient.post<filter>(
        GMAIL_FILTER_URL,
        reqBody
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const response: SuccessResponse<filter> = {
      code: StatusCodes.OK,
      data: googleResponse.data,
    };
    return response;
  }

  /**
   * deleteFilter
   */
  public async deleteFilter(req: deleteFilterRequest) {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.delete<filter>(
        `${GMAIL_FILTER_URL}/${req.id}`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const response: SuccessResponse<filter> = {
      code: StatusCodes.OK,
      data: googleResponse.data,
    };
    return response;
  }
}
