// app/dashboard/layout.tsx
"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import UserProvider from "@/providers/UserProvider";
import { Header } from "@/components/header";

type AuthResponse = {
  isAuthenticated: boolean;
  message: string;
  user?: any;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    authenticate();
    setLoading(true);
  }, []);

  const authenticate = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      redirect("/login");
    }
    const res = await api.post<AuthResponse>("users/is-auth", {
      userId: userId,
    });
    const data = res.data;
    if (!data.isAuthenticated || data.user.role !== "counselor") {
      redirect("/login");
    }
    setAuthenticated(data.isAuthenticated);
    setUser(data.user);
  };

  return authenticated ? (
    <UserProvider user={user}>{children}</UserProvider>
  ) : (
    <></>
  );
}
