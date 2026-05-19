"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/common/Pagination";

interface Token {
  token: string;
  amount: string;
  date: string;
  vehicle: string;
}

const tokens: Token[] = [
  { token: "£5", amount: "£45", date: "11-12-2026", vehicle: "LX 334 GHO" },
  { token: "£5", amount: "£45", date: "11-12-2026", vehicle: "LKJ 787 HUI" },
  { token: "£5", amount: "£40", date: "11-12-2026", vehicle: "2332 KJ KKK" },
  { token: "£5", amount: "£54", date: "11-12-2026", vehicle: "LKJ 787 HUI" },
  { token: "£5", amount: "£54", date: "11-12-2026", vehicle: "2332 KJ KKK" },
];

export default function TokensPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(tokens.length / itemsPerPage);

  const paginatedTokens = tokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full montserrat ">
      {/* Winner Card */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Tokens</h3>
        <div className="bg-white shadow rounded-lg p-6 flex justify-center items-center">
          <div className="text-center bg-gray-400 text-white w-full max-w-sm py-10 rounded-lg">
            <p className="text-sm">Winner</p>
            <h4 className="mt-2 font-medium">Not Selected Yet!</h4>
          </div>
        </div>
      </div>

      {/* Token Details Table */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Token Details</h3>
        <Table className="bg-white rounded-lg shadow">
         <TableHeader className="bg-[#E0EEFF]">
  <TableRow>
    <TableHead className="text-center">Token</TableHead>
    <TableHead className="text-center">Total Amount</TableHead>
    <TableHead className="text-center">Date</TableHead>
    <TableHead className="text-center">
      Vehicle Registration Number
    </TableHead>
  </TableRow>
</TableHeader>

<TableBody className="text-base text-[#222222] font-normal">
  {paginatedTokens.map((t, idx) => (
    <TableRow key={idx}>
      <TableCell className="font-bold py-4 text-center">
        {t.token}
      </TableCell>
      <TableCell className="text-center">
        {t.amount}
      </TableCell>
      <TableCell className="text-center">
        {t.date}
      </TableCell>
      <TableCell className="text-center">
        {t.vehicle}
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
}