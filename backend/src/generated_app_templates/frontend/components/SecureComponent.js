// generated_app/components/SecureComponent.js
import { useState } from "react";

const SecureComponent = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // The frontend calls its OWN backend proxy endpoint.
      // It does not know the secret API key.
      const response = await fetch("/api/proxied-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ some: "payload" }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data from the secure endpoint.");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={isLoading}>
        {isLoading ? "Loading..." : "Fetch Secure Data"}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default SecureComponent;
