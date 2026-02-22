"use client";
import EnergySupportDashboard from "@/app/dashboard/energy/page";
import { User } from "@/types/User";
import { useParams } from "next/navigation";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

const StudentReport = () => {
  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getUser();
  }, [userId]);

  const getUser = async () => {
    //fetch user data from api
    const res = await api.get(`/users/profile/${userId}`);
    const data = await res.data;
    setUser(data.user);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-wellness-light to-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {user ? `${user.name}'s Wellness Report` : "Loading..."}
        </h1>
        {user && <EnergySupportDashboard u={user} />}
      </div>
    </div>
  );
};

export default StudentReport;
