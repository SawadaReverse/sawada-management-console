import { Session } from "next-auth";
import { GoogleApi } from "./client";
import {
  createLabelRequest,
  deleteLabelRequest,
  getLabelRequest,
} from "@/types/api/requests/gmail_label";
import { GMAIL_LABELS_URL } from "./constants";
import { label, labels } from "./types/gmail-label";
import axios from "axios";
import {
  ApiError,
  InternalServerError,
  NotFoundError,
} from "@/types/api/error";
import { SuccessResponse } from "@/types/api/response";
import { StatusCodes } from "http-status-codes";

export class GmailLabelAPI extends GoogleApi {
  constructor(session: Session) {
    super(session);
  }

  /**
   * getLabel
   */
  public async getLabel(req: getLabelRequest) {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.get<labels>(GMAIL_LABELS_URL);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const label = googleResponse.data.labels.find(
      (label) => label.name === req.name
    );
    if (!label) {
      throw new NotFoundError(`label.name === ${req.name}`);
    }

    const response: SuccessResponse<label> = {
      code: StatusCodes.OK,
      data: label,
    };
    return response;
  }

  /**
   * createLabel
   */
  public async createLabel(req: createLabelRequest) {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.post<label>(GMAIL_LABELS_URL, req);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const response: SuccessResponse<label> = {
      code: StatusCodes.OK,
      data: googleResponse.data,
    };
    return response;
  }

  /**
   * deleteLabel
   */
  public async deleteLabel(req: deleteLabelRequest) {
    let googleResponse;
    try {
      googleResponse = await this.httpClient.delete<label>(
        `${GMAIL_LABELS_URL}/${req.id}`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(error.response.status, error.message);
      }

      throw new InternalServerError();
    }

    const response: SuccessResponse<label> = {
      code: StatusCodes.OK,
      data: googleResponse.data,
    };
    return response;
  }
}
