type color = {
  textColor: string;
  backgroundColor: string;
};

export type label = {
  id: string;
  name: string;
  messageListVisibility: "show" | "hide";
  labelListVisibility: "labelShow" | "labelShowIfUnread" | "labelHide";
  type: "system" | "user";
  messagesTotal: number;
  messagesUnread: number;
  threadsTotal: number;
  threadsUnread: number;
  color: color;
};

export type labels = {
  labels: label[];
};
