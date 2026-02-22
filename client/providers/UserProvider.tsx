// app/UserProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { User } from "@/types/User";
import { ReactNode } from "react";

interface UserProviderProps {
  user: User;
  children: ReactNode;
}

const UserContext = createContext<User | null>(null);

export default function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): User | null {
  return useContext(UserContext);
}
