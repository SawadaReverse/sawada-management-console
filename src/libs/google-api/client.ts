import axios, { AxiosInstance } from "axios";
import { Session } from "next-auth";

export class GoogleApi {
  protected httpClient: AxiosInstance;
  protected userEmail: string;
  constructor(session: Session) {
    this.httpClient = axios.create({
      headers: {
        Authorization: `OAuth ${session.user.token}`,
        "Content-Type": "application/json",
      },
    });
    this.userEmail = session.user.email;
    return this;
  }
}
