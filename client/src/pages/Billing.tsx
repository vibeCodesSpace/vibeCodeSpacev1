import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

const Billing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/api/stripe/create-checkout-session", {
        method: "POST",
      });
      window.location.href = response.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/api/stripe/create-portal-session", {
        method: "POST",
      });
      window.location.href = response.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Billing</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <Button
                onClick={handleSubscribe}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={loading}
              >
                {loading ? "Processing..." : "Subscribe"}
              </Button>
              <Button
                onClick={handleManageSubscription}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Manage Subscription"}
              </Button>
            </div>
          ) : (
            <p className="text-white">
              Please log in to manage your subscription.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
