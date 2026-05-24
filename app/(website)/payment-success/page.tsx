import PaymentStatusTemplate from "@/components/common/PaymentStatusTemplate";
import { Suspense } from "react";


export default function PaymentSuccessPage() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
       <PaymentStatusTemplate
      status="success"
      badge="Payment Confirmed"
      title="Payment Successful"
      description="Your payment has been processed successfully. We have sent a confirmation and your selected service is now being prepared."
      primaryAction={{ href: "/dashboard", label: "Go To Dashboard" }}
      secondaryAction={{ href: "/", label: "Back To Home" }}
      checklist={[
        "You should receive a confirmation email or receipt shortly.",
        "Your purchase details are available in your dashboard.",
        "Need help? Our support team is ready to assist you.",
      ]}
    />
    </Suspense>
   
  );
}
