type action = {
  addLabelIds: string[];
  removeLabelIds: string[];
  forward: string;
};

type criteria = {
  from: string;
  to: string;
  subject: string;
  query: string;
  negatedQuery: string;
  hasAttachment: boolean;
  excludeCharts: boolean;
  size: number;
  sizeComparison: "unspecified" | "smaller" | "larger";
};

export type filter = {
  id: string;
  criteria: criteria;
  action: action;
};

export type filterList = {
  filter: filter[];
};
