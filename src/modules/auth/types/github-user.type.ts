export type GitHubUser = {
  id: number;
  login: string;
  email: string;
  name: string | null;
  avatar_url: string;
  [key: string]: unknown;
};

export type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

export type GitHubUserResponse = GitHubUser | { error: string; error_description?: string };
