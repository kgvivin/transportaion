"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - just redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-neutral-light flex flex-col items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <ShieldAlert className="text-primary mb-2" size={48} />
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-muted">Login to FamilySafe</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@familysafe.app" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2">
            Login
          </button>
          
          <button type="button" onClick={handleLogin} className="btn btn-outline w-full">
            Continue with Google
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account? <a href="#" className="text-primary hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
