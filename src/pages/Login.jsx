import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Rural3DScene from "../components/Rural3DScene";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">

      {/* 3D Side */}
      <div className="login-visual">
        <Rural3DScene />
      </div>

      {/* Login Form */}
      <div className="login-section">
        <div className="login-card">

          <div className="login-logo">
            <span>🌾</span>
            <div>
              <h2>Gram-Pragati AI</h2>
              <p>Business Partner for Rural India</p>
            </div>
          </div>

          <div className="login-heading">
            <h1>Welcome back 👋</h1>
            <p>Login to continue your business journey.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="form-error" role="alert" style={{ color: "#b91c1c", marginBottom: "12px", fontSize: "14px" }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Email or Mobile Number</label>
              <input
                type="text"
                placeholder="Enter email or mobile number"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label>Password</label>

                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button className="login-button" type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
              <ArrowRight size={19} />
            </button>

          </form>

          <div className="register-text">
            Don't have an account?
            <Link to="/register"> Create Account</Link>
          </div>

        </div>
      </div>

    </div>
  );
}