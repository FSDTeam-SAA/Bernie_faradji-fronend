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
import { Eye } from "lucide-react";
import { JourneyDetailsModal } from "./_components/JourneyDetailsModal";

interface Journey {
  name: string;
  email: string;
  vehicleNumber: string;
  journeyName: string;
  type: string;
  purchaseDate: string;
  journeyDate: string;
  amount: string;
  totalAmount: string;
  status: "Cleared" | "Pending";
}

const journeys: Journey[] = [
  {
    name: "John Doe",
    email: "john@example.com",
    vehicleNumber: "AB12CD",
    journeyName: "Central London",
    type: "Congestion Charge",
    purchaseDate: "11-12-2026",
    journeyDate: "12-12-2026",
    amount: "£45",
    totalAmount: "£45",
    status: "Cleared",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    vehicleNumber: "EF34GH",
    journeyName: "East London",
    type: "ULEZ Charge",
    purchaseDate: "11-12-2026",
    journeyDate: "12-12-2026",
    amount: "£45",
    totalAmount: "£45",
    status: "Pending",
  },
  {
    name: "Bob Wilson",
    email: "bob@example.com",
    vehicleNumber: "IJ56KL",
    journeyName: "Tunnel Route",
    type: "Tunnel Charge",
    purchaseDate: "11-12-2026",
    journeyDate: "12-12-2026",
    amount: "£40",
    totalAmount: "£40",
    status: "Pending",
  },
  {
    name: "Alice Brown",
    email: "alice@example.com",
    vehicleNumber: "MN78OP",
    journeyName: "West Tunnel",
    type: "Tunnel Charge",
    purchaseDate: "11-12-2026",
    journeyDate: "12-12-2026",
    amount: "£54",
    totalAmount: "£54",
    status: "Cleared",
  },
  {
    name: "Charlie Davis",
    email: "charlie@example.com",
    vehicleNumber: "QR90ST",
    journeyName: "North London",
    type: "ULEZ Charge",
    purchaseDate: "11-12-2026",
    journeyDate: "12-12-2026",
    amount: "£54",
    totalAmount: "£54",
    status: "Cleared",
  },
];

export default function JourneyPlan() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(journeys.length / itemsPerPage);
    const [isOpen, setIsOpen] = useState(false);

  const paginatedJourneys = journeys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="w-full montserrat ">
      <h3 className="text-xl font-semibold mb-4">Journey Plan</h3>

      {/* Journey Plan Table */}
      <div>
        <h4 className="text-lg font-medium mb-2 flex justify-between items-center">
          Journey Plan Details
          {/* Optional dropdown filter */}
          <select className="border rounded-md p-2 text-sm">
            <option>Status</option>
            <option>Cleared</option>
            <option>Pending</option>
          </select>
        </h4>

        <Table className="bg-white rounded-lg shadow">
          <TableHeader className="bg-[#E0EEFF]">
            <TableRow>
              <TableHead className="text-center">Charge Type</TableHead>
              <TableHead className="text-center">Purchase Date</TableHead>
              <TableHead className="text-center">Journey Date</TableHead>
              <TableHead className="text-center">Total Amount</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-base text-[#222222] font-normal">
            {paginatedJourneys.map((journey, idx) => (
              <TableRow key={idx} className="text-center">
                <TableCell className="font-bold py-4 text-center">
                  {journey.type}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {journey.purchaseDate}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {journey.journeyDate}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {journey.amount}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <Badge
                    variant={
                      journey.status === "Cleared" ? "default" : "secondary"
                    }
                    className="px-3 py-1 text-sm rounded-full"
                  >
                    {journey.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <button
                  onClick={() => setIsOpen(true)}
                   className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <Eye size={18} />
                  </button>
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

          <JourneyDetailsModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        data={journeys[0]}
      />
    </div>
  );
}
