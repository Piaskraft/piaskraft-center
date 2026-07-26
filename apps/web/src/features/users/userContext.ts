import { createContext } from "react";
import type { AppUser, AppUserRole } from "./userTypes";

export type UserContextValue = {
  currentUser: AppUser;
  setCurrentUserRole: (role: AppUserRole) => void;
};

export const UserContext = createContext<UserContextValue | null>(null);
