import { useState, type ReactNode } from "react";
import { UserContext } from "./userContext";
import { appUsers, type AppUserRole } from "./userTypes";

type UserProviderProps = {
  children: ReactNode;
};

const USER_ROLE_STORAGE_KEY = "piaskraft-current-user-role";

export function UserProvider({ children }: UserProviderProps) {
  const [currentUserRole, setCurrentUserRoleState] = useState<AppUserRole>(
    () => {
      const savedRole = localStorage.getItem(USER_ROLE_STORAGE_KEY);

      return savedRole === "Operator" ? "Operator" : "Admin";
    },
  );

  function setCurrentUserRole(role: AppUserRole) {
    setCurrentUserRoleState(role);
    localStorage.setItem(USER_ROLE_STORAGE_KEY, role);
  }

  const currentUser = appUsers[currentUserRole];

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUserRole }}>
      {children}
    </UserContext.Provider>
  );
}
