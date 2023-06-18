export type getFilterRequest = {
  toMailAddress: string;
};
export const isGetFilterRequest = (
  query: Partial<{ [key: string]: string | string[] }>
): query is getFilterRequest => {
  return !!query.toMailAddress && typeof query.toMailAddress === "string";
};

export type createFilterRequest = {
  toMailAddress: string;
  addLabelIds: string[];
};
export const isCreateFilterRequest = (
  body: any
): body is createFilterRequest => {
  return (
    body.toMailAddress &&
    typeof body.toMailAddress === "string" &&
    body.addLabelIds &&
    Array.isArray(body.addLabelIds)
  );
};

export type deleteFilterRequest = {
  id: string;
};
export const isDeleteFilterRequest = (
  query: Partial<{ [key: string]: string | string[] }>
): query is deleteFilterRequest => {
  return !!query.id && typeof query.id === "string";
};
