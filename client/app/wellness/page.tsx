"use client";

import { StudentsTable } from "@/components/students-table";
import studentsData from "@/data/students.json";
import api from "@/lib/axios";
import { User } from "@/types/User";
import { get } from "http";
import { useState, useEffect } from "react";

export default function EducatorDashboard() {
  //   const students: User[] = studentsData.students;
  const [students, setStudents] = useState<User[]>();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    //fetch user data from api
    const res = await api.get("/users/students");
    const data = await res.data;
    setStudents(data.students);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-wellness-light to-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Student Wellness Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor student engagement, wellness metrics, and points progression
          </p>
        </div>

        {/* Students Table */}
        {students && <StudentsTable students={students} />}
      </div>
    </main>
  );
}
