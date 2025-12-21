import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
// import { captureAndFinalizePaymentService } from "@/services";
// import { useLocation } from "react-router-dom";

function PaypalPaymentReturnPage() {
  // const location = useLocation();
  // const params = new URLSearchParams(location.search);
  // const paymentId = params.get("paymentId");
  // const payerId = params.get("PayerID");

  useEffect(() => {
    // Logic for Razorpay success handling if needed
    // Currently Razorpay handler in CourseDetailsPage handles the verification
    // and navigates here.
    // So this page can just show a success message or redirect to courses.

    const timeout = setTimeout(() => {
        window.location.href = "/student-courses";
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Successful! Redirecting to your courses...</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalPaymentReturnPage;
