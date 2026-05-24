import PaymentStatusTemplate from "@/components/common/PaymentStatusTemplate";
import { Suspense } from "react";

export default function PaymentFailPage() {
  return (

    <Suspense fallback={<div>Loading...</div>}>
     <PaymentStatusTemplate
      status="failed"
      badge="Payment Unsuccessful"
      title="Payment Failed"
      description="We could not complete your payment this time. Please review the issue below and try again with a valid payment method."
      primaryAction={{ href: "/journey", label: "Try Payment Again" }}
      secondaryAction={{ href: "/", label: "Back To Home" }}
      checklist={[
        "Check that your card or payment method has sufficient balance.",
        "Verify billing details and confirm there are no typing mistakes.",
        "If the issue continues, contact your bank or reach out to support.",
      ]}
      fallbackReason="The payment attempt was declined by the payment provider."
    />
    </Suspense>
  );
}
