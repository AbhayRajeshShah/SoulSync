"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown } from "lucide-react";
import { User as UserType } from "@/types/User";
import { redirect } from "next/navigation";

interface StudentsTableProps {
  students: UserType[];
}

type SortField = keyof UserType;
type SortOrder = "asc" | "desc";

export function StudentsTable({ students }: StudentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
      (student.name &&
        student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email &&
        student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getStatusColor = (streak: number) => {
    if (streak >= 14)
      return "bg-wellness-accent text-wellness-positive border-wellness-primary/30";
    if (streak > 0) return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getStatus = (streak: number) => {
    if (streak >= 14) return "Active";
    if (streak > 0) return "Engaged";
    return "Inactive";
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return (
      <ArrowUpDown
        className={`w-4 h-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`}
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-wellness-muted/50"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-wellness-muted/30">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-wellness-light">
              <TableRow className="hover:bg-wellness-light border-wellness-muted/20">
                <TableHead className="cursor-pointer hover:bg-wellness-accent/50 transition-colors">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
                    onClick={() => handleSort("name")}
                  >
                    <span className="flex items-center gap-2">
                      Name
                      <SortIcon field="name" />
                    </span>
                  </Button>
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="cursor-pointer hover:bg-wellness-accent/50 transition-colors text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto font-semibold text-foreground hover:bg-transparent ml-auto"
                    onClick={() => handleSort("streakCount")}
                  >
                    <span className="flex items-center gap-2">
                      Streak
                      <SortIcon field="streakCount" />
                    </span>
                  </Button>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-wellness-accent/50 transition-colors text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto font-semibold text-foreground hover:bg-transparent ml-auto"
                    onClick={() => handleSort("points")}
                  >
                    <span className="flex items-center gap-2">
                      Points
                      <SortIcon field="points" />
                    </span>
                  </Button>
                </TableHead>
                <TableHead className="text-right">Last Journal</TableHead>
                <TableHead className="cursor-pointer hover:bg-wellness-accent/50 transition-colors">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
                    onClick={() => handleSort("streakCount")}
                  >
                    <span className="flex items-center gap-2">
                      Status
                      <SortIcon field="streakCount" />
                    </span>
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => {
                const d =
                  student.lastJournalDate && new Date(student.lastJournalDate);

                const lastJournalDate = d
                  ? d.toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      timeZone: "UTC", // 👈 key part
                    })
                  : "Never";
                return (
                  <TableRow
                    onClick={() => {
                      redirect(`/wellness/user-report/${student._id}`);
                    }}
                    key={student._id?.toString()}
                    className="hover:bg-wellness-accent/20 cursor-pointer border-wellness-muted/20"
                  >
                    <TableCell className="font-medium text-foreground">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {student.email}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-wellness-primary">
                      {student.streakCount}d
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {student.points}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {lastJournalDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          student.streakCount &&
                          getStatusColor(student.streakCount)
                        } capitalize border`}
                      >
                        {student.streakCount && getStatus(student.streakCount)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card className="p-4 bg-gradient-to-br from-wellness-light to-wellness-accent/50 border-wellness-muted/30">
          <p className="text-sm text-muted-foreground font-medium">
            Total Students
          </p>
          <p className="text-2xl font-bold text-wellness-primary mt-1">
            {students.length}
          </p>
        </Card>
        <Card className="p-4 bg-linear-to-br from-green-50 to-green-100/50 border-wellness-positive/30">
          <p className="text-sm text-muted-foreground font-medium">Active</p>
          <p className="text-2xl font-bold text-wellness-positive mt-1">
            {
              students.filter((s) => {
                if (s.streakCount) {
                  return s.streakCount >= 14;
                }
              }).length
            }
          </p>
        </Card>
        <Card className="p-4 bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <p className="text-sm text-muted-foreground font-medium">Engaged</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {
              students.filter((s) => {
                if (s.streakCount) {
                  return s.streakCount > 0 && s.streakCount < 14;
                }
              }).length
            }
          </p>
        </Card>
        <Card className="p-4 bg-linear-to-br from-gray-50 to-gray-100/50 border-gray-200">
          <p className="text-sm text-muted-foreground font-medium">
            Avg Points
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {Math.round(
              students.reduce((acc, s) => {
                if (s.points) {
                  return acc + s.points;
                }
                return 0;
              }, 0) / students.length
            )}
          </p>
        </Card>
      </div>
    </div>
  );
}
