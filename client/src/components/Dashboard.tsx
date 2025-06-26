import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {user?.username}!
          </h1>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Your VibeCode Dashboard
          </h2>
          <p className="text-gray-300">
            Start building your projects here. More features coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
