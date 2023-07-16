type adminAPICommon = {
  kind: string;
  etag: string;
};

type domainAlias = adminAPICommon & {
  parentDomainName: string;
  verified: boolean;
  creationTime: string;
  domainAliasName: string;
};

type domain = adminAPICommon & {
  domainAliases: domainAlias[];
  verified: boolean;
  creationTime: string;
  isPrimary: boolean;
  domainName: string;
};

export type domainList = adminAPICommon & {
  domains: domain[];
};

export type group = adminAPICommon & {
  id: string;
  email: string;
  name: string;
  description: string;
  adminCreated: boolean;
  directMembersCount: string;
  aliases?: string[];
  nonEditableAliases: string[];
};

export type groupList = adminAPICommon & {
  nextPageToken: string;
  groups: group[];
};

export type member = adminAPICommon & {
  email: string;
  role: "MANAGER" | "MEMBER" | "OWNER";
  type: "CUSTOMER" | "EXTERNAL" | "GROUP" | "USER";
  status: string;
  deliverySettings: "ALL_MAIL" | "DAILY" | "DIGEST" | "DISABLED" | "NONE";
  id: string;
};
