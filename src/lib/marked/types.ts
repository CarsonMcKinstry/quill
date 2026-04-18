import { Token } from "marked";

export type ExtendedToken = Token & {
  originalType: string;
  injectedTags: InjectedTags;
};

export const isExtendedToken = (token: Token): token is ExtendedToken => {
  return "originalType" in token;
};

export type InjectedTags = {
  id: string | null;
  classes: string | null;
  styles: Record<string, string> | null;
  attributes: Record<string, string> | null;
};
