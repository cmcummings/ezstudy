import { createContext, useContext } from "react";
import { useSubmit } from "react-router-dom";
import type { User } from "./util/types";

export const UserContext = createContext<User | undefined>(undefined);

export function useUser() {
  const user = useContext(UserContext);
  return user;
}

export function useLogout() {
  const submit = useSubmit();

  return () => {
    submit(null, { method: "post", action: "/api/auth/logout" });
  }
}
