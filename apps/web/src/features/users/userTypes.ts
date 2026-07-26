export type AppUserRole = "Admin" | "Operator";

export type AppUser = {
  role: AppUserRole;
  name: string;
};

export const appUsers: Record<AppUserRole, AppUser> = {
  Admin: {
    role: "Admin",
    name: "Mateusz",
  },
  Operator: {
    role: "Operator",
    name: "Agnieszka",
  },
};
