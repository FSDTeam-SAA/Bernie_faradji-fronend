"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface TokenDetailsData {
  tokenId: string;
  vehicleNumber: string;
  quantity: number;
  tokenPrice: string;
  totalAmount: string;
  purchaseDateTime: string;
  ticketCodes: string[];
}

interface TokenDetailsModalProps {
  open: boolean;
  onClose: () => void;
  data: TokenDetailsData | null;
}

interface DetailItemProps {
  label: string;
  value: string | number;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#1C1C1C]">{value}</p>
    </div>
  );
}

export function TokenDetailsModal({ open, onClose, data }: TokenDetailsModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] gap-0 rounded-xl border border-slate-200 bg-white p-0 sm:max-w-2xl">
        <div className="rounded-t-xl bg-[#E0EEFF] px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#033D86]">
              Token Details
            </DialogTitle>
            <DialogDescription className="text-xs text-[#2D5B93]">
              Full details of your selected token purchase.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 pb-6">
          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
            <DetailItem label="Token ID" value={data?.tokenId ?? "--"} />
            <DetailItem
              label="Vehicle Registration Number"
              value={data?.vehicleNumber ?? "--"}
            />
            <DetailItem label="Token Price" value={data?.tokenPrice ?? "--"} />
            <DetailItem label="Quantity" value={data?.quantity ?? "--"} />
            <DetailItem label="Total Amount" value={data?.totalAmount ?? "--"} />
            <DetailItem label="Purchase Date" value={data?.purchaseDateTime ?? "--"} />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[#1C1C1C] ">Token Number</p>
            {data?.ticketCodes?.length ? (
              <div className="flex flex-wrap gap-2">
                {data.ticketCodes.map((ticketCode) => (
                  <Badge
                    key={ticketCode}
                    variant="outline"
                    className="h-auto rounded-md border-[#B7D2F4] bg-[#F3F8FF] px-2.5 py-1 text-xs font-semibold text-[#033D86] font-sans"
                  >
                    {ticketCode}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                No ticket code found for this token.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
