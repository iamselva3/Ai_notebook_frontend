import { useState, useMemo } from "react";
import { apiFetch } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate stars once and memoize them so they don't re-render on every keystroke
  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []); // Empty dependency array means this runs only once

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      toast.warning("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      toast.success("Registration successful. Please login.");
      nav("/");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Static aurora effect - no animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top green aurora layer */}
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-r from-teal-500/10 to-emerald-400/15 rounded-full blur-3xl"></div>
        <div className="absolute -top-60 -right-40 w-[700px] h-[700px] bg-gradient-to-l from-teal-500/10 to-emerald-400/15 rounded-full blur-3xl"></div>
        
        {/* Bottom purple aurora layer */}
        <div className="absolute -bottom-40 -left-40 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-violet-400/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-60 -right-40 w-[700px] h-[700px] bg-gradient-to-l from-purple-600/10 to-violet-500/15 rounded-full blur-3xl"></div>
        
        {/* Middle blue aurora layer */}
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gradient-to-b from-blue-400/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        
        {/* Static stars - pre-generated and memoized */}
        <div className="absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>
      </div>

      {/* Register Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Register</h2>

          <div className="space-y-4">
            <input
              className="w-full p-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full p-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>

          <p className="mt-6 text-center text-white/80">
            Already have an account?{" "}
            <Link 
              to="/" 
              className="text-blue-300 hover:text-blue-200 underline font-semibold transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}