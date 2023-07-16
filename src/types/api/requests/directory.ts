export type getGroupListRequest = {
  domain: string;
};
export const isGetGroupListRequest = (
  query: Partial<{
    [key: string]: string | string[];
  }>
): query is getGroupListRequest => {
  return !!query.domain && typeof query.domain === "string";
};

export type insertGroupRequest = {
  email: string;
  name: string;
};
export const isInsertGroupRequest = (body: any): body is insertGroupRequest => {
  return (
    body.email &&
    typeof body.email === "string" &&
    body.name &&
    typeof body.name === "string"
  );
};

export type groupKeyRequest = {
  groupKey: string;
};
export const isGroupKeyRequest = (
  query: Partial<{ [key: string]: string | string[] }>
): query is groupKeyRequest => {
  return !!query.groupKey && typeof query.groupKey === "string";
};
