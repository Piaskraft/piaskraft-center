import { useContext } from "react";
import { UserContext } from "./userContext";

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser musi być używany wewnątrz UserProvider.");
  }

  return context;
}
