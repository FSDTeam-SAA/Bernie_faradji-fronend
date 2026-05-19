"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/common/Pagination";

interface Subscription {
  planName: string;
  price: string;
  date: string;
  status: "Active" | "Expired" | "Cleared";
}

const subscriptions: Subscription[] = [
  { planName: "Monthly", price: "£45", date: "11-12-2026", status: "Active" },
  { planName: "Weekly", price: "£45", date: "11-12-2026", status: "Expired" },
  { planName: "Daily", price: "£45", date: "11-12-2026", status: "Cleared" },
  { planName: "Monthly", price: "£45", date: "11-12-2026", status: "Expired" },
  { planName: "Monthly", price: "£45", date: "11-12-2026", status: "Expired" },
];

export default function SubscriptionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);

  const paginatedSubscriptions = subscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "secondary";
      case "Expired":
        return "destructive";
      case "Cleared":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="w-full montserrat ">
      <h1 className="text-2xl font-bold mb-6">Subscription</h1>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Subscription Details</h2>
          <select className="border rounded-md p-2 text-sm">
            <option>Status</option>
            <option>Active</option>
            <option>Expired</option>
            <option>Cleared</option>
          </select>
        </div>

        <Table className="rounded-lg shadow overflow-x-auto bg-white">
          <TableHeader className="bg-[#E0EEFF]">
            <TableRow>
              <TableHead className="text-center">Plan Name</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center text-[#222222] font-normal">
            {paginatedSubscriptions.map((sub, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-bold py-4 text-center">{sub.planName}</TableCell>
                <TableCell className="py-4 text-center">{sub.price}</TableCell>
                <TableCell className="py-4 text-center">{sub.date}</TableCell>
                <TableCell className="py-4 text-center">
                  <Badge
                    variant={getBadgeVariant(sub.status)}
                    className="px-3 py-1 text-sm rounded-full"
                  >
                    {sub.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="mt-4 self-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}