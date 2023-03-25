

export type User = {
  id: string,
  username: string,
  avatarUrl?: string
}

export type Term = {
  term: string,
  definition: string,
}

export type Set = {
  creator: User,
  id: number,
  name: string,
  description?: string,
  createdAt: string
}