export type getLabelRequest = {
  name: string;
};
export const isGetLabelRequest = (
  query: Partial<{ [key: string]: string | string[] }>
): query is getLabelRequest => {
  return !!query.name && typeof query.name === "string";
};

export type createLabelRequest = {
  name: string;
};
export const isCreateLabelRequest = (body: any): body is createLabelRequest => {
  return body.name && typeof body.name === "string";
};

export type deleteLabelRequest = {
  id: string;
};
export const isDeleteLabelRequest = (
  query: Partial<{ [key: string]: string | string[] }>
): query is deleteLabelRequest => {
  return !!query.id && typeof query.id === "string";
};
