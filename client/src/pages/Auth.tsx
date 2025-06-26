import { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <AuthForm
      mode={mode}
      onToggle={() => setMode(mode === "login" ? "signup" : "login")}
    />
  );
};

export default Auth;
