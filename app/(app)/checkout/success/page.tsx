"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl mt-4">Thank You for Your Order!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Your order has been placed successfully. You will receive a confirmation email shortly.
            </p>
            
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 mb-6">
              <p className="font-medium">Order Summary</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                You will be redirected to the homepage in {countdown} seconds...
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => router.push("/")}
                className="w-full sm:w-auto"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/orders")}
                className="w-full sm:w-auto"
              >
                View Order Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}