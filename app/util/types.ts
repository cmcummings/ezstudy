// Shared types used by server and client

export type User = {
  id: string,
  username: string,
  avatarUrl?: string
};

export type Term = {
  id: number,
  term: string,
  definition: string,
};

export type Set = {
  creator: User,
  id: number,
  name: string,
  public: boolean,
  description?: string,
  createdAt: string
};

export type SetWithTerms = Set & { terms: Term[] };