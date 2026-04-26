import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Droplets, Eye, EyeOff, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.adminAuth.login.useMutation({
    onSuccess: () => {
      setLocation("/admin");
    },
    onError: (err) => {
      setError(err.message || "Invalid credentials. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    loginMutation.mutate({ username: username.trim(), password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(0.97 0.015 75)" }}
    >
      {/* Background botanical decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.52 0.10 75), transparent)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.45 0.10 195), transparent)" }}
        />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Card */}
        <div
          className="rounded-3xl p-10 shadow-2xl"
          style={{ background: "oklch(1 0 0)", border: "1px solid oklch(0.88 0.04 75)" }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/manus-storage/ruhi-logo-clean_b23934de.png"
              alt="Ruhi Wellness"
              className="h-20 w-auto object-contain mx-auto mb-3" />
            <p className="text-sm" style={{ color: "oklch(0.55 0.04 65)" }}>
              Admin Panel — Sign In
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "oklch(0.45 0.06 65)" }}
              >
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "oklch(0.65 0.05 65)" }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "oklch(0.97 0.015 75)",
                    border: "1.5px solid oklch(0.88 0.04 75)",
                    color: "oklch(0.18 0.05 60)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "oklch(0.52 0.10 75)";
                    e.target.style.boxShadow = "0 0 0 3px oklch(0.52 0.10 75 / 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "oklch(0.88 0.04 75)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "oklch(0.45 0.06 65)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "oklch(0.65 0.05 65)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "oklch(0.97 0.015 75)",
                    border: "1.5px solid oklch(0.88 0.04 75)",
                    color: "oklch(0.18 0.05 60)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "oklch(0.52 0.10 75)";
                    e.target.style.boxShadow = "0 0 0 3px oklch(0.52 0.10 75 / 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "oklch(0.88 0.04 75)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                  style={{ color: "oklch(0.65 0.05 65)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "oklch(0.95 0.04 25)",
                  border: "1px solid oklch(0.75 0.12 25)",
                  color: "oklch(0.40 0.15 25)",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "oklch(0.52 0.10 75)",
                color: "oklch(0.98 0.01 75)",
              }}
              onMouseEnter={(e) => {
                if (!loginMutation.isPending)
                  (e.target as HTMLButtonElement).style.background = "oklch(0.45 0.10 75)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = "oklch(0.52 0.10 75)";
              }}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In to Admin Panel"
              )}
            </button>
          </form>

          {/* Back to site */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs transition-colors"
              style={{ color: "oklch(0.65 0.05 65)" }}
            >
              Back to Ruhi Wellness website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
