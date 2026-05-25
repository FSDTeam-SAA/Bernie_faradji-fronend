"use client";

import { useState } from "react";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface LogoutConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  callbackUrlLabel?: string;
}

export default function LogoutConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  callbackUrlLabel,
}: LogoutConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !isSubmitting && onOpenChange(nextOpen)}
    >
      <DialogContent
        showCloseButton={!isSubmitting}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl sm:max-w-md"
      >
        {/* Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-400" />

        <div className="px-6 pb-6 pt-6">
          <DialogHeader className="space-y-4">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-rose-50 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-md">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>

            {/* Title */}
            <DialogTitle className="montserrat text-center text-2xl font-bold text-slate-800">
              Confirm Logout
            </DialogTitle>

            {/* Description */}
            <DialogDescription className="montserrat text-center text-sm leading-6 text-slate-500">
              Are you sure you want to log out from your account?
              {callbackUrlLabel && (
                <>
                  <br />
                  <span className="font-medium text-slate-700">
                    You will be redirected to {callbackUrlLabel}.
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Footer */}
          <DialogFooter className="mt-8 flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="montserrat h-11 flex-1 cursor-pointer rounded-xl border-slate-300 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={isSubmitting}
              onClick={handleConfirm}
              className="montserrat cursor-pointer h-11 flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-sm font-semibold text-white shadow-lg transition-all hover:from-red-600 hover:to-rose-600"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}

              {isSubmitting ? "Logging out..." : "Yes, Log out"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}