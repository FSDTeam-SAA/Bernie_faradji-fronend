"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/common/Pagination";

interface Activity {
  type: string;
  date: string;
  amount: string;
  status: "Cleared" | "Pending";
}

const activities: Activity[] = [
  { type: "Congestion Charge", date: "11-12-2026", amount: "£45", status: "Cleared" },
  { type: "ULEZ Charge", date: "11-12-2026", amount: "£40", status: "Pending" },
  { type: "Tunnel Charge", date: "11-12-2026", amount: "£54", status: "Cleared" },
  // Add more as needed
];

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const paginatedActivities = activities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className=" w-full montserrat">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#002A5D] text-white p-6 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm">Total Tokens</p>
            <h2 className="text-4xl font-bold">15</h2>
          </div>
          <div className="bg-white text-blue-900 w-12 h-12 flex items-center justify-center rounded-[12px]">£</div>
        </div>
        <div className="bg-[#004EAF] text-white p-6 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm">Total Journeys Taken</p>
            <h2 className="text-4xl font-bold">5</h2>
          </div>
          <div className="bg-white text-blue-600 w-12 h-12 flex items-center justify-center rounded-[12px]">🚗</div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <Table className="bg-white rounded-lg shadow">
          <TableHeader className="bg-[#E0EEFF]">
            <TableRow>
              <TableHead>Charge Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-base text-[#222222] font-normal ">
            {paginatedActivities.map((act, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-bold py-4">{act.type}</TableCell>
                <TableCell>{act.date}</TableCell>
                <TableCell>{act.amount}</TableCell>
                <TableCell>
                  <Badge className="h-[36px] rounded-[18px] " variant={act.status === "Cleared" ? "default" : "destructive"}>
                    {act.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};