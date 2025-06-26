import { CallToAction } from "@/components/CallToAction.tsx";
import { Hero } from "@/components/Hero.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { AuthProvider } from "@/components/auth/AuthForm.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import Index from "@/components/index/Index";
import Auth from "@/hooks/useAuth.tsx";
import Dashboard from "@/components/dashboard/Dashboard";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/auth" component={Auth} />
            <Route path="/dashboard">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
