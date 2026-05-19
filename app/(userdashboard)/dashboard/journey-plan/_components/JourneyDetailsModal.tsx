"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface JourneyDetailsProps {
  open: boolean;
  onClose: () => void;
  data: {
    name: string;
    email: string;
    vehicleNumber: string;
    journeyName: string;
    totalAmount: string;
    purchaseDate: string;
    journeyDate: string;
  };
}

export const JourneyDetailsModal: React.FC<JourneyDetailsProps> = ({ open, onClose, data }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-blue-600 font-semibold">Details</DialogTitle>
          <DialogClose className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
            ✕
          </DialogClose>
        </DialogHeader>

        <div className="mt-4 space-y-2 text-sm">
          <p><span className="font-semibold">Name:</span> {data.name}</p>
          <p><span className="font-semibold">Email:</span> {data.email}</p>
          <p><span className="font-semibold">Vehicle Registration Number:</span> {data.vehicleNumber}</p>
          <p><span className="font-semibold">Journey Name:</span> {data.journeyName}</p>
          <p><span className="font-semibold">Total Amount:</span> {data.totalAmount}</p>
          <p><span className="font-semibold">Purchase Date:</span> {data.purchaseDate}</p>
          <p><span className="font-semibold">Journey Date:</span> {data.journeyDate}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};